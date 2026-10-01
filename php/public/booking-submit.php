<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

const BOOKING_LIMIT_PER_HOUR = 5;

function redirectToSignup(string $type, string $messageKey): void
{
    $_SESSION['booking_flash'] = ['type' => $type, 'message' => $messageKey];
    header('Location: /#signup-form', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /#signup', true, 303);
    exit;
}

if (!Security::verifyCsrf($_POST['_csrf'] ?? null)) {
    redirectToSignup('error', 'signup.errCsrf');
}

// Honeypot: real users never fill the hidden field. Pretend success to bots.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    redirectToSignup('success', 'signup.thanks');
}

$name = trim((string) ($_POST['name'] ?? ''));
$nameLength = mb_strlen($name);
if ($nameLength < 2 || $nameLength > 80) {
    redirectToSignup('error', 'signup.errValidation');
}

$phone = Phone::normalize((string) ($_POST['phone'] ?? ''));
if ($phone === null) {
    redirectToSignup('error', 'signup.phoneErr');
}

$message = trim((string) ($_POST['message'] ?? ''));
if (mb_strlen($message) > 1000) {
    redirectToSignup('error', 'signup.errValidation');
}

$preferredDate = trim((string) ($_POST['preferredDate'] ?? ''));
if ($preferredDate !== '') {
    $parsed = DateTime::createFromFormat('!Y-m-d', $preferredDate);
    if ($parsed === false || $parsed->format('Y-m-d') !== $preferredDate) {
        redirectToSignup('error', 'signup.errValidation');
    }
}

try {
    $directionKey = (string) ($_POST['direction'] ?? '');
    $classId = null;

    if ($directionKey === 'undecided') {
        $direction = I18n::translateIn('ru', 'signup.undecided');
    } else {
        [$type, $slug] = array_pad(explode(':', $directionKey, 2), 2, '');
        $kind = $type === 'mc' ? 'master_class' : 'course';
        $class = in_array($type, ['course', 'mc'], true) ? ClassRepository::findPublished($slug, $kind) : null;
        if ($class === null) {
            redirectToSignup('error', 'signup.errValidation');
        }
        $classId = (int) $class['id'];
        $direction = $type === 'mc'
            ? I18n::translateIn('ru', 'signup.mcPrefix') . ' ' . $class['title_ru']
            : (string) $class['title_ru'];
    }

    $ipHash = Security::hashIp(Security::clientIp());
    if (BookingRepository::countRecentFromIp($ipHash, 60) >= BOOKING_LIMIT_PER_HOUR) {
        redirectToSignup('error', 'signup.errRateLimit');
    }

    $booking = [
        'name' => $name,
        'phone' => $phone,
        'direction' => $direction,
        'preferred_date' => $preferredDate !== '' ? $preferredDate : null,
        'message' => $message !== '' ? $message : null,
    ];

    $bookingId = BookingRepository::create(
        $classId,
        $booking['name'],
        $booking['phone'],
        $booking['direction'],
        $booking['preferred_date'],
        $booking['message'],
        $ipHash,
    );

    // The booking is already saved: a Telegram outage must not turn into an error for the visitor.
    if (Notifier::booking($booking)) {
        BookingRepository::markTelegramSent($bookingId);
    }

    redirectToSignup('success', 'signup.thanks');
} catch (RuntimeException $exception) {
    error_log('[booking-submit] ' . $exception->getMessage());
    redirectToSignup('error', 'signup.errGeneric');
}

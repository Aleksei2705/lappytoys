<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

function guideJson(int $status, string $error = ''): void
{
    http_response_code($status);
    echo json_encode($error === '' ? ['ok' => true] : ['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    guideJson(405, 'method');
}

if (!Security::verifyCsrf($_POST['_csrf'] ?? null)) {
    guideJson(403, I18n::translate('guide.errCsrf'));
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    guideJson(200);
}

if (!Turnstile::verify(isset($_POST['cf-turnstile-response']) ? (string) $_POST['cf-turnstile-response'] : null)) {
    guideJson(400, I18n::translate('guide.errCaptcha'));
}

$phone = Phone::normalize((string) ($_POST['phone'] ?? ''));
if ($phone === null) {
    guideJson(400, I18n::translate('signup.phoneErr'));
}

try {
    $ipHash = Security::hashIp(Security::clientIp());
    if (BookingRepository::countRecentFromIp($ipHash, 60) >= 5) {
        guideJson(429, I18n::translate('guide.errRate'));
    }

    BookingRepository::create(
        null,
        'Гайд',
        $phone,
        'Бесплатный гайд по выбору спиц',
        null,
        'Прислать гайд в WhatsApp',
        $ipHash,
    );
    Notifier::guide($phone);
    guideJson(200);
} catch (RuntimeException $exception) {
    error_log('[guide-submit] ' . $exception->getMessage());
    guideJson(500, I18n::translate('guide.errGeneric'));
}

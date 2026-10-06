<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

const REVIEW_LIMIT_PER_HOUR = 3;
const REVIEW_TEXT_MAX = 1200;

function redirectToReviews(string $type, string $messageKey): void
{
    $_SESSION['review_flash'] = ['type' => $type, 'message' => $messageKey];
    header('Location: /#review-form', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /#reviews', true, 303);
    exit;
}

if (!Security::verifyCsrf($_POST['_csrf'] ?? null)) {
    redirectToReviews('error', 'review.errCsrf');
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    redirectToReviews('success', 'review.thanks');
}

$name = trim((string) ($_POST['name'] ?? ''));
$text = trim((string) ($_POST['text'] ?? ''));
$rating = (int) ($_POST['rating'] ?? 5);
$courseKey = (string) ($_POST['course'] ?? '');

$nameLength = mb_strlen($name);
$textLength = mb_strlen($text);
if ($nameLength < 2 || $nameLength > 60 || $textLength < 5 || $textLength > REVIEW_TEXT_MAX || $rating < 1 || $rating > 5) {
    redirectToReviews('error', 'review.errValidation');
}

$photoPath = null;
$file = $_FILES['photo'] ?? null;
$hasUpload = is_array($file) && (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;

try {
    if ($hasUpload) {
        try {
            $photoPath = Admin::storeImage($file, 'reviews');
        } catch (InvalidArgumentException) {
            redirectToReviews('error', 'review.errPhoto');
        }
    }

    $classId = null;
    $courseRu = '';
    $courseKk = null;

    if ($courseKey === 'mc' || $courseKey === 'other') {
        $labelKey = $courseKey === 'mc' ? 'review.option.mc' : 'review.option.other';
        $courseRu = I18n::translateIn('ru', $labelKey);
        $courseKk = I18n::translateIn('kk', $labelKey);
    } elseif (str_starts_with($courseKey, 'shop:')) {
        $slug = substr($courseKey, 5);
        $product = Shop::findPublished($slug);
        if ($product === null) {
            if ($photoPath !== null) {
                Admin::deleteUploadedImage($photoPath);
            }
            redirectToReviews('error', 'review.errValidation');
        }
        $courseRu = (string) $product['title_ru'];
        $courseKk = $product['title_kk'] !== null ? (string) $product['title_kk'] : null;
    } else {
        $class = ClassRepository::findPublishedBySlug($courseKey);
        if ($class === null) {
            if ($photoPath !== null) {
                Admin::deleteUploadedImage($photoPath);
            }
            redirectToReviews('error', 'review.errValidation');
        }
        $classId = (int) $class['id'];
        $courseRu = (string) $class['title_ru'];
        $courseKk = $class['title_kk'] !== null ? (string) $class['title_kk'] : null;
    }

    $ipHash = Security::hashIp(Security::clientIp());
    if (ReviewRepository::countRecentFromIp($ipHash, 60) >= REVIEW_LIMIT_PER_HOUR) {
        if ($photoPath !== null) {
            Admin::deleteUploadedImage($photoPath);
        }
        redirectToReviews('error', 'review.errRateLimit');
    }

    ReviewRepository::create($name, $classId, $courseRu, $courseKk, $text, $rating, $ipHash, $photoPath);
    Notifier::review([
        'name' => $name,
        'course' => $courseRu,
        'rating' => $rating,
        'text' => $text,
        'has_photo' => $photoPath !== null,
    ]);
    redirectToReviews('success', 'review.thanks');
} catch (RuntimeException $exception) {
    if ($photoPath !== null) {
        Admin::deleteUploadedImage($photoPath);
    }
    error_log('[review-submit] ' . $exception->getMessage());
    redirectToReviews('error', 'review.errGeneric');
}

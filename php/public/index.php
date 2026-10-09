<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

try {
    $courses = ClassRepository::published('course');
    $masterClasses = ClassRepository::published('master_class');
    $reviews = ReviewRepository::approved();
} catch (RuntimeException $exception) {
    showErrorPage(503, 'page.unavailable', 'page.unavailableText');
    exit;
}

$shopProducts = [];
try {
    $shopProducts = Shop::published();
} catch (RuntimeException) {
    $shopProducts = [];
}

$heroFeature = null;
try {
    $heroFeature = SiteContent::heroFeature();
} catch (RuntimeException) {
    $heroFeature = null;
}

$canonicalPath = '/';
$returnPath = '/';

require APP_ROOT . '/templates/layout/header.php';

foreach (['hero', 'stats', 'about', 'awards', 'courses', 'master-classes', 'online', 'schedule', 'works', 'instagram', 'tiktok', 'reviews', 'benefits', 'faq', 'contacts', 'signup'] as $section) {
    require APP_ROOT . '/templates/home/' . $section . '.php';
}

render('partials/whatsapp-float');

require APP_ROOT . '/templates/layout/footer.php';

<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

$locale = (string) ($_GET['set'] ?? '');
if (I18n::isSupported($locale)) {
    setcookie(I18n::COOKIE, $locale, [
        'expires' => time() + 31536000,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

header('Location: ' . safeLocalPath($_GET['back'] ?? null), true, 303);
exit;

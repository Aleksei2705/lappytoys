<?php
declare(strict_types=1);

define('APP_ROOT', dirname(__DIR__));

spl_autoload_register(static function (string $class): void {
    $file = APP_ROOT . '/app/' . $class . '.php';
    if (is_readable($file)) {
        require $file;
    }
});

require APP_ROOT . '/app/helpers.php';

Config::load(APP_ROOT . '/.env');

date_default_timezone_set('Asia/Almaty');
mb_internal_encoding('UTF-8');

ini_set('display_errors', Config::isProduction() ? '0' : '1');
ini_set('log_errors', '1');
error_reporting(E_ALL);

/** Short alias for templates: <?= e($value) ?> */
function e(?string $value): string
{
    return Security::escape($value);
}

if (PHP_SAPI !== 'cli') {
    Security::sendHeaders();
    Security::startSession();
}

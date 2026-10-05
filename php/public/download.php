<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

$token = (string) ($_GET['token'] ?? '');

try {
    $order = Shop::orderByToken($token);
} catch (RuntimeException) {
    $order = null;
}

$file = is_array($order) ? (string) ($order['file_path'] ?? '') : '';
$path = APP_ROOT . '/storage/shop/' . $file;
$allowed = is_array($order)
    && ($order['status'] ?? '') === 'paid'
    && preg_match('#^[a-f0-9]{16}\.(mp4|webm|pdf|zip)$#', $file) === 1
    && is_file($path);

if (!$allowed) {
    showErrorPage(404, 'page.notFound', 'page.notFoundText');
    exit;
}

$downloadName = (string) ($order['file_name'] ?? 'lappy-art');
$downloadName = str_replace(['"', "\r", "\n"], '', $downloadName);
$mime = mime_content_type($path);
if (!is_string($mime) || $mime === '') {
    $mime = 'application/octet-stream';
}

header('Content-Type: ' . $mime);
header('Content-Length: ' . (string) filesize($path));
header('Content-Disposition: attachment; filename="download"; filename*=UTF-8\'\'' . rawurlencode($downloadName));
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
readfile($path);
exit;

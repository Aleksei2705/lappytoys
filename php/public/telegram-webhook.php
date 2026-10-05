<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit;
}

$secret = Telegram::webhookSecret();
if ($secret !== '') {
    $header = (string) ($_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN'] ?? '');
    if (!hash_equals($secret, $header)) {
        http_response_code(403);
        exit;
    }
}

$raw = file_get_contents('php://input');
$update = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($update)) {
    http_response_code(400);
    exit;
}

try {
    TelegramWebhook::handle($update);
} catch (Throwable $exception) {
    error_log('[telegram-webhook] ' . $exception->getMessage());
}

header('Content-Type: application/json; charset=utf-8');
echo '{"ok":true}';

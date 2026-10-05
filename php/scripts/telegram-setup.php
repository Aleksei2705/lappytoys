<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/app/bootstrap.php';

/**
 * Usage:
 *   php scripts/telegram-setup.php chat-id   — lists chats that recently wrote to the bot
 *   php scripts/telegram-setup.php test         — sends a test message to TELEGRAM_CHAT_ID
 *   php scripts/telegram-setup.php webhook-set  — registers https://APP_URL/telegram-webhook.php
 *   php scripts/telegram-setup.php webhook-info — shows current webhook
 */
$mode = $argv[1] ?? '';

if (Config::get('TELEGRAM_BOT_TOKEN') === '') {
    fwrite(STDERR, "TELEGRAM_BOT_TOKEN is empty in .env\n");
    exit(1);
}

if ($mode === 'chat-id') {
    $response = Telegram::call('getUpdates');
    if (!is_array($response) || ($response['ok'] ?? false) !== true) {
        fwrite(STDERR, 'getUpdates failed: ' . ($response['description'] ?? 'no response') . "\n");
        exit(1);
    }

    $chats = [];
    foreach ($response['result'] as $update) {
        $message = $update['message'] ?? $update['channel_post'] ?? $update['my_chat_member'] ?? null;
        $chat = $message['chat'] ?? null;
        if (is_array($chat)) {
            $chats[(string) $chat['id']] = $chat['title'] ?? $chat['username'] ?? $chat['first_name'] ?? '?';
        }
    }

    if ($chats === []) {
        echo "No chats found. Send any message to the bot (or add it to a group and write there), then run again.\n";
        exit(0);
    }
    foreach ($chats as $id => $title) {
        echo "{$id}  {$title}\n";
    }
    exit(0);
}

if ($mode === 'test') {
    $sent = Telegram::send('✅ Тестовое сообщение с сайта lappytoys.kz — уведомления работают.');
    echo $sent ? "Sent.\n" : "Failed. Check TELEGRAM_CHAT_ID and that the bot was started / added to the chat. See the PHP error log.\n";
    exit($sent ? 0 : 1);
}

if ($mode === 'webhook-set') {
    $base = rtrim((string) Config::get('APP_URL'), '/');
    if ($base === '') {
        fwrite(STDERR, "APP_URL is empty in .env\n");
        exit(1);
    }
    $payload = ['url' => $base . '/telegram-webhook.php'];
    $secret = Config::get('TELEGRAM_WEBHOOK_SECRET');
    if ($secret !== '') {
        $payload['secret_token'] = $secret;
    }
    $response = Telegram::call('setWebhook', $payload);
    if (!is_array($response) || ($response['ok'] ?? false) !== true) {
        fwrite(STDERR, 'setWebhook failed: ' . ($response['description'] ?? 'no response') . "\n");
        exit(1);
    }
    echo "Webhook: {$payload['url']}\n";
    exit(0);
}

if ($mode === 'webhook-info') {
    $response = Telegram::call('getWebhookInfo');
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    exit(is_array($response) && ($response['ok'] ?? false) === true ? 0 : 1);
}

fwrite(STDERR, "Usage: php scripts/telegram-setup.php chat-id|test|webhook-set|webhook-info\n");
exit(1);

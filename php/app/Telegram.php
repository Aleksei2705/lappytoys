<?php
declare(strict_types=1);

final class Telegram
{
    private const TIMEOUT_SECONDS = 6;

    private static string $lastError = '';

    public static function isConfigured(): bool
    {
        return Config::get('TELEGRAM_BOT_TOKEN') !== '' && Config::get('TELEGRAM_CHAT_ID') !== '';
    }

    public static function lastError(): string
    {
        return self::$lastError;
    }

    /** Numeric chat id (e.g. 123456789 or -100…). @username will not work. */
    public static function chatIdIssue(): ?string
    {
        $id = trim(Config::get('TELEGRAM_CHAT_ID'));
        if ($id === '') {
            return 'TELEGRAM_CHAT_ID пустой.';
        }
        if (str_contains($id, '@') || preg_match('/^-?\d{5,20}$/', $id) !== 1) {
            return 'TELEGRAM_CHAT_ID должен быть числом (узнать: @userinfobot или php scripts/telegram-setup.php chat-id), не @username.';
        }
        return null;
    }

    /** @param array<string, mixed>|null $replyMarkup Inline keyboard etc. */
    public static function send(string $html, ?array $replyMarkup = null): bool
    {
        if (!self::isConfigured()) {
            self::$lastError = 'TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в .env';
            return false;
        }
        $chatIssue = self::chatIdIssue();
        if ($chatIssue !== null) {
            self::$lastError = $chatIssue;
            error_log('[telegram] ' . $chatIssue);
            return false;
        }

        $payload = [
            'chat_id' => Config::get('TELEGRAM_CHAT_ID'),
            'text' => $html,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => true,
        ];
        if ($replyMarkup !== null) {
            $payload['reply_markup'] = $replyMarkup;
        }

        return self::deliver($payload);
    }

    /** @param array<string, mixed>|null $replyMarkup */
    public static function sendTo(string $chatId, string $html, ?array $replyMarkup = null): bool
    {
        if (Config::get('TELEGRAM_BOT_TOKEN') === '') {
            self::$lastError = 'TELEGRAM_BOT_TOKEN пустой.';
            return false;
        }
        if (preg_match('/^-?\d{5,20}$/', $chatId) !== 1) {
            self::$lastError = 'Некорректный chat id.';
            return false;
        }
        $payload = [
            'chat_id' => $chatId,
            'text' => $html,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => true,
        ];
        if ($replyMarkup !== null) {
            $payload['reply_markup'] = $replyMarkup;
        }
        return self::deliver($payload);
    }

    /** @param array<string, mixed> $payload */
    private static function deliver(array $payload): bool
    {
        $response = self::call('sendMessage', $payload);
        $ok = is_array($response) && ($response['ok'] ?? false) === true;
        if (!$ok) {
            self::$lastError = self::errorText($response);
            error_log('[telegram] sendMessage failed: ' . self::$lastError);
        } else {
            self::$lastError = '';
        }
        return $ok;
    }

    /** One-time invite into a closed channel. The bot must be an admin who can invite. */
    public static function channelInvite(string $chatId, string $name): ?string
    {
        if (preg_match('/^-\d{5,20}$/', $chatId) !== 1) {
            self::$lastError = 'ID канала должен быть числом вида -100…';
            return null;
        }
        $name = mb_substr($name, 0, 32);
        $attempts = [
            ['chat_id' => $chatId, 'name' => $name, 'member_limit' => 1],
            ['chat_id' => $chatId, 'name' => $name, 'creates_join_request' => true],
            ['chat_id' => $chatId, 'name' => $name],
        ];
        $last = 'Telegram не вернул ссылку приглашения.';
        foreach ($attempts as $payload) {
            $response = self::call('createChatInviteLink', $payload);
            $result = is_array($response) ? ($response['result'] ?? null) : null;
            $link = is_array($result) ? trim((string) ($result['invite_link'] ?? '')) : '';
            if (is_array($response) && ($response['ok'] ?? false) === true && $link !== '') {
                self::$lastError = '';
                return $link;
            }
            $last = self::errorText($response);
            error_log('[telegram] createChatInviteLink failed: ' . $last);
        }
        self::$lastError = $last;
        return null;
    }

    /** Public HTTPS endpoint Telegram calls when an inline button is pressed. */
    public static function webhookUrl(): string
    {
        $base = rtrim(Config::get('APP_URL'), '/');
        if ($base === '') {
            $base = rtrim((string) site('url'), '/');
        }
        return $base . '/telegram-webhook.php';
    }

    /** Secret Telegram sends back in X-Telegram-Bot-Api-Secret-Token. Empty means the check is off. */
    public static function webhookSecret(): string
    {
        $fromEnv = Config::get('TELEGRAM_WEBHOOK_SECRET');
        if ($fromEnv !== '') {
            return $fromEnv;
        }
        $path = APP_ROOT . '/storage/telegram-webhook.secret';
        if (!is_readable($path)) {
            return '';
        }
        $value = trim((string) file_get_contents($path));
        return preg_match('/^[A-Za-z0-9_-]{16,128}$/', $value) === 1 ? $value : '';
    }

    /**
     * Registers the shop-button webhook once. Later calls skip the API if this URL is already saved.
     */
    public static function ensureWebhook(): bool
    {
        $url = self::webhookUrl();
        $stamp = APP_ROOT . '/storage/telegram-webhook.url';
        if (is_readable($stamp) && trim((string) file_get_contents($stamp)) === $url . ' id') {
            return true;
        }
        $result = self::registerWebhook();
        return $result['ok'];
    }

    /** @return array{ok: bool, detail: string} */
    public static function registerWebhook(): array
    {
        if (Config::get('TELEGRAM_BOT_TOKEN') === '') {
            self::$lastError = 'TELEGRAM_BOT_TOKEN пустой.';
            return ['ok' => false, 'detail' => self::$lastError];
        }
        $url = self::webhookUrl();
        if (!str_starts_with($url, 'https://')) {
            self::$lastError = 'APP_URL должен начинаться с https://';
            return ['ok' => false, 'detail' => self::$lastError];
        }

        $secret = self::webhookSecret();
        if ($secret === '') {
            $secret = bin2hex(random_bytes(16));
            $dir = APP_ROOT . '/storage';
            if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
                $secret = '';
            } elseif (file_put_contents($dir . '/telegram-webhook.secret', $secret) === false) {
                $secret = '';
            }
        }

        $payload = [
            'url' => $url,
            'allowed_updates' => ['callback_query', 'my_chat_member', 'message', 'channel_post'],
        ];
        if ($secret !== '') {
            $payload['secret_token'] = $secret;
        }

        $response = self::call('setWebhook', $payload);
        $ok = is_array($response) && ($response['ok'] ?? false) === true;
        if (!$ok) {
            self::$lastError = self::errorText($response);
            error_log('[telegram] setWebhook failed: ' . self::$lastError);
            return ['ok' => false, 'detail' => self::$lastError];
        }

        $stamp = APP_ROOT . '/storage/telegram-webhook.url';
        file_put_contents($stamp, $url . ' id');
        self::$lastError = '';
        return ['ok' => true, 'detail' => $url];
    }

    /** @param array<string, mixed>|null $response */
    public static function errorText(?array $response): string
    {
        if ($response === null) {
            return 'no response (network or curl)';
        }
        $code = $response['error_code'] ?? '';
        $desc = $response['description'] ?? 'unknown';
        return trim($code . ' ' . $desc);
    }

    /** @return array<string, mixed>|null */
    public static function call(string $method, array $payload = []): ?array
    {
        $token = Config::get('TELEGRAM_BOT_TOKEN');
        if ($token === '') {
            return null;
        }

        $url = 'https://api.telegram.org/bot' . $token . '/' . $method;
        $body = json_encode($payload, JSON_UNESCAPED_UNICODE);
        if (!is_string($body)) {
            return null;
        }

        try {
            $raw = function_exists('curl_init') ? self::viaCurl($url, $body) : self::viaStream($url, $body);
        } catch (Throwable $exception) {
            // The URL contains the bot token, so only the message is logged.
            error_log('[telegram] request error: ' . str_replace($token, '***', $exception->getMessage()));
            return null;
        }

        $decoded = is_string($raw) ? json_decode($raw, true) : null;
        return is_array($decoded) ? $decoded : null;
    }

    private static function viaCurl(string $url, string $body): string|false
    {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => self::TIMEOUT_SECONDS,
            CURLOPT_TIMEOUT => self::TIMEOUT_SECONDS,
        ]);
        $result = curl_exec($curl);
        if ($result === false) {
            error_log('[telegram] curl error: ' . curl_error($curl));
        }
        curl_close($curl);
        return $result;
    }

    private static function viaStream(string $url, string $body): string|false
    {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $body,
            'timeout' => self::TIMEOUT_SECONDS,
            'ignore_errors' => true,
        ]]);
        return @file_get_contents($url, false, $context);
    }
}

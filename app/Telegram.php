<?php
declare(strict_types=1);

final class Telegram
{
    private const TIMEOUT_SECONDS = 6;

    public static function isConfigured(): bool
    {
        return Config::get('TELEGRAM_BOT_TOKEN') !== '' && Config::get('TELEGRAM_CHAT_ID') !== '';
    }

    /** Sends an HTML-formatted message to the configured chat. Never throws; returns success. */
    public static function send(string $html): bool
    {
        if (!self::isConfigured()) {
            return false;
        }

        $payload = [
            'chat_id' => Config::get('TELEGRAM_CHAT_ID'),
            'text' => $html,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => 'true',
        ];

        $response = self::call('sendMessage', $payload);
        $ok = is_array($response) && ($response['ok'] ?? false) === true;
        if (!$ok) {
            error_log('[telegram] sendMessage failed: ' . ($response['description'] ?? 'no response'));
        }
        return $ok;
    }

    /** @return array<string, mixed>|null */
    public static function call(string $method, array $payload = []): ?array
    {
        $token = Config::get('TELEGRAM_BOT_TOKEN');
        if ($token === '') {
            return null;
        }

        $url = 'https://api.telegram.org/bot' . $token . '/' . $method;
        $body = http_build_query($payload);

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
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => self::TIMEOUT_SECONDS,
            CURLOPT_TIMEOUT => self::TIMEOUT_SECONDS,
        ]);
        $result = curl_exec($curl);
        curl_close($curl);
        return $result;
    }

    private static function viaStream(string $url, string $body): string|false
    {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $body,
            'timeout' => self::TIMEOUT_SECONDS,
            'ignore_errors' => true,
        ]]);
        return @file_get_contents($url, false, $context);
    }
}

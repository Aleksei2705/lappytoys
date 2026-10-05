<?php
declare(strict_types=1);

final class Telegram
{
    private const TIMEOUT_SECONDS = 6;

    public static function isConfigured(): bool
    {
        return Config::get('TELEGRAM_BOT_TOKEN') !== '' && Config::get('TELEGRAM_CHAT_ID') !== '';
    }

    /** @param array<string, mixed>|null $replyMarkup Inline keyboard etc. */
    public static function send(string $html, ?array $replyMarkup = null): bool
    {
        if (!self::isConfigured()) {
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

        $response = self::call('sendMessage', $payload);
        $ok = is_array($response) && ($response['ok'] ?? false) === true;
        if (!$ok) {
            error_log('[telegram] sendMessage failed: ' . self::errorText($response));
        }
        return $ok;
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

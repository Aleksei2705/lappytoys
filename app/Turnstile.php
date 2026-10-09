<?php
declare(strict_types=1);

final class Turnstile
{
    private const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    public static function siteKey(): string
    {
        return Config::get('TURNSTILE_SITE_KEY');
    }

    public static function enabled(): bool
    {
        return self::siteKey() !== '' && Config::get('TURNSTILE_SECRET_KEY') !== '';
    }

    public static function verify(?string $token): bool
    {
        if (!self::enabled()) {
            return true;
        }

        $token = trim((string) $token);
        if ($token === '' || strlen($token) > 2048) {
            return false;
        }

        $body = http_build_query([
            'secret' => Config::get('TURNSTILE_SECRET_KEY'),
            'response' => $token,
            'remoteip' => Security::clientIp(),
        ]);

        try {
            $raw = function_exists('curl_init') ? self::viaCurl($body) : self::viaStream($body);
        } catch (Throwable $exception) {
            error_log('[turnstile] ' . $exception->getMessage());
            return false;
        }

        $decoded = is_string($raw) ? json_decode($raw, true) : null;
        return is_array($decoded) && ($decoded['success'] ?? false) === true;
    }

    private static function viaCurl(string $body): string|false
    {
        $curl = curl_init(self::VERIFY_URL);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 8,
        ]);
        $result = curl_exec($curl);
        if ($result === false) {
            error_log('[turnstile] curl error: ' . curl_error($curl));
        }
        curl_close($curl);
        return $result;
    }

    private static function viaStream(string $body): string|false
    {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 8,
            'ignore_errors' => true,
        ]]);
        return @file_get_contents(self::VERIFY_URL, false, $context);
    }
}

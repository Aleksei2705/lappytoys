<?php
declare(strict_types=1);

final class Security
{
    private const CSRF_KEY = '_csrf';

    public static function startSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
        session_name('lappy_sid');
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }

    public static function sendHeaders(): void
    {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
        header(
            "Content-Security-Policy: default-src 'self'; " .
            "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; " .
            "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://mc.yandex.ru https://mc.yandex.com https://mc.yandex.kz https://mc.webvisor.com https://mc.webvisor.org https://yastatic.net https://informer.yandex.ru https://www.instagram.com https://www.tiktok.com https://lf16-tiktok-web.tiktokcdn-us.com https://sf16-website-login.neutral.ttwstatic.com; " .
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://yastatic.net https://lf16-tiktok-web.tiktokcdn-us.com https://sf16-website-login.neutral.ttwstatic.com; " .
            "font-src 'self' https://fonts.gstatic.com https://yastatic.net; " .
            "img-src 'self' data: https://mc.yandex.ru https://mc.yandex.com https://mc.yandex.kz https://mc.webvisor.com https://mc.webvisor.org https://informer.yandex.ru https://i.ytimg.com https://*.cdninstagram.com https://*.fbcdn.net https://*.tiktokcdn.com https://*.tiktokcdn-us.com https://*.tiktokcdn-eu.com; " .
            "frame-src https://challenges.cloudflare.com https://mc.yandex.ru https://mc.yandex.com https://mc.yandex.kz https://mc.yandex.md https://mc.webvisor.com https://mc.webvisor.org https://yandex.ru https://www.youtube.com https://www.instagram.com https://www.tiktok.com https://*.tiktok.com; " .
            "connect-src 'self' https://challenges.cloudflare.com https://mc.yandex.ru https://mc.yandex.com https://mc.yandex.kz https://mc.webvisor.com https://mc.webvisor.org wss://mc.yandex.ru wss://mc.yandex.com wss://mc.yandex.kz wss://mc.webvisor.com wss://mc.webvisor.org https://yastatic.net https://www.instagram.com https://www.tiktok.com https://*.tiktok.com https://lf16-tiktok-web.tiktokcdn-us.com https://libraweb.tiktokw.us https://libraweb-va.tiktok.com https://libraweb-sg.tiktok.com https://libraweb.tiktokw.eu"
        );
    }

    public static function escape(?string $value): string
    {
        return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public static function csrfToken(): string
    {
        if (empty($_SESSION[self::CSRF_KEY])) {
            $_SESSION[self::CSRF_KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::CSRF_KEY];
    }

    public static function csrfField(): string
    {
        return '<input type="hidden" name="_csrf" value="' . self::escape(self::csrfToken()) . '">';
    }

    public static function verifyCsrf(?string $token): bool
    {
        $expected = $_SESSION[self::CSRF_KEY] ?? '';
        return is_string($expected) && $expected !== '' && is_string($token) && hash_equals($expected, $token);
    }

    public static function requireCsrf(): void
    {
        if (!self::verifyCsrf($_POST['_csrf'] ?? null)) {
            http_response_code(419);
            exit('Сессия устарела. Обновите страницу и повторите.');
        }
    }

    public static function hashIp(string $ip): string
    {
        return hash('sha256', $ip . Config::get('IP_HASH_SALT'));
    }

    public static function clientIp(): string
    {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

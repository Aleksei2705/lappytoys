<?php
declare(strict_types=1);

/** One-time codes for phone confirmation (delivered via Telegram bot). */
final class PhoneVerify
{
    private const SESSION_KEY = 'phone_verified_until';
    private const SEND_HITS = 'phone_verify_send_hits';
    private const TTL_SECONDS = 600;
    private const VERIFIED_TTL = 3600;
    private const MAX_SENDS_PER_HOUR = 8;
    private const MAX_ATTEMPTS = 6;

    public static function ensureTables(): void
    {
        Database::execute(
            'CREATE TABLE IF NOT EXISTS phone_verify_challenges (
                token CHAR(32) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                code_hash CHAR(64) NOT NULL,
                code_sealed VARCHAR(96) NOT NULL,
                chat_id VARCHAR(20) NULL,
                attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
                verified_at DATETIME NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (token),
                KEY phone_verify_phone (phone),
                KEY phone_verify_expires (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

    /** @return array{token: string, botUrl: string}|null */
    public static function begin(string $rawPhone): ?array
    {
        $phone = Phone::normalize($rawPhone);
        if ($phone === null || !self::allowSend()) {
            return null;
        }

        self::ensureTables();
        self::purgeExpired();

        $token = bin2hex(random_bytes(16));
        $code = (string) random_int(100000, 999999);
        $expires = date('Y-m-d H:i:s', time() + self::TTL_SECONDS);

        Database::execute(
            'INSERT INTO phone_verify_challenges (token, phone, code_hash, code_sealed, expires_at) VALUES (?, ?, ?, ?, ?)',
            [$token, $phone, hash('sha256', $code), self::sealCode($code), $expires],
        );

        self::recordSend();

        return [
            'token' => $token,
            'botUrl' => self::botUrl($token),
        ];
    }

    public static function deliverTelegram(string $token, string $chatId): bool
    {
        if (preg_match('/^[a-f0-9]{32}$/', $token) !== 1 || preg_match('/^\d{5,20}$/', $chatId) !== 1) {
            return false;
        }

        self::ensureTables();
        $row = Database::fetchOne(
            'SELECT token, phone, code_sealed, chat_id, expires_at, verified_at
             FROM phone_verify_challenges WHERE token = ? LIMIT 1',
            [$token],
        );
        if ($row === null) {
            Telegram::sendTo($chatId, 'Ссылка устарела. На сайте нажмите «Получить код» ещё раз.');
            return false;
        }
        if ($row['verified_at'] !== null) {
            Telegram::sendTo($chatId, 'Этот код уже использован. Запросите новый на сайте.');
            return false;
        }
        if (strtotime((string) $row['expires_at']) < time()) {
            Telegram::sendTo($chatId, 'Срок кода истёк. На сайте нажмите «Получить код» ещё раз.');
            return false;
        }

        $storedChat = trim((string) ($row['chat_id'] ?? ''));
        if ($storedChat !== '' && $storedChat !== $chatId) {
            Telegram::sendTo($chatId, 'Код уже отправлен в другой чат Telegram. Запросите новый на сайте.');
            return false;
        }

        $code = self::unsealCode((string) $row['code_sealed']);
        if ($code === null) {
            Telegram::sendTo($chatId, 'Не удалось отправить код. Попробуйте «Получить код» на сайте ещё раз.');
            return false;
        }

        Database::execute(
            'UPDATE phone_verify_challenges SET chat_id = ? WHERE token = ?',
            [$chatId, $token],
        );

        $masked = self::maskPhone((string) $row['phone']);
        $text = "Код для подтверждения телефона {$masked} на lappytoys.kz:\n\n<b>{$code}</b>\n\nВведите его на сайте. Код действует 10 минут.";
        return Telegram::sendTo($chatId, $text);
    }

    public static function confirm(string $rawPhone, string $code): bool
    {
        $phone = Phone::normalize($rawPhone);
        if ($phone === null || preg_match('/^\d{6}$/', $code) !== 1) {
            return false;
        }

        self::ensureTables();
        $row = Database::fetchOne(
            'SELECT token, code_hash, attempts, expires_at, verified_at
             FROM phone_verify_challenges
             WHERE phone = ? AND verified_at IS NULL AND expires_at >= NOW()
             ORDER BY created_at DESC
             LIMIT 1',
            [$phone],
        );
        if ($row === null || (int) $row['attempts'] >= self::MAX_ATTEMPTS) {
            return false;
        }

        $token = (string) $row['token'];
        $ok = hash_equals((string) $row['code_hash'], hash('sha256', $code));
        Database::execute(
            'UPDATE phone_verify_challenges SET attempts = attempts + 1 WHERE token = ?',
            [$token],
        );
        if (!$ok) {
            return false;
        }

        Database::execute(
            'UPDATE phone_verify_challenges SET verified_at = NOW() WHERE token = ?',
            [$token],
        );
        self::markVerified($phone);
        return true;
    }

    public static function isVerified(string $rawPhone): bool
    {
        $phone = Phone::normalize($rawPhone);
        if ($phone === null) {
            return false;
        }
        $until = (int) ($_SESSION[self::SESSION_KEY][$phone] ?? 0);
        return $until > time();
    }

    public static function clearVerified(string $rawPhone): void
    {
        $phone = Phone::normalize($rawPhone);
        if ($phone === null) {
            return;
        }
        unset($_SESSION[self::SESSION_KEY][$phone]);
    }

    private static function markVerified(string $phone): void
    {
        if (!isset($_SESSION[self::SESSION_KEY]) || !is_array($_SESSION[self::SESSION_KEY])) {
            $_SESSION[self::SESSION_KEY] = [];
        }
        $_SESSION[self::SESSION_KEY][$phone] = time() + self::VERIFIED_TTL;
    }

    private static function botUrl(string $token): string
    {
        $bot = trim((string) site('orders_bot'));
        if ($bot === '') {
            $bot = 'lappyart_orders_bot';
        }
        return 'https://t.me/' . rawurlencode($bot) . '?start=pv' . $token;
    }

    private static function allowSend(): bool
    {
        $now = time();
        $hits = array_values(array_filter(
            $_SESSION[self::SEND_HITS] ?? [],
            static fn ($at): bool => is_int($at) && $at > $now - 3600,
        ));
        return count($hits) < self::MAX_SENDS_PER_HOUR;
    }

    private static function recordSend(): void
    {
        $now = time();
        $hits = array_values(array_filter(
            $_SESSION[self::SEND_HITS] ?? [],
            static fn ($at): bool => is_int($at) && $at > $now - 3600,
        ));
        $hits[] = $now;
        $_SESSION[self::SEND_HITS] = $hits;
    }

    private static function purgeExpired(): void
    {
        Database::execute('DELETE FROM phone_verify_challenges WHERE expires_at < NOW() - INTERVAL 1 DAY');
    }

    private static function maskPhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone) ?? '';
        if (strlen($digits) < 4) {
            return $phone;
        }
        return '+' . substr($digits, 0, min(3, strlen($digits))) . ' *** ' . substr($digits, -2);
    }

    private static function sealCode(string $code): string
    {
        $key = self::cryptoKey();
        $iv = random_bytes(16);
        $cipher = openssl_encrypt($code, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        if ($cipher === false) {
            throw new RuntimeException('phone verify seal failed');
        }
        return base64_encode($iv . $cipher);
    }

    private static function unsealCode(string $sealed): ?string
    {
        $raw = base64_decode($sealed, true);
        if ($raw === false || strlen($raw) < 17) {
            return null;
        }
        $iv = substr($raw, 0, 16);
        $cipher = substr($raw, 16);
        $plain = openssl_decrypt($cipher, 'aes-256-cbc', self::cryptoKey(), OPENSSL_RAW_DATA, $iv);
        return is_string($plain) && preg_match('/^\d{6}$/', $plain) === 1 ? $plain : null;
    }

    private static function cryptoKey(): string
    {
        $material = Config::get('TELEGRAM_BOT_TOKEN');
        if ($material === '') {
            $material = Config::get('DB_PASS', 'lappyart');
        }
        return hash('sha256', $material . '|phone_verify', true);
    }
}

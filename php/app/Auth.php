<?php
declare(strict_types=1);

final class Auth
{
    public const RESULT_OK = 'ok';
    public const RESULT_INVALID = 'invalid';
    public const RESULT_LOCKED = 'locked';

    private const SESSION_KEY = 'admin_auth';
    private const IDLE_SECONDS = 7200;
    private const MAX_FAILED_PER_IP = 5;
    private const MAX_FAILED_PER_EMAIL = 10;
    private const WINDOW_MINUTES = 15;

    /** Valid bcrypt hash: verified when the e-mail is unknown so response time does not reveal accounts. */
    private const DUMMY_HASH = '$2y$12$UeGRsEfju.5GYIXO3YncbOllzbUadwEhUZ6uCwa8tCzQPclFyeVXC';

    /** @return array{id: int, email: string, name: string, role: string}|null */
    public static function user(): ?array
    {
        static $cached = false;
        if ($cached !== false) {
            return $cached;
        }

        $session = $_SESSION[self::SESSION_KEY] ?? null;
        if (!is_array($session)) {
            return $cached = null;
        }

        if (time() - (int) ($session['last'] ?? 0) > self::IDLE_SECONDS) {
            self::logout();
            return $cached = null;
        }

        $row = Database::fetchOne(
            'SELECT id, email, name, role FROM users WHERE id = ? AND is_active = 1',
            [(int) ($session['id'] ?? 0)],
        );
        if ($row === null) {
            self::logout();
            return $cached = null;
        }

        $_SESSION[self::SESSION_KEY]['last'] = time();
        return $cached = [
            'id' => (int) $row['id'],
            'email' => (string) $row['email'],
            'name' => (string) $row['name'],
            'role' => (string) $row['role'],
        ];
    }

    public static function attempt(string $email, string $password): string
    {
        $ip = Security::clientIp();
        $email = mb_strtolower(trim($email));

        if (self::isLocked($ip, $email)) {
            return self::RESULT_LOCKED;
        }

        $user = Database::fetchOne('SELECT * FROM users WHERE email = ? AND is_active = 1', [$email]);
        $hash = $user['password_hash'] ?? self::DUMMY_HASH;
        $passwordOk = password_verify($password, (string) $hash);

        if ($user === null || !$passwordOk) {
            Database::execute(
                'INSERT INTO login_attempts (ip, email, attempted_at) VALUES (?, ?, ?)',
                [$ip, mb_substr($email, 0, 190), date('Y-m-d H:i:s')],
            );
            return self::RESULT_INVALID;
        }

        if (password_needs_rehash((string) $user['password_hash'], PASSWORD_DEFAULT)) {
            Database::execute('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $user['id']]);
        }
        Database::execute('UPDATE users SET last_login_at = ? WHERE id = ?', [date('Y-m-d H:i:s'), $user['id']]);
        Database::execute('DELETE FROM login_attempts WHERE ip = ? OR attempted_at < ?', [$ip, date('Y-m-d H:i:s', time() - 86400)]);

        session_regenerate_id(true);
        $_SESSION[self::SESSION_KEY] = ['id' => (int) $user['id'], 'last' => time()];
        return self::RESULT_OK;
    }

    public static function logout(): void
    {
        unset($_SESSION[self::SESSION_KEY]);
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }

    private static function isLocked(string $ip, string $email): bool
    {
        $since = date('Y-m-d H:i:s', time() - self::WINDOW_MINUTES * 60);

        $byIp = Database::fetchOne('SELECT COUNT(*) AS total FROM login_attempts WHERE ip = ? AND attempted_at >= ?', [$ip, $since]);
        if ((int) ($byIp['total'] ?? 0) >= self::MAX_FAILED_PER_IP) {
            return true;
        }

        $byEmail = Database::fetchOne('SELECT COUNT(*) AS total FROM login_attempts WHERE email = ? AND attempted_at >= ?', [$email, $since]);
        return (int) ($byEmail['total'] ?? 0) >= self::MAX_FAILED_PER_EMAIL;
    }
}

<?php
declare(strict_types=1);

final class PasswordReset
{
    private const TTL_SECONDS = 3600;
    private const MAX_PER_HOUR = 3;

    public static function ensureTable(): void
    {
        Database::execute(
            'CREATE TABLE IF NOT EXISTS password_resets (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id INT UNSIGNED NOT NULL,
                token_hash CHAR(64) NOT NULL,
                ip_hash CHAR(64) NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uq_password_resets_token (token_hash),
                KEY idx_password_resets_user (user_id, created_at),
                CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id)
                    REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

    /** Sends a reset letter when the address belongs to an active admin. Unknown addresses stay silent. */
    public static function request(string $email): bool
    {
        self::ensureTable();
        $email = mb_strtolower(trim($email));
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return true;
        }

        $user = Database::fetchOne('SELECT id, email FROM users WHERE email = ? AND is_active = 1', [$email]);
        if ($user === null) {
            return true;
        }

        $since = date('Y-m-d H:i:s', time() - 3600);
        $recent = Database::fetchOne(
            'SELECT COUNT(*) AS total FROM password_resets WHERE user_id = ? AND created_at >= ?',
            [(int) $user['id'], $since]
        );
        if ((int) ($recent['total'] ?? 0) >= self::MAX_PER_HOUR) {
            return true;
        }

        $token = bin2hex(random_bytes(32));
        Database::execute('DELETE FROM password_resets WHERE user_id = ? OR expires_at < ?', [(int) $user['id'], date('Y-m-d H:i:s')]);
        Database::execute(
            'INSERT INTO password_resets (user_id, token_hash, ip_hash, expires_at) VALUES (?, ?, ?, ?)',
            [
                (int) $user['id'],
                hash('sha256', $token),
                Security::hashIp(Security::clientIp()),
                date('Y-m-d H:i:s', time() + self::TTL_SECONDS),
            ]
        );

        $link = rtrim((string) site('url'), '/') . '/admin/reset.php?token=' . $token;
        $text = "Здравствуйте.\n\n"
            . "Чтобы задать новый пароль для админки Lappy Art, откройте ссылку. Она действует 1 час и только один раз:\n\n"
            . $link . "\n\n"
            . "Если вы не запрашивали смену пароля, это письмо можно удалить.\n";

        return Mail::send((string) $user['email'], 'Новый пароль для админки Lappy Art', $text);
    }

    public static function userIdForToken(string $token): ?int
    {
        if (preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
            return null;
        }
        self::ensureTable();
        $row = Database::fetchOne(
            'SELECT user_id FROM password_resets WHERE token_hash = ? AND expires_at >= ?',
            [hash('sha256', $token), date('Y-m-d H:i:s')]
        );
        return $row === null ? null : (int) $row['user_id'];
    }

    public static function complete(string $token, string $password): bool
    {
        $userId = self::userIdForToken($token);
        if ($userId === null || strlen($password) < 8 || strlen($password) > 72) {
            return false;
        }

        Database::execute(
            'UPDATE users SET password_hash = ? WHERE id = ? AND is_active = 1',
            [password_hash($password, PASSWORD_DEFAULT), $userId]
        );
        Database::execute('DELETE FROM password_resets WHERE user_id = ?', [$userId]);
        $user = Database::fetchOne('SELECT email FROM users WHERE id = ?', [$userId]);
        if ($user !== null) {
            Database::execute('DELETE FROM login_attempts WHERE email = ?', [(string) $user['email']]);
        }
        return true;
    }
}

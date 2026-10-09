<?php
declare(strict_types=1);

/**
 * Create or update an admin user.
 *
 * Usage:
 *   php scripts/create-admin.php admin@example.com "Имя"
 *   ADMIN_PASSWORD='...' php scripts/create-admin.php admin@example.com   (without a prompt)
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/app/bootstrap.php';

const MIN_PASSWORD_LENGTH = 12;

function prompt(string $label, bool $hidden = false): string
{
    echo $label;
    $canHide = $hidden && DIRECTORY_SEPARATOR === '/' && function_exists('shell_exec');
    if ($canHide) {
        shell_exec('stty -echo');
    }
    $line = fgets(STDIN);
    if ($canHide) {
        shell_exec('stty echo');
        echo PHP_EOL;
    }
    return $line === false ? '' : trim($line);
}

function fail(string $message): void
{
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
}

try {
    $email = mb_strtolower(trim($argv[1] ?? prompt('Email: ')));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
        fail('Invalid email.');
    }

    $name = trim($argv[2] ?? '');

    $password = getenv('ADMIN_PASSWORD') ?: '';
    if ($password === '') {
        $password = prompt('Password (min ' . MIN_PASSWORD_LENGTH . ' chars): ', true);
        if ($password !== prompt('Repeat password: ', true)) {
            fail('Passwords do not match.');
        }
    }
    if (mb_strlen($password) < MIN_PASSWORD_LENGTH) {
        fail('Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.');
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $existing = Database::fetchOne('SELECT id FROM users WHERE email = ?', [$email]);

    if ($existing !== null) {
        Database::execute(
            'UPDATE users SET password_hash = ?, is_active = 1, name = IF(? = \'\', name, ?) WHERE id = ?',
            [$hash, $name, $name, $existing['id']],
        );
        echo "Updated password for {$email}" . PHP_EOL;
    } else {
        Database::execute(
            'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, \'admin\')',
            [$email, $hash, $name],
        );
        echo "Created admin {$email} (id " . Database::lastInsertId() . ')' . PHP_EOL;
    }
} catch (Throwable $exception) {
    error_log('[create-admin] ' . $exception->getMessage());
    fail('Failed: ' . $exception->getMessage());
}

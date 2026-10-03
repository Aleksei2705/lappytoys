<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/app/bootstrap.php';

try {
    $version = Database::fetchOne('SELECT VERSION() AS v');
    echo 'Connected. MySQL ' . ($version['v'] ?? '?') . PHP_EOL;

    $tables = Database::fetchAll(
        'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
        [Config::get('DB_NAME')],
    );
    echo 'Tables: ' . ($tables === [] ? '(none)' : implode(', ', array_column($tables, 'name'))) . PHP_EOL;
} catch (Throwable $exception) {
    fwrite(STDERR, 'Failed: ' . $exception->getMessage() . PHP_EOL);
    exit(1);
}

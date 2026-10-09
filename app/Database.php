<?php
declare(strict_types=1);

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection !== null) {
            return self::$connection;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            Config::get('DB_HOST', 'localhost'),
            Config::get('DB_PORT', '3306'),
            Config::get('DB_NAME'),
        );

        try {
            self::$connection = new PDO($dsn, Config::get('DB_USER'), Config::get('DB_PASS'), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $exception) {
            error_log('[db] connection failed: ' . $exception->getMessage());
            throw new RuntimeException('Database connection failed');
        }

        return self::$connection;
    }

    /**
     * @param array<int|string, scalar|null> $params
     * @return list<array<string, mixed>>
     */
    public static function fetchAll(string $sql, array $params = []): array
    {
        $statement = self::run($sql, $params);
        return $statement->fetchAll();
    }

    /**
     * @param array<int|string, scalar|null> $params
     * @return array<string, mixed>|null
     */
    public static function fetchOne(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    /** @param array<int|string, scalar|null> $params */
    public static function execute(string $sql, array $params = []): int
    {
        return self::run($sql, $params)->rowCount();
    }

    public static function lastInsertId(): int
    {
        return (int) self::connection()->lastInsertId();
    }

    /** @param array<int|string, scalar|null> $params */
    private static function run(string $sql, array $params): PDOStatement
    {
        try {
            $statement = self::connection()->prepare($sql);
            $statement->execute($params);
            return $statement;
        } catch (PDOException $exception) {
            error_log('[db] query failed: ' . $exception->getMessage());
            throw new RuntimeException('Database query failed');
        }
    }
}

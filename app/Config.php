<?php
declare(strict_types=1);

final class Config
{
    /** @var array<string, string> */
    private static array $values = [];

    public static function load(string $envPath): void
    {
        if (!is_readable($envPath)) {
            throw new RuntimeException('Missing .env file');
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $value = trim($value);
            $isQuoted = strlen($value) >= 2 && $value[0] === '"' && str_ends_with($value, '"');
            self::$values[trim($key)] = $isQuoted ? substr($value, 1, -1) : $value;
        }
    }

    public static function get(string $key, string $default = ''): string
    {
        return self::$values[$key] ?? $default;
    }

    public static function isProduction(): bool
    {
        return self::get('APP_ENV', 'production') === 'production';
    }
}

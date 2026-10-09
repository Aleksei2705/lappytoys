<?php
declare(strict_types=1);

final class I18n
{
    public const COOKIE = 'lappy_locale';
    private const SUPPORTED = ['ru', 'kk'];

    private static ?string $locale = null;
    /** @var array<string, array<string, string>> */
    private static array $dictionaries = [];

    public static function locale(): string
    {
        if (self::$locale === null) {
            $saved = $_COOKIE[self::COOKIE] ?? 'ru';
            self::$locale = in_array($saved, self::SUPPORTED, true) ? $saved : 'ru';
        }
        return self::$locale;
    }

    public static function isSupported(string $locale): bool
    {
        return in_array($locale, self::SUPPORTED, true);
    }

    public static function translate(string $key): string
    {
        return self::dictionary(self::locale())[$key] ?? self::dictionary('ru')[$key] ?? $key;
    }

    public static function translateIn(string $locale, string $key): string
    {
        return self::dictionary($locale)[$key] ?? self::dictionary('ru')[$key] ?? $key;
    }

    /** @return array<string, string> */
    private static function dictionary(string $locale): array
    {
        if (!isset(self::$dictionaries[$locale])) {
            $base = APP_ROOT . '/lang/' . $locale . '.php';
            $extra = APP_ROOT . '/lang/' . $locale . '.extra.php';
            self::$dictionaries[$locale] = array_merge(
                is_readable($base) ? require $base : [],
                is_readable($extra) ? require $extra : [],
            );
        }
        return self::$dictionaries[$locale];
    }
}

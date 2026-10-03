<?php
declare(strict_types=1);

final class Phone
{
    /**
     * Normalizes a phone to "+<digits>". Kazakhstan/Russia (+7, 8…) must have 11 digits,
     * other countries need an explicit "+" and 10–15 digits. Returns null when invalid.
     */
    public static function normalize(string $raw): ?string
    {
        $trimmed = trim($raw);
        $startsWithPlus = str_starts_with($trimmed, '+') || str_starts_with($trimmed, '00');
        $digits = preg_replace('/\D/', '', $raw) ?? '';
        if (str_starts_with($trimmed, '00') && str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }
        if ($digits === '') {
            return null;
        }

        if ($startsWithPlus && !str_starts_with($digits, '7')) {
            $digits = substr($digits, 0, 15);
            return strlen($digits) >= 10 ? '+' . $digits : null;
        }

        if (str_starts_with($digits, '8')) {
            $digits = '7' . substr($digits, 1);
        }
        if (!str_starts_with($digits, '7')) {
            $digits = '7' . $digits;
        }

        $digits = substr($digits, 0, 11);
        return preg_match('/^7\d{10}$/', $digits) === 1 ? '+' . $digits : null;
    }
}

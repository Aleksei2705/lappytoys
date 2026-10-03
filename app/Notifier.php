<?php
declare(strict_types=1);

final class Notifier
{
    /** @param array{name: string, phone: string, direction: string, preferred_date: ?string, message: ?string} $booking */
    public static function booking(array $booking): bool
    {
        $lines = [
            '🆕 <b>Новая заявка</b> — lappytoys.kz',
            '',
            'Имя: ' . self::h($booking['name']),
            'Телефон: ' . self::h($booking['phone']),
            'Направление: ' . self::h($booking['direction']),
        ];
        if ($booking['preferred_date'] !== null) {
            $lines[] = 'Желаемая дата: ' . self::h(date('d.m.Y', (int) strtotime($booking['preferred_date'])));
        }
        if ($booking['message'] !== null && $booking['message'] !== '') {
            $lines[] = '';
            $lines[] = self::h($booking['message']);
        }
        $lines[] = '';
        $lines[] = '🕒 ' . date('d.m.Y H:i');

        return Telegram::send(implode("\n", $lines));
    }

    /** @param array{name: string, phone: string, direction: string, preferred_date: ?string, message: ?string} $booking */
    public static function bookingEmail(array $booking): bool
    {
        $lines = [
            'Новая заявка — lappytoys.kz',
            '',
            'Имя: ' . $booking['name'],
            'Телефон: ' . $booking['phone'],
            'Направление: ' . $booking['direction'],
        ];
        if ($booking['preferred_date'] !== null) {
            $lines[] = 'Желаемая дата: ' . date('d.m.Y', (int) strtotime($booking['preferred_date']));
        }
        if ($booking['message'] !== null && $booking['message'] !== '') {
            $lines[] = '';
            $lines[] = $booking['message'];
        }
        $lines[] = '';
        $lines[] = date('d.m.Y H:i');

        return Mail::send((string) site('notify_email'), 'Новая заявка — ' . $booking['name'], implode("\n", $lines));
    }

    /** @param array{name: string, course: string, rating: int, text: string} $review */
    public static function review(array $review): bool
    {
        $lines = [
            '⭐ <b>Новый отзыв на модерации</b> — lappytoys.kz',
            '',
            'Имя: ' . self::h($review['name']),
            'Курс: ' . self::h($review['course']),
            'Оценка: ' . $review['rating'] . '/5',
            '',
            self::h($review['text']),
            '',
            '🕒 ' . date('d.m.Y H:i'),
        ];

        return Telegram::send(implode("\n", $lines));
    }

    private static function h(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

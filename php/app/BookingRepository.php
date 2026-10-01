<?php
declare(strict_types=1);

final class BookingRepository
{
    public static function create(
        ?int $classId,
        string $name,
        string $phone,
        string $direction,
        ?string $preferredDate,
        ?string $message,
        string $ipHash,
    ): int {
        Database::execute(
            "INSERT INTO bookings (class_id, name, phone, direction, preferred_date, message, status, ip_hash, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)",
            [$classId, $name, $phone, $direction, $preferredDate, $message, $ipHash, date('Y-m-d H:i:s')],
        );
        return Database::lastInsertId();
    }

    public static function markTelegramSent(int $id): void
    {
        Database::execute('UPDATE bookings SET telegram_sent = 1 WHERE id = ?', [$id]);
    }

    public static function countRecentFromIp(string $ipHash, int $minutes): int
    {
        $row = Database::fetchOne(
            'SELECT COUNT(*) AS total FROM bookings WHERE ip_hash = ? AND created_at >= ?',
            [$ipHash, date('Y-m-d H:i:s', time() - $minutes * 60)],
        );
        return (int) ($row['total'] ?? 0);
    }
}

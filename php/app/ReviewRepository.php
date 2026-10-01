<?php
declare(strict_types=1);

final class ReviewRepository
{
    /** @return list<array<string, mixed>> */
    public static function approved(): array
    {
        return Database::fetchAll(
            "SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC, id DESC",
        );
    }

    public static function create(
        string $name,
        ?int $classId,
        string $courseRu,
        ?string $courseKk,
        string $text,
        int $rating,
        string $ipHash,
    ): int {
        Database::execute(
            "INSERT INTO reviews (class_id, name, course, course_kk, text, rating, status, ip_hash, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)",
            [$classId, $name, $courseRu, $courseKk, $text, $rating, $ipHash, date('Y-m-d H:i:s')],
        );
        return Database::lastInsertId();
    }

    public static function countRecentFromIp(string $ipHash, int $minutes): int
    {
        $row = Database::fetchOne(
            'SELECT COUNT(*) AS total FROM reviews WHERE ip_hash = ? AND created_at >= ?',
            [$ipHash, date('Y-m-d H:i:s', time() - $minutes * 60)],
        );
        return (int) ($row['total'] ?? 0);
    }
}

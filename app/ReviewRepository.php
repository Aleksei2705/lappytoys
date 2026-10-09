<?php
declare(strict_types=1);

final class ReviewRepository
{
    public const TEXT_MAX = 1200;

    /** @return list<array<string, mixed>> */
    public static function approved(): array
    {
        return Database::fetchAll(
            "SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC, id DESC",
        );
    }

    public static function isPhotoPath(?string $path): bool
    {
        return is_string($path)
            && preg_match('#^/uploads/reviews/[a-f0-9]{16}\.(jpg|png|webp)$#', $path) === 1;
    }

    public static function create(
        string $name,
        ?int $classId,
        string $courseRu,
        ?string $courseKk,
        string $text,
        int $rating,
        string $ipHash,
        ?string $photoPath = null,
    ): int {
        $photo = self::isPhotoPath($photoPath) ? $photoPath : null;
        Database::execute(
            "INSERT INTO reviews (class_id, name, course, course_kk, text, rating, photo_path, status, ip_hash, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)",
            [$classId, $name, $courseRu, $courseKk, $text, $rating, $photo, $ipHash, date('Y-m-d H:i:s')],
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

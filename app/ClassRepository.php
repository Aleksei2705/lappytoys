<?php
declare(strict_types=1);

final class ClassRepository
{
    /** @return list<array<string, mixed>> */
    public static function published(string $kind): array
    {
        return Database::fetchAll(
            'SELECT c.*, cat.title_ru AS category_ru, cat.title_kk AS category_kk
             FROM classes c
             LEFT JOIN categories cat ON cat.id = c.category_id
             WHERE c.is_published = 1 AND c.kind = ?
             ORDER BY c.sort_order, c.id',
            [$kind],
        );
    }

    /** @return array<string, mixed>|null */
    public static function findPublished(string $slug, string $kind): ?array
    {
        return Database::fetchOne(
            'SELECT * FROM classes WHERE slug = ? AND kind = ? AND is_published = 1',
            [$slug, $kind],
        );
    }

    /** @return array<string, mixed>|null */
    public static function findPublishedBySlug(string $slug): ?array
    {
        return Database::fetchOne('SELECT * FROM classes WHERE slug = ? AND is_published = 1', [$slug]);
    }
}

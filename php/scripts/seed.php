<?php
declare(strict_types=1);

/**
 * Imports categories, courses, master classes and legacy reviews from database/seed-data.json.
 * Insert-only and idempotent: existing rows (matched by slug / name+text) are never overwritten,
 * so edits made in the admin panel survive a repeated run.
 *
 * Usage: php scripts/seed.php
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/app/bootstrap.php';

/** @param list<string>|null $items */
function encodeList(?array $items): ?string
{
    return $items === null ? null : json_encode($items, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
}

try {
    $file = APP_ROOT . '/database/seed-data.json';
    $seed = json_decode((string) file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
    $pdo = Database::connection();
    $pdo->beginTransaction();

    $created = ['categories' => 0, 'classes' => 0, 'reviews' => 0];

    foreach ($seed['categories'] as $category) {
        $created['categories'] += Database::execute(
            'INSERT IGNORE INTO categories (slug, title_ru, title_kk, sort_order) VALUES (?, ?, ?, ?)',
            [$category['slug'], $category['title_ru'], $category['title_kk'], $category['sort_order']],
        );
    }

    foreach ($seed['classes'] as $class) {
        $category = $class['category'] === null
            ? null
            : Database::fetchOne('SELECT id FROM categories WHERE slug = ?', [$class['category']]);

        $created['classes'] += Database::execute(
            'INSERT IGNORE INTO classes
                (slug, kind, category_id, title_ru, title_kk, description_ru, description_kk,
                 intro_ru, intro_kk, details_ru, details_kk, learn_ru, learn_kk, for_whom_ru, for_whom_kk,
                 badge_ru, badge_kk, price_label, duration_ru, duration_kk, level_ru, level_kk,
                 image_path, emoji, accent, sort_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
            [
                $class['slug'], $class['kind'], $category['id'] ?? null,
                $class['title_ru'], $class['title_kk'], $class['description_ru'], $class['description_kk'],
                $class['intro_ru'], $class['intro_kk'],
                encodeList($class['details_ru']), encodeList($class['details_kk']),
                encodeList($class['learn_ru']), encodeList($class['learn_kk']),
                encodeList($class['for_whom_ru']), encodeList($class['for_whom_kk']),
                $class['badge_ru'], $class['badge_kk'], $class['price_label'],
                $class['duration_ru'], $class['duration_kk'], $class['level_ru'], $class['level_kk'],
                $class['image_path'], $class['emoji'], $class['accent'], $class['sort_order'],
            ],
        );
    }

    foreach ($seed['reviews'] as $review) {
        $exists = Database::fetchOne(
            'SELECT id FROM reviews WHERE name = ? AND text = ?',
            [$review['name'], $review['text']],
        );
        if ($exists !== null) {
            continue;
        }

        $created['reviews'] += Database::execute(
            "INSERT INTO reviews
                (name, course, course_kk, text, text_kk, rating, reply_text, reply_text_kk,
                 show_date, status, created_at, moderated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'approved', ?, ?)",
            [
                $review['name'], $review['course'], $review['course_kk'], $review['text'], $review['text_kk'],
                $review['rating'], $review['reply_text'], $review['reply_text_kk'],
                $review['created_at'], $review['created_at'],
            ],
        );
    }

    $pdo->commit();
    echo sprintf(
        "Seed done. Added: %d categories, %d classes, %d reviews.\n",
        $created['categories'],
        $created['classes'],
        $created['reviews'],
    );
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('[seed] ' . $exception->getMessage());
    fwrite(STDERR, 'Seed failed: ' . $exception->getMessage() . PHP_EOL);
    exit(1);
}

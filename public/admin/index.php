<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Обзор';
$adminSection = 'dashboard';

$stats = ['new' => 0, 'pending' => 0, 'classes' => 0, 'unsent' => 0];
$recentBookings = [];
$pendingReviews = [];
$loadError = false;

try {
    $stats['new'] = (int) Database::fetchOne("SELECT COUNT(*) AS n FROM bookings WHERE status = 'new'")['n'];
    $stats['unsent'] = (int) Database::fetchOne('SELECT COUNT(*) AS n FROM bookings WHERE telegram_sent = 0')['n'];
    $stats['pending'] = (int) Database::fetchOne("SELECT COUNT(*) AS n FROM reviews WHERE status = 'pending'")['n'];
    $stats['classes'] = (int) Database::fetchOne('SELECT COUNT(*) AS n FROM classes WHERE is_published = 1')['n'];
    $recentBookings = Database::fetchAll('SELECT id, name, phone, direction, status, created_at FROM bookings ORDER BY id DESC LIMIT 5');
    $pendingReviews = Database::fetchAll("SELECT id, name, rating, text, created_at FROM reviews WHERE status = 'pending' ORDER BY id DESC LIMIT 5");
} catch (RuntimeException) {
    $loadError = true;
}

require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($loadError): ?>
    <p class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Не удалось загрузить данные. Проверьте подключение к базе.</p>
<?php else: ?>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <?php foreach ([
            ['Новые заявки', $stats['new'], '/admin/bookings.php?status=new'],
            ['Отзывы на модерации', $stats['pending'], '/admin/reviews.php?status=pending'],
            ['Опубликовано курсов и МК', $stats['classes'], '/admin/classes.php'],
            ['Заявки без Telegram', $stats['unsent'], '/admin/bookings.php'],
        ] as [$label, $value, $href]): ?>
            <a href="<?= e($href) ?>" class="card-soft block p-5 transition hover:shadow-md">
                <p class="text-3xl font-bold text-brand-700"><?= $value ?></p>
                <p class="mt-1 text-sm text-warm-500"><?= e($label) ?></p>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <section class="card-soft p-5">
            <h2 class="mb-3 font-semibold">Последние заявки</h2>
            <?php if ($recentBookings === []): ?>
                <p class="text-sm text-warm-500">Заявок пока нет.</p>
            <?php endif; ?>
            <ul class="divide-y divide-brand-100 text-sm">
                <?php foreach ($recentBookings as $booking): ?>
                    <li class="py-2">
                        <p class="font-medium"><?= e((string) $booking['name']) ?> · <a class="text-brand-700 underline" href="tel:<?= e((string) $booking['phone']) ?>"><?= e((string) $booking['phone']) ?></a></p>
                        <p class="text-warm-500"><?= e((string) $booking['direction']) ?> · <?= e(Admin::dt((string) $booking['created_at'])) ?></p>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>
        <section class="card-soft p-5">
            <h2 class="mb-3 font-semibold">Отзывы на модерации</h2>
            <?php if ($pendingReviews === []): ?>
                <p class="text-sm text-warm-500">Новых отзывов нет.</p>
            <?php endif; ?>
            <ul class="divide-y divide-brand-100 text-sm">
                <?php foreach ($pendingReviews as $review): ?>
                    <li class="py-2">
                        <p class="font-medium"><?= e((string) $review['name']) ?> · <?= (int) $review['rating'] ?>/5</p>
                        <p class="line-clamp-2 text-warm-500"><?= e((string) $review['text']) ?></p>
                        <a class="text-brand-700 underline" href="/admin/review-edit.php?id=<?= (int) $review['id'] ?>">Открыть</a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>
    </div>
<?php endif; ?>
<?php require APP_ROOT . '/templates/admin/footer.php';

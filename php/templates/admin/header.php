<?php
/**
 * @var string $adminTitle
 * @var string $adminSection
 * @var array{id: int, email: string, name: string, role: string} $adminUser
 */
$counters = ['bookings' => 0, 'reviews' => 0];
try {
    $counters['bookings'] = (int) (Database::fetchOne("SELECT COUNT(*) AS total FROM bookings WHERE status = 'new'")['total'] ?? 0);
    $counters['reviews'] = (int) (Database::fetchOne("SELECT COUNT(*) AS total FROM reviews WHERE status = 'pending'")['total'] ?? 0);
} catch (RuntimeException) {
    // The page itself reports DB problems; counters are optional.
}

$navItems = [
    'dashboard' => ['/admin/', 'Обзор', 0],
    'bookings' => ['/admin/bookings.php', 'Заявки', $counters['bookings']],
    'reviews' => ['/admin/reviews.php', 'Отзывы', $counters['reviews']],
    'classes' => ['/admin/classes.php', 'Курсы и МК', 0],
    'categories' => ['/admin/categories.php', 'Категории', 0],
    'schedule' => ['/admin/schedule.php', 'Расписание', 0],
    'gallery' => ['/admin/gallery.php', 'Галерея', 0],
    'content' => ['/admin/content.php', 'Тексты', 0],
];
$flash = Admin::takeFlash();
$displayName = $adminUser['name'] !== '' ? $adminUser['name'] : $adminUser['email'];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title><?= e($adminTitle) ?> — Lappy Art</title>
    <link rel="icon" href="/favicon-32.png" sizes="32x32">
    <link rel="stylesheet" href="<?= e(asset('assets/app.css')) ?>">
</head>
<body class="min-h-screen bg-cream text-warm-900">
<div class="lg:flex lg:min-h-screen">
    <aside class="border-b border-brand-100 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <a href="/admin/" class="block px-4 py-4 font-heading text-lg font-bold text-brand-700">Lappy Art</a>
        <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4">
            <?php foreach ($navItems as $key => [$href, $label, $badge]): ?>
                <a href="<?= e($href) ?>"
                   class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium <?= $key === $adminSection ? 'bg-brand-100 text-brand-800' : 'text-warm-700 hover:bg-brand-50' ?>">
                    <?= e($label) ?>
                    <?php if ($badge > 0): ?>
                        <span class="rounded-full bg-brand-600 px-1.5 text-xs leading-5 text-white"><?= $badge ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </nav>
        <div class="hidden items-center gap-3 border-t border-brand-100 px-4 py-4 text-sm lg:flex">
            <div class="min-w-0 flex-1">
                <p class="truncate font-medium"><?= e($displayName) ?></p>
                <a href="/" target="_blank" rel="noopener" class="text-warm-500 hover:text-brand-700">Открыть сайт</a>
            </div>
            <form method="post" action="/admin/logout.php">
                <?= Security::csrfField() ?>
                <button type="submit" class="btn-ghost !px-3 !py-1.5">Выйти</button>
            </form>
        </div>
    </aside>
    <div class="min-w-0 flex-1">
        <div class="flex items-center justify-end gap-3 border-b border-brand-100 bg-white/80 px-4 py-2 text-sm lg:hidden">
            <a href="/" target="_blank" rel="noopener" class="text-warm-500">Сайт</a>
            <span class="truncate text-warm-500"><?= e($displayName) ?></span>
            <form method="post" action="/admin/logout.php">
                <?= Security::csrfField() ?>
                <button type="submit" class="btn-ghost !px-3 !py-1.5">Выйти</button>
            </form>
        </div>
        <main class="mx-auto max-w-5xl px-4 py-8">
            <h1 class="mb-6 font-heading text-2xl font-bold sm:text-3xl"><?= e($adminTitle) ?></h1>
            <?php if ($flash !== null): ?>
                <p class="mb-6 rounded-xl border px-4 py-3 text-sm <?= $flash['type'] === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700' ?>" role="status"><?= e($flash['message']) ?></p>
            <?php endif; ?>

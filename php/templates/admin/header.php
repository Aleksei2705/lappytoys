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
];
$flash = Admin::takeFlash();
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
<header class="border-b border-brand-100 bg-white">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <a href="/admin/" class="font-heading text-lg font-bold text-brand-700">Lappy Art · админка</a>
        <nav class="flex flex-1 flex-wrap items-center gap-1 text-sm">
            <?php foreach ($navItems as $key => [$href, $label, $badge]): ?>
                <a href="<?= e($href) ?>"
                   class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium <?= $key === $adminSection ? 'bg-brand-100 text-brand-800' : 'text-warm-700 hover:bg-brand-50' ?>">
                    <?= e($label) ?>
                    <?php if ($badge > 0): ?>
                        <span class="rounded-full bg-brand-600 px-1.5 text-xs leading-5 text-white"><?= $badge ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </nav>
        <div class="flex items-center gap-3 text-sm">
            <a href="/" target="_blank" rel="noopener" class="text-warm-500 hover:text-brand-700">Сайт ↗</a>
            <span class="hidden text-warm-500 sm:inline"><?= e($adminUser['name'] !== '' ? $adminUser['name'] : $adminUser['email']) ?></span>
            <form method="post" action="/admin/logout.php">
                <?= Security::csrfField() ?>
                <button type="submit" class="btn-ghost !px-3 !py-1.5">Выйти</button>
            </form>
        </div>
    </div>
</header>
<main class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="mb-6 font-heading text-2xl font-bold sm:text-3xl"><?= e($adminTitle) ?></h1>
    <?php if ($flash !== null): ?>
        <p class="mb-6 rounded-xl border px-4 py-3 text-sm <?= $flash['type'] === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700' ?>" role="status"><?= e($flash['message']) ?></p>
    <?php endif; ?>

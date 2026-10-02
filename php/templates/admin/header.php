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
    'about' => ['/admin/content.php?part=about', 'Обо мне', 0],
    'courses' => ['/admin/classes.php?kind=course', 'Виды занятий', 0],
    'master' => ['/admin/classes.php?kind=master_class', 'Мастер-классы', 0],
    'schedule' => ['/admin/schedule.php', 'Расписание', 0],
    'works' => ['/admin/gallery.php', 'Работы учеников', 0],
    'reviews' => ['/admin/reviews.php', 'Отзывы', $counters['reviews']],
    'faq' => ['/admin/content.php?part=faq', 'Вопросы и ответы', 0],
    'contacts' => ['/admin/content.php?part=contacts', 'Контакты', 0],
    'bookings' => ['/admin/bookings.php', 'Заявки', $counters['bookings']],
    'categories' => ['/admin/categories.php', 'Категории', 0],
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
<body class="is-admin min-h-screen bg-cream text-warm-900">
<div class="lg:flex lg:min-h-screen">
    <aside class="border-b border-brand-100 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <a href="/admin/" class="block px-4 py-4 font-heading text-lg font-bold text-brand-700">Lappy Art</a>
        <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4" data-admin-nav>
            <?php foreach ($navItems as $key => [$href, $label, $badge]): ?>
                <a href="<?= e($href) ?>"
                   <?= $key === $adminSection ? 'aria-current="page"' : '' ?>
                   class="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium <?= $key === $adminSection ? 'bg-brand-100 text-brand-800' : 'text-warm-700 hover:bg-brand-50' ?>">
                    <?= e($label) ?>
                    <?php if ($badge > 0): ?>
                        <span class="rounded-full bg-brand-600 px-1.5 text-xs leading-5 text-white"><?= $badge ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </nav>
    </aside>
    <div class="min-w-0 flex-1">
        <div class="flex items-center justify-end gap-3 border-b border-brand-100 bg-white px-4 py-2 text-sm">
            <span class="mr-auto truncate text-warm-500"><?= e($displayName) ?></span>
            <a href="/" target="_blank" rel="noopener" class="font-medium text-brand-700">На сайт</a>
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

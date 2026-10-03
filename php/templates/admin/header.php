<?php
/**
 * @var string $adminTitle
 * @var string $adminSection
 * @var array{id: int, email: string, name: string, role: string} $adminUser
 */
$counters = ['bookings' => 0, 'reviews' => 0, 'chats' => 0];
try {
    $counters['bookings'] = (int) (Database::fetchOne("SELECT COUNT(*) AS total FROM bookings WHERE status = 'new'")['total'] ?? 0);
    $counters['reviews'] = (int) (Database::fetchOne("SELECT COUNT(*) AS total FROM reviews WHERE status = 'pending'")['total'] ?? 0);
    Assistant::ensureTable();
    $counters['chats'] = (int) (Database::fetchOne('SELECT COUNT(*) AS total FROM assistant_chats WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)')['total'] ?? 0);
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
    'chats' => ['/admin/chats.php', 'Разговоры', $counters['chats']],
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
<div class="admin-shell">
    <header class="admin-head">
        <a href="/admin/" class="admin-logo">Lappy Art</a>
        <div class="admin-session">
            <span class="admin-user"><?= e($displayName) ?></span>
            <a href="/" target="_blank" rel="noopener" class="admin-site-link">На сайт</a>
            <form method="post" action="/admin/logout.php">
                <?= Security::csrfField() ?>
                <button type="submit" class="btn-ghost !px-3 !py-1.5">Выйти</button>
            </form>
        </div>
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
    </header>
    <div class="admin-body">
        <main class="mx-auto max-w-5xl px-4 py-8">
            <h1 class="mb-6 font-heading text-2xl font-bold sm:text-3xl"><?= e($adminTitle) ?></h1>
            <?php if ($flash !== null): ?>
                <p class="mb-6 rounded-xl border px-4 py-3 text-sm <?= $flash['type'] === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700' ?>" role="status"><?= e($flash['message']) ?></p>
            <?php endif; ?>

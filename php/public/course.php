<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

$slug = (string) ($_GET['slug'] ?? '');

try {
    $course = preg_match('/^[a-z0-9-]{1,80}$/', $slug) ? ClassRepository::findPublished($slug, 'course') : null;
} catch (RuntimeException $exception) {
    showErrorPage(503, 'page.unavailable', 'page.unavailableText');
    exit;
}

if ($course === null) {
    showErrorPage(404, 'page.notFound', 'page.notFoundText');
    exit;
}

$title = loc($course, 'title');
$pageTitle = $title . ' — творчество и рукоделие в Семее';
$pageDescription = sprintf(
    '%s Творческие занятия в студии Lappy Art, %s. %s, %s, уровень: %s.',
    loc($course, 'description'),
    site('city'),
    str_replace('₸', 'тг', (string) $course['price_label']),
    loc($course, 'duration'),
    loc($course, 'level'),
);
$canonicalPath = '/courses/' . $course['slug'] . '/';
$returnPath = $canonicalPath;

$details = locList($course, 'details');
$learn = locList($course, 'learn');
$forWhom = locList($course, 'for_whom');

require APP_ROOT . '/templates/layout/header.php';
?>
<div class="container-main max-w-3xl py-14">
    <a href="/#courses" class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-warm-500 transition-colors hover:text-brand-800">
        <?= icon('arrow-left', 'size-4') ?><?= t('course.all') ?>
    </a>

    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br <?= e((string) $course['accent']) ?> px-6 pb-7 pt-3 text-center shadow-lg ring-1 ring-warm-900/5 sm:px-9 sm:pb-9 sm:pt-4">
        <span class="text-6xl drop-shadow-sm" aria-hidden="true"><?= e((string) $course['emoji']) ?></span>
        <?php if (loc($course, 'badge') !== ''): ?>
            <p class="eyebrow mt-4"><span><?= priceText(loc($course, 'badge')) ?></span></p>
        <?php endif; ?>
        <h1 class="mt-2 font-heading text-3xl font-bold text-warm-900 sm:text-4xl"><?= e($title) ?></h1>
        <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-warm-600"><?= priceText(loc($course, 'intro')) ?></p>
        <div class="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span class="badge-soft"><span><?= priceText((string) $course['price_label']) ?></span></span>
            <span class="badge-soft"><?= e(loc($course, 'duration')) ?></span>
            <span class="badge-soft"><?= e(loc($course, 'level')) ?></span>
        </div>
    </div>

    <div class="mt-10 space-y-4 text-base leading-relaxed text-warm-600">
        <?php foreach ($details as $paragraph): ?>
            <p><?= priceText($paragraph) ?></p>
        <?php endforeach; ?>
    </div>

    <div class="mt-12 grid gap-8 sm:grid-cols-2">
        <?php foreach ([['course.learn', $learn], ['course.forWhom', $forWhom]] as [$headingKey, $items]): ?>
            <div class="card-soft px-5 pb-5 pt-2.5">
                <h2 class="font-heading text-xl font-semibold"><?= t($headingKey) ?></h2>
                <ul class="mt-4 space-y-3">
                    <?php foreach ($items as $item): ?>
                        <li class="flex gap-2.5 text-sm leading-relaxed text-warm-600">
                            <?= icon('check-circle', 'mt-0.5 size-4 shrink-0 text-brand-600') ?><?= e($item) ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="mt-12 flex flex-wrap justify-center gap-4">
        <a href="/#courses" class="btn-secondary h-12 px-8 text-base" data-back>
            <?= icon('arrow-left', 'size-4') ?><?= t('cta.back') ?>
        </a>
        <a href="/#signup" class="btn-primary h-12 px-8 text-base"><?= t('cta.signupCourse') ?></a>
    </div>
</div>
<?php
require APP_ROOT . '/templates/layout/footer.php';

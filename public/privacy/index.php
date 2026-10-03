<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$pageTitle = I18n::translate('privacy.title');
$pageDescription = I18n::translate('privacy.p1');
$canonicalPath = '/privacy/';

require APP_ROOT . '/templates/layout/header.php';
?>
<section class="page-section">
    <div class="container-main mx-auto max-w-3xl">
        <p class="eyebrow"><?= t('privacy.eyebrow') ?></p>
        <h1 class="mt-3 font-heading text-3xl font-bold text-warm-900 sm:text-4xl"><?= t('privacy.title') ?></h1>
        <div class="mt-8 space-y-5 text-base leading-relaxed text-warm-500">
            <p><?= t('privacy.p1') ?> (<?= t('contacts.address') ?>). <?= e((string) site('url')) ?></p>
            <?php foreach (range(1, 5) as $index): ?>
                <h2 class="font-heading text-xl font-semibold text-warm-900"><?= t('privacy.h' . $index) ?></h2>
                <?php if ($index === 4): ?>
                    <p><?= t('privacy.p5a') ?> <a class="text-brand-700 underline" href="mailto:<?= e((string) site('notify_email')) ?>"><?= e((string) site('notify_email')) ?></a> <?= t('privacy.p5b') ?> <a class="text-brand-700 underline" href="<?= e((string) site('telegram')) ?>"><?= e((string) site('telegram_handle')) ?></a>.</p>
                <?php else: ?>
                    <p><?= t('privacy.p' . ($index + 1)) ?></p>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        <a href="/#signup" class="btn-secondary mt-10 inline-flex h-11 px-6"><?= t('privacy.back') ?></a>
    </div>
</section>
<?php require APP_ROOT . '/templates/layout/footer.php';

<?php
$awards = SiteContent::awardRows();
if ($awards === []) {
    echo '<div id="awards"></div>';
    return;
}
?>
<section id="awards" class="page-section section-alt">
    <div class="container-main">
        <?= revealStart(0, '', 'right') ?>
        <?php
        render('partials/section-header', [
            'eyebrow' => t('awards.eyebrow'),
            'titleHtml' => t('awards.title'),
            'description' => t('awards.desc'),
        ]);
        ?>
        </div>
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <?php foreach ($awards as $index => $award): ?>
                <?= revealStart(($index % 6) * 70) ?>
                <?php $caption = loc($award, 'caption'); ?>
                <button type="button"
                        class="group text-left outline-none"
                        data-award
                        data-title="<?= e($caption) ?>"
                        data-lightbox-image="<?= e((string) $award['image']) ?>"
                        data-lightbox-alt="<?= e($caption) ?>"
                        aria-label="<?= e($caption) ?>">
                    <span class="block aspect-[3/4] overflow-hidden rounded-2xl bg-white p-2 shadow-md ring-1 ring-warm-900/5 transition duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-4 group-focus-visible:ring-brand-300">
                        <img src="<?= e((string) $award['image']) ?>" alt="" loading="lazy" class="size-full object-contain">
                    </span>
                    <span class="mt-2 block text-xs leading-snug text-warm-600"><?= e($caption) ?></span>
                </button>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

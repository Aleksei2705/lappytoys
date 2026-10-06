<?php
$about = SiteContent::aboutData();
$aboutParagraphs = [];
foreach ($about['paragraphs'] as $paragraph) {
    if (!is_array($paragraph)) {
        continue;
    }
    $text = I18n::locale() === 'kk' ? trim((string) ($paragraph['kk'] ?? '')) : '';
    if ($text === '') {
        $text = trim((string) ($paragraph['ru'] ?? ''));
    }
    if ($text !== '') {
        $aboutParagraphs[] = $text;
    }
}
$aboutRole = I18n::locale() === 'kk' && trim((string) ($about['role_kk'] ?? '')) !== ''
    ? (string) $about['role_kk']
    : (string) ($about['role_ru'] ?? '');
$aboutAlt = I18n::locale() === 'kk' && trim((string) ($about['alt_kk'] ?? '')) !== ''
    ? (string) $about['alt_kk']
    : (string) ($about['alt_ru'] ?? '');
$previewCount = 3;
$awards = SiteContent::awardRows();
?>
<section id="about" class="page-section section-alt section-stitch">
    <div class="container-main">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <?= revealStart() ?>
                <div class="relative">
                    <div class="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand-100/60"></div>
                    <div class="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5">
                        <img src="<?= e((string) ($about['photo'] ?? '/images/room.jpg')) ?>" alt="<?= e($aboutAlt) ?>" loading="lazy"
                             class="absolute inset-0 size-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]">
                    </div>
                    <div class="mt-5 text-center">
                        <p class="font-heading text-lg font-semibold text-warm-900"><?= e((string) ($about['name'] ?? '')) ?></p>
                        <p class="text-sm text-warm-500"><?= e($aboutRole) ?></p>
                    </div>
                </div>
            </div>

            <?= revealStart(120, '', 'left') ?>
                <div class="space-y-6 text-center">
                    <?php
                    render('partials/section-header', [
                        'eyebrow' => t('about.eyebrow'),
                        'titleHtml' => t('about.title.before') . ' <span class="text-gradient">' . t('about.title.accent') . '</span>',
                        'align' => 'center',
                    ]);
                    ?>
                    <div class="mx-auto flex max-w-xl flex-col items-center space-y-4 text-center text-base leading-relaxed text-warm-500" data-expandable>
                        <?php foreach ($aboutParagraphs as $i => $paragraph): ?>
                            <p class="w-full" <?= $i >= $previewCount ? 'data-expandable-extra hidden' : '' ?>><?= e($paragraph) ?></p>
                        <?php endforeach; ?>
                        <?php if (count($aboutParagraphs) > $previewCount): ?>
                        <button type="button" class="btn-secondary mx-auto h-11 px-6" aria-expanded="false" data-expandable-toggle>
                            <span data-label-collapsed class="inline-flex items-center gap-2"><?= icon('chevron-down', 'size-4') ?><?= t('cta.readMore') ?></span>
                            <span data-label-expanded class="hidden items-center gap-2"><?= icon('chevron-up', 'size-4') ?><?= t('cta.hide') ?></span>
                        </button>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div id="awards" class="<?= $awards === [] ? '' : 'mt-14 sm:mt-16' ?>">
        <?php if ($awards !== []): ?>
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
        <?php endif; ?>
        </div>
    </div>
</section>

<?php /** @var list<array<string, mixed>> $masterClasses */ ?>
<?php if ($masterClasses !== []): ?>
<?= revealStart(0, '', 'left') ?>
<section id="master-classes" class="page-section section-alt" data-mc-carousel>
    <div class="container-main">
        <?php
        render('partials/section-header', [
            'eyebrow' => t('masters.eyebrow'),
            'titleHtml' => t('masters.title'),
            'description' => t('masters.desc'),
        ]);
        ?>

        <div class="relative mt-10 sm:mt-12">
            <div class="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[6%] pb-4 [scrollbar-width:none] sm:gap-7 sm:px-[10%] [&::-webkit-scrollbar]:hidden"
                 aria-roledescription="carousel" aria-label="<?= t('masters.title') ?>" data-mc-scroller>
                <?php foreach ($masterClasses as $index => $mc): ?>
                    <article class="flex w-[80%] max-w-md shrink-0 snap-center flex-col transition-all duration-500 sm:w-[56%] lg:w-[38%] <?= $index === 0 ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-75' ?>"
                             data-mc-slide data-title="<?= e(loc($mc, 'title')) ?>">
                        <div class="relative overflow-hidden rounded-[1.5rem] bg-cream shadow-[0_18px_40px_-24px_rgba(63,50,57,0.35)]">
                            <div class="relative aspect-[4/5] overflow-hidden bg-cream-100">
                                <?php if (!empty($mc['image_path'])): ?>
                                    <img src="<?= e((string) $mc['image_path']) ?>" alt="<?= e(loc($mc, 'title')) ?>"
                                         class="absolute inset-0 size-full object-cover object-center"
                                         <?= $index < 2 ? '' : 'loading="lazy"' ?>>
                                <?php endif; ?>
                            </div>

                            <div class="space-y-3 px-5 pb-5 pt-4">
                                <?php if (loc($mc, 'category') !== ''): ?>
                                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600"><?= e(loc($mc, 'category')) ?></p>
                                <?php endif; ?>
                                <h3 class="font-heading text-2xl font-semibold leading-snug text-warm-900"><?= e(loc($mc, 'title')) ?></h3>
                                <p class="text-sm leading-relaxed text-warm-500"><?= e(loc($mc, 'description')) ?></p>
                                <div class="flex items-baseline gap-3 pt-1">
                                    <p class="font-heading text-2xl font-bold text-brand-700"><?= priceText((string) $mc['price_label']) ?></p>
                                </div>
                                <a href="#signup" class="btn-primary mt-1 h-10 w-full"><?= t('masters.signup') ?></a>
                                <a href="<?= e((string) site('instagram')) ?>" target="_blank" rel="noopener noreferrer"
                                   class="block text-center text-xs font-medium text-brand-700 underline-offset-2 transition hover:text-brand-800 hover:underline"><?= t('masters.instagram') ?></a>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>

            <button type="button" data-mc-prev aria-label="<?= t('aria.prevMc') ?>"
                    class="absolute left-0 top-[42%] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:left-1 sm:size-11">
                <?= icon('chevron-left') ?>
            </button>
            <button type="button" data-mc-next aria-label="<?= t('aria.nextMc') ?>"
                    class="absolute right-0 top-[42%] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:right-1 sm:size-11">
                <?= icon('chevron-right') ?>
            </button>
        </div>

        <div class="mt-6 flex flex-col items-center gap-3">
            <div class="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="<?= t('aria.slides') ?>">
                <?php foreach ($masterClasses as $index => $mc): ?>
                    <button type="button" role="tab" data-mc-dot
                            aria-selected="<?= $index === 0 ? 'true' : 'false' ?>"
                            aria-label="<?= t('aria.slideN') ?> <?= $index + 1 ?>: <?= e(loc($mc, 'title')) ?>"
                            class="h-2 rounded-full transition-all duration-300 <?= $index === 0 ? 'w-8 bg-brand-600' : 'w-2 bg-brand-200 hover:bg-brand-300' ?>"></button>
                <?php endforeach; ?>
            </div>
            <p class="text-sm text-warm-500">
                <span class="font-medium text-warm-700" data-mc-index>1</span> / <?= count($masterClasses) ?>
                <span class="mx-2 text-brand-200">·</span>
                <span data-mc-title><?= e(loc($masterClasses[0], 'title')) ?></span>
            </p>
        </div>
    </div>
</section>
</div>
<?php endif; ?>

<?php $previewCount = 3; $total = (int) site('about_paragraphs'); ?>
<section id="about" class="page-section section-alt section-stitch">
    <div class="container-main">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <?= revealStart() ?>
                <div class="relative">
                    <div class="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand-100/60"></div>
                    <div class="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5">
                        <img src="/images/room.jpg" alt="<?= t('about.photoAlt') ?>" loading="lazy"
                             class="absolute inset-0 size-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]">
                    </div>
                    <div class="mt-5 text-center lg:text-left">
                        <p class="font-heading text-lg font-semibold text-warm-900">Ольга Лаптева</p>
                        <p class="text-sm text-warm-500"><?= t('about.role') ?></p>
                    </div>
                </div>
            </div>

            <?= revealStart(120) ?>
                <div class="space-y-6">
                    <?php
                    render('partials/section-header', [
                        'eyebrow' => t('about.eyebrow'),
                        'titleHtml' => t('about.title.before') . ' <span class="text-gradient">' . t('about.title.accent') . '</span>',
                        'align' => 'left',
                    ]);
                    ?>
                    <div class="flex flex-col items-center space-y-4 text-base leading-relaxed text-warm-500" data-expandable>
                        <?php for ($i = 0; $i < $total; $i++): ?>
                            <p class="w-full" <?= $i >= $previewCount ? 'data-expandable-extra hidden' : '' ?>><?= t('about.p' . $i) ?></p>
                        <?php endfor; ?>
                        <button type="button" class="btn-secondary mx-auto h-11 px-6" aria-expanded="false" data-expandable-toggle>
                            <span data-label-collapsed class="inline-flex items-center gap-2"><?= icon('chevron-down', 'size-4') ?><?= t('cta.readMore') ?></span>
                            <span data-label-expanded class="hidden items-center gap-2"><?= icon('chevron-up', 'size-4') ?><?= t('cta.hide') ?></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

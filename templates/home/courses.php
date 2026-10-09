<?php /** @var list<array<string, mixed>> $courses */ ?>
<section id="courses" class="page-section section-stitch">
    <div class="container-main">
        <?= revealStart(0, '', 'right') ?>
            <?php
            render('partials/section-header', [
                'eyebrow' => t('courses.eyebrow'),
                'titleHtml' => t('courses.title'),
                'description' => t('courses.desc'),
            ]);
            ?>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <?php foreach ($courses as $index => $course): ?>
                <?= revealStart(($index % 3) * 80, 'h-full') ?>
                    <article class="card-hover flex h-full flex-col bg-gradient-to-br <?= e((string) $course['accent']) ?>">
                        <div class="relative flex flex-1 flex-col justify-start gap-2 px-5 pb-5 pt-2">
                            <span class="absolute right-4 top-2 text-3xl" aria-hidden="true"><?= e((string) $course['emoji']) ?></span>
                            <?php if (loc($course, 'badge') !== ''): ?>
                                <span class="badge-soft"><span><?= priceText(loc($course, 'badge')) ?></span></span>
                            <?php endif; ?>
                            <h3 class="pr-10 font-heading text-xl font-semibold text-warm-900"><?= e(loc($course, 'title')) ?></h3>
                            <p class="text-base leading-relaxed text-warm-500"><?= e(loc($course, 'description')) ?></p>
                            <div class="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm font-medium text-brand-800">
                                <span><?= priceText((string) $course['price_label']) ?></span>
                                <span class="text-warm-500"><?= e(loc($course, 'duration')) ?></span>
                            </div>
                        </div>
                        <div class="border-t border-warm-900/5 bg-white/60 p-4">
                            <a href="/courses/<?= e((string) $course['slug']) ?>/" class="btn-ghost h-10 w-full">
                                <?= t('cta.details') ?><?= icon('arrow-up-right', 'size-4') ?>
                            </a>
                        </div>
                    </article>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?= revealStart(0, '', 'right') ?>
<section id="schedule" class="page-section section-alt">
    <div class="container-main">
        <?php
        render('partials/section-header', [
            'eyebrow' => t('schedule.eyebrow'),
            'titleHtml' => t('schedule.title'),
            'description' => t('schedule.desc'),
        ]);
        ?>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <?php foreach (SiteContent::scheduleForPage() as $slot): ?>
                <article class="card-soft flex flex-col px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div class="flex items-center gap-2 text-brand-700">
                        <?= icon('calendar-days', 'size-4 shrink-0') ?>
                        <p class="text-sm font-semibold"><?= e($slot['weekday']) ?></p>
                    </div>
                    <p class="mt-2 font-heading text-lg font-semibold text-warm-900"><?= e($slot['time']) ?></p>
                    <p class="mt-1 text-sm font-medium text-warm-800"><?= t('schedule.studio') ?></p>
                    <p class="mt-1 text-xs text-warm-500"><?= e($slot['note']) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
        <div class="mt-8 flex justify-center">
            <a href="/#signup" class="btn-primary h-11 px-6"><?= t('cta.schedule') ?></a>
        </div>
    </div>
</section>
</div>

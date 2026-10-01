<section class="page-section section-alt">
    <div class="container-main">
        <div class="grid gap-6 md:grid-cols-3">
            <?php foreach (site('benefits') as $index => $benefit): ?>
                <?= revealStart($index * 90) ?>
                    <div class="card-soft flex flex-col items-center px-6 pb-6 pt-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/30">
                        <div class="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600 shadow-inner">
                            <?= icon($benefit['icon'], 'size-6') ?>
                        </div>
                        <h3 class="font-heading text-xl font-semibold"><?= t('benefit.' . $benefit['key'] . '.title') ?></h3>
                        <p class="mt-2 text-sm leading-relaxed text-warm-500"><?= t('benefit.' . $benefit['key'] . '.desc') ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

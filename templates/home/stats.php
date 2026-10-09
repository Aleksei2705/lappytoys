<section class="border-b border-brand-100/70 bg-cream py-8 sm:py-10">
    <div class="container-main">
        <?= revealStart() ?>
            <dl class="grid grid-cols-3 gap-4 text-center">
                <?php foreach (site('stats') as $stat): ?>
                    <div class="transition-transform duration-300 hover:-translate-y-1">
                        <?php if ($stat['icon']): ?>
                            <dt class="flex justify-center">
                                <span class="inline-flex size-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                                    <?= icon($stat['icon'], 'size-6') ?>
                                </span>
                            </dt>
                            <dd class="mt-1 text-xs leading-snug text-warm-500 sm:text-sm"><?= t('stat.' . $stat['key']) ?></dd>
                        <?php else: ?>
                            <dt class="font-heading text-2xl font-bold text-brand-700 sm:text-3xl"><?= e($stat['value']) ?></dt>
                            <dd class="mt-1 text-xs leading-snug text-warm-500 sm:text-sm"><?= t('stat.' . $stat['key']) ?></dd>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </dl>
        </div>
    </div>
</section>

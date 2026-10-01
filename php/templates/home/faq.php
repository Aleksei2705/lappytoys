<?= revealStart() ?>
<section id="faq" class="page-section">
    <div class="container-main mx-auto max-w-3xl">
        <?php
        render('partials/section-header', [
            'eyebrow' => t('faq.eyebrow'),
            'titleHtml' => t('faq.title'),
            'description' => t('faq.desc'),
        ]);
        ?>
        <div class="mt-10 space-y-3">
            <?php for ($i = 0; $i < (int) site('faq_count'); $i++): ?>
                <details name="faq" class="card-soft group overflow-hidden">
                    <summary class="flex w-full cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                        <span class="font-heading text-base font-semibold text-warm-900 sm:text-lg"><?= t('faq.' . $i . '.q') ?></span>
                        <?= icon('chevron-down', 'size-5 shrink-0 text-brand-700 transition-transform group-open:rotate-180') ?>
                    </summary>
                    <p class="border-t border-cream-200 px-5 py-4 text-sm leading-relaxed text-warm-500 sm:text-base"><?= t('faq.' . $i . '.a') ?></p>
                </details>
            <?php endfor; ?>
        </div>
    </div>
</section>
</div>

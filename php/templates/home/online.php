<?php /** @var list<array<string, mixed>> $shopProducts */ ?>
<?php if ($shopProducts === []) {
    echo '<div id="online"></div>';
    return;
} ?>
<section id="online" class="page-section">
    <div class="container-main">
        <?php
        render('partials/section-header', [
            'eyebrow' => t('online.eyebrow'),
            'titleHtml' => t('online.title'),
            'description' => t('online.desc'),
        ]);
        ?>
        <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <?php foreach ($shopProducts as $product): ?>
                <article class="card-hover flex h-full flex-col">
                    <div class="flex flex-1 flex-col gap-3 p-5">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600"><?= t('online.kind.' . (string) $product['kind']) ?></p>
                        <h3 class="font-heading text-xl font-semibold text-warm-900"><?= e(loc($product, 'title')) ?></h3>
                        <p class="text-sm leading-relaxed text-warm-500"><?= e(loc($product, 'description')) ?></p>
                        <p class="mt-auto pt-3 font-heading text-2xl font-bold text-brand-700"><?= e(Shop::price((int) $product['price_kzt'])) ?></p>
                    </div>
                    <div class="border-t border-warm-900/5 bg-white/60 p-4">
                        <a href="/online/<?= e((string) $product['slug']) ?>/" class="btn-ghost h-10 w-full"><?= t('cta.details') ?><?= icon('arrow-up-right', 'size-4') ?></a>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

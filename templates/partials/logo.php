<?php
$imageClass = $imageClass ?? 'size-10 shrink-0 object-contain sm:size-12';
$titleClass = $titleClass ?? 'font-heading text-base font-semibold tracking-tight text-brand-800 sm:text-xl';
$subtitleClass = $subtitleClass ?? 'text-[11px] text-warm-500 sm:text-sm';
?>
<img src="/images/logo.png" alt="" width="48" height="48" class="<?= e($imageClass) ?>">
<span class="flex min-w-0 flex-col leading-tight">
    <span class="<?= e($titleClass) ?>"><?= e((string) site('brand_title')) ?></span>
    <span class="<?= e($subtitleClass) ?>"><?= t('brand.subtitle') ?></span>
</span>

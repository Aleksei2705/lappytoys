<?php
/**
 * All values are pre-escaped HTML (use t() / e()).
 *
 * @var string $eyebrow
 * @var string $titleHtml
 * @var string|null $description
 * @var string|null $align 'center' | 'left'
 */
$alignClass = ($align ?? 'center') === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl';
?>
<div class="<?= $alignClass ?>">
    <p class="eyebrow"><?= $eyebrow ?></p>
    <h2 class="mt-3 font-heading text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl"><?= $titleHtml ?></h2>
    <?php if (!empty($description)): ?>
        <p class="mt-4 text-base leading-relaxed text-warm-500"><?= $description ?></p>
    <?php endif; ?>
</div>

<?php
$active = 'bg-brand-100 text-brand-800';
$idle = 'text-warm-500 hover:text-brand-800';
$current = I18n::locale();
$back = urlencode($returnPath ?? '/');
?>
<div class="inline-flex h-9 items-center rounded-xl border border-cream-200 bg-white p-0.5 text-xs font-semibold">
    <?php foreach (['kk' => 'KZ', 'ru' => 'RU'] as $code => $label): ?>
        <a href="/lang.php?set=<?= $code ?>&amp;back=<?= e($back) ?>"
           rel="nofollow"
           class="rounded-lg px-2 py-1.5 transition-colors <?= $current === $code ? $active : $idle ?>"
           <?= $current === $code ? 'aria-current="true"' : '' ?>><?= $label ?></a>
    <?php endforeach; ?>
</div>

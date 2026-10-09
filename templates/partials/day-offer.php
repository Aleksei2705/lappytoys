<?php
/** @var string $offerTone banner|compact */
$compact = ($offerTone ?? 'banner') === 'compact';
?>
<aside class="day-offer<?= $compact ? ' day-offer-compact' : '' ?>">
    <p class="day-offer-kicker"><?= t('offer.kicker') ?></p>
    <div class="day-offer-prices">
        <span class="price-strike-diagonal day-offer-old"><?= t('offer.old') ?></span>
        <span class="day-offer-new"><?= t('offer.new') ?></span>
        <span class="day-offer-save"><?= t('offer.save') ?></span>
    </div>
    <p class="day-offer-text"><?= $compact ? t('offer.short') : t('offer.text') ?></p>
</aside>

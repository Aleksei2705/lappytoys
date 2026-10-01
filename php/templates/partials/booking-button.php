<?php
/** @var string $class Extra utility classes for sizing */
$class = $class ?? 'h-9 px-4 text-sm';
$isExternal = str_starts_with(bookingUrl(), 'http');
?>
<a href="<?= e(bookingUrl()) ?>"
   class="btn-primary group whitespace-nowrap <?= e($class) ?>"
   <?= $isExternal ? 'target="_blank" rel="noopener noreferrer"' : '' ?>
   data-booking-button>
    <?= icon('calendar-check', 'size-4 transition-transform duration-300 group-hover:scale-110') ?>
    <?= t('cta.signup') ?>
</a>

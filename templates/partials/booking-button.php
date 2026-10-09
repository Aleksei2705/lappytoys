<?php
/** @var string $class Extra utility classes for sizing */
$class = $class ?? 'h-9 px-4 text-sm';
$menuClose = $menuClose ?? false;
$isExternal = str_starts_with(bookingUrl(), 'http');
?>
<a href="<?= e(bookingUrl()) ?>"
   class="btn-primary group text-center leading-tight <?= e($class) ?>"
   <?= $isExternal ? 'target="_blank" rel="noopener noreferrer"' : '' ?>
   <?= $menuClose ? 'data-menu-close' : '' ?>
   data-signup-direction="course:trial"
   data-booking-button>
    <?= icon('calendar-check', 'size-4 shrink-0 transition-transform duration-300 group-hover:scale-110') ?>
    <?= t('cta.trial') ?>
</a>

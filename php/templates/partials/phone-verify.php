<?php
/** @var string $phoneInputId */
$phoneInputId = $phoneInputId ?? 'phone';
$codeId = $phoneInputId . '-code';
?>
<div class="phone-verify mt-3" data-phone-verify data-phone-for="<?= e($phoneInputId) ?>">
    <label for="<?= e($codeId) ?>" class="mb-2 block text-sm font-medium text-warm-700"><?= t('phone.code') ?></label>
    <div class="phone-verify-row">
        <input id="<?= e($codeId) ?>" type="text" inputmode="numeric" autocomplete="one-time-code"
               maxlength="6" pattern="[0-9]{6}" class="input-field" data-phone-code
               placeholder="<?= t('phone.codePh') ?>">
        <button type="button" class="btn-secondary phone-verify-send" data-phone-verify-send><?= t('phone.codeSend') ?></button>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-warm-500" data-phone-verify-hint><?= t('phone.codeHint') ?></p>
    <p class="mt-2 hidden text-sm text-red-600" data-phone-verify-error role="alert"></p>
</div>

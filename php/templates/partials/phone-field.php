<?php
/**
 * @var string $id
 * @var string $name
 * @var string $value
 * @var bool $required
 */
$id = $id ?? 'phone';
$name = $name ?? 'phone';
$value = $value ?? '';
$required = $required ?? true;
$kazakh = I18n::locale() === 'kk';
$countries = [
    ['iso' => 'kz', 'dial' => '7', 'ru' => 'Казахстан', 'kk' => 'Қазақстан'],
    ['iso' => 'ru', 'dial' => '7', 'ru' => 'Россия', 'kk' => 'Ресей'],
    ['iso' => 'kg', 'dial' => '996', 'ru' => 'Кыргызстан', 'kk' => 'Қырғызстан'],
    ['iso' => 'uz', 'dial' => '998', 'ru' => 'Узбекистан', 'kk' => 'Өзбекстан'],
    ['iso' => 'tj', 'dial' => '992', 'ru' => 'Таджикистан', 'kk' => 'Тәжікстан'],
    ['iso' => 'tm', 'dial' => '993', 'ru' => 'Туркменистан', 'kk' => 'Түрікменстан'],
    ['iso' => 'az', 'dial' => '994', 'ru' => 'Азербайджан', 'kk' => 'Әзербайжан'],
    ['iso' => 'am', 'dial' => '374', 'ru' => 'Армения', 'kk' => 'Армения'],
    ['iso' => 'ge', 'dial' => '995', 'ru' => 'Грузия', 'kk' => 'Грузия'],
    ['iso' => 'by', 'dial' => '375', 'ru' => 'Беларусь', 'kk' => 'Беларусь'],
    ['iso' => 'ua', 'dial' => '380', 'ru' => 'Украина', 'kk' => 'Украина'],
    ['iso' => 'tr', 'dial' => '90', 'ru' => 'Турция', 'kk' => 'Түркия'],
    ['iso' => 'cn', 'dial' => '86', 'ru' => 'Китай', 'kk' => 'Қытай'],
    ['iso' => 'de', 'dial' => '49', 'ru' => 'Германия', 'kk' => 'Германия'],
    ['iso' => 'us', 'dial' => '1', 'ru' => 'США', 'kk' => 'АҚШ'],
];
?>
<div class="phone-row" data-phone-field>
    <select class="input-field phone-country" data-phone-country aria-label="<?= t('phone.country') ?>">
        <?php foreach ($countries as $country): ?>
            <option value="<?= e($country['iso']) ?>" data-dial="<?= e($country['dial']) ?>" <?= $country['iso'] === 'kz' ? 'selected' : '' ?>>
                <?= e(($kazakh ? $country['kk'] : $country['ru']) . ' +' . $country['dial']) ?>
            </option>
        <?php endforeach; ?>
    </select>
    <input id="<?= e($id) ?>" name="<?= e($name) ?>" type="tel" inputmode="tel" autocomplete="tel"
           <?= $required ? 'required' : '' ?> maxlength="22"
           placeholder="+7 (___) ___-__-__" class="input-field" data-phone-input
           value="<?= e($value) ?>">
</div>

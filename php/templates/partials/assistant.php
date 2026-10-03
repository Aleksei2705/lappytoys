<?php
$slots = [];
foreach (SiteContent::scheduleForPage() as $slot) {
    $note = trim((string) $slot['note']);
    $slots[] = $slot['weekday'] . ' · ' . $slot['time'] . ($note !== '' ? ' (' . $note . ')' : '');
}
$scheduleText = t('assistant.a.schedulePrefix') . ' ' . implode('; ', $slots) . '.';
$payload = [
    'greeting' => t('assistant.greeting'),
    'fallback' => t('assistant.fallback'),
    'thinking' => t('assistant.thinking'),
    'ai' => Assistant::enabled(),
    'csrf' => Security::csrfToken(),
    'answers' => [
        ['keys' => ['запис', 'заяв', 'пробн', 'бесплат', 'жазыл', 'өтінім', 'тегін', 'signup'], 'text' => t('assistant.a.signup'), 'href' => bookingUrl(), 'link' => t('assistant.link.signup')],
        ['keys' => ['адрес', 'где', 'шуга', 'шуға', 'семе', 'семея', 'семей', 'карт', 'мекен'], 'text' => t('assistant.a.address'), 'href' => (string) site('map_link'), 'link' => t('assistant.link.map')],
        ['keys' => ['возраст', 'лет', 'ребен', 'дет', 'жас', 'бала'], 'text' => t('assistant.a.age')],
        ['keys' => ['материал', 'пряж', 'инструмент', 'жіп', 'материал'], 'text' => t('assistant.a.materials')],
        ['keys' => ['длител', 'сколько длит', 'час', 'ұзақ', 'сағат'], 'text' => t('assistant.a.duration')],
        ['keys' => ['цен', 'стоим', 'стоит', 'скид', 'баға', 'тұр', 'акци'], 'text' => t('assistant.a.price'), 'href' => bookingUrl(), 'link' => t('assistant.link.signup')],
        ['keys' => ['расписан', 'время', 'когда', 'вторник', 'суббот', 'кесте', 'уақыт'], 'text' => $scheduleText, 'href' => '/#schedule', 'link' => t('assistant.link.schedule')],
        ['keys' => ['групп', 'индивид', 'топ'], 'text' => t('assistant.a.group')],
        ['keys' => ['курс', 'вязан', 'макраме', 'вышив', 'бисер', 'шить', 'направлен', 'тоқым', 'кесте', 'моншақ'], 'text' => t('assistant.a.directions'), 'href' => '/#courses', 'link' => t('assistant.link.courses')],
        ['keys' => ['телефон', 'позвон', 'whatsapp', 'ватсап', 'ватцап', 'telegram', 'телег', 'написать'], 'text' => (string) site('phone_display'), 'href' => (string) site('whatsapp'), 'link' => t('assistant.link.whatsapp')],
    ],
];
?>
<div class="assistant" data-assistant>
        <div class="assistant-panel" id="assistant-panel" hidden data-assistant-panel>
        <div class="assistant-head">
            <img class="assistant-avatar" src="/images/assistant-avatar.jpg" alt="" width="44" height="44">
            <div class="min-w-0">
                <p class="assistant-title"><?= t('assistant.title') ?></p>
                <p class="assistant-role"><?= t('assistant.role') ?></p>
            </div>
            <button type="button" class="assistant-close" data-assistant-close aria-label="<?= t('assistant.close') ?>"><?= icon('x', 'size-4') ?></button>
        </div>
        <div class="assistant-log" data-assistant-log></div>
        <div class="assistant-chips">
            <?php foreach (['signup', 'address', 'age', 'price', 'time'] as $chip): ?>
                <button type="button" class="assistant-chip" data-assistant-ask="<?= e(t('assistant.ask.' . $chip)) ?>"><?= t('assistant.chip.' . $chip) ?></button>
            <?php endforeach; ?>
        </div>
        <form class="assistant-form" data-assistant-form>
            <input class="assistant-input" type="text" name="q" maxlength="240" autocomplete="off" placeholder="<?= e(t('assistant.placeholder')) ?>" aria-label="<?= e(t('assistant.placeholder')) ?>">
            <button type="submit" class="assistant-send"><?= t('assistant.send') ?></button>
        </form>
    </div>
    <button type="button" class="assistant-nudge" hidden data-assistant-nudge><?= t('assistant.idle') ?></button>
    <button type="button" class="assistant-toggle" data-assistant-toggle aria-expanded="false" aria-controls="assistant-panel">
        <img class="assistant-avatar assistant-avatar-sm" src="/images/assistant-avatar.jpg" alt="" width="32" height="32">
        <span><?= t('assistant.title') ?></span>
    </button>
    <script type="application/json" data-assistant-data><?= json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
</div>

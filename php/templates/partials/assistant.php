<?php
$slots = [];
foreach (SiteContent::scheduleForPage() as $slot) {
    $note = trim((string) $slot['note']);
    $slots[] = $slot['weekday'] . ' · ' . $slot['time'] . ($note !== '' ? ' (' . $note . ')' : '');
}
$scheduleText = t('assistant.a.schedulePrefix') . ' ' . implode('; ', $slots) . '.';
$variants = static function (string $base): array {
    $lines = [t($base)];
    foreach ([2, 3] as $index) {
        $key = str_starts_with($base, 'assistant.a.')
            ? 'assistant.v.' . substr($base, strlen('assistant.a.')) . '.' . $index
            : $base . '.' . $index;
        $lines[] = t($key);
    }
    return $lines;
};
$payload = [
    'greetings' => $variants('assistant.greeting'),
    'fallbacks' => $variants('assistant.fallback'),
    'asides' => [t('assistant.aside.1'), t('assistant.aside.2'), t('assistant.aside.3')],
    'signupHref' => bookingUrl(),
    'signupLink' => t('assistant.link.signup'),
    'thinking' => t('assistant.thinking'),
    'busy' => t('assistant.busy'),
    'ai' => Assistant::enabled(),
    'csrf' => Security::csrfToken(),
    'answers' => [
        ['keys' => ['запис', 'заяв', 'пробн', 'бесплат', 'жазыл', 'өтінім', 'тегін', 'signup'], 'texts' => $variants('assistant.a.signup'), 'href' => bookingUrl(), 'link' => t('assistant.link.signup')],
        ['keys' => ['адрес', 'где', 'шуга', 'шуға', 'семе', 'семея', 'семей', 'карт', 'мекен'], 'texts' => $variants('assistant.a.address'), 'href' => (string) site('map_link'), 'link' => t('assistant.link.map')],
        ['keys' => ['возраст', 'лет', 'ребен', 'дет', 'жас', 'бала'], 'texts' => $variants('assistant.a.age')],
        ['keys' => ['материал', 'пряж', 'инструмент', 'жіп', 'материал'], 'texts' => $variants('assistant.a.materials')],
        ['keys' => ['длител', 'сколько длит', 'час', 'ұзақ', 'сағат'], 'texts' => $variants('assistant.a.duration')],
        ['keys' => ['цен', 'стоим', 'стоит', 'скид', 'баға', 'тұр', 'акци'], 'texts' => $variants('assistant.a.price'), 'href' => bookingUrl(), 'link' => t('assistant.link.signup')],
        ['keys' => ['расписан', 'время', 'когда', 'вторник', 'суббот', 'кесте', 'уақыт'], 'texts' => [$scheduleText], 'href' => '/#schedule', 'link' => t('assistant.link.schedule')],
        ['keys' => ['групп', 'индивид', 'топ'], 'texts' => $variants('assistant.a.group')],
        ['keys' => ['курс', 'вязан', 'макраме', 'вышив', 'бисер', 'шить', 'направлен', 'тоқым', 'кесте', 'моншақ'], 'texts' => $variants('assistant.a.directions'), 'href' => '/#courses', 'link' => t('assistant.link.courses')],
        ['keys' => ['телефон', 'позвон', 'whatsapp', 'ватсап', 'ватцап', 'telegram', 'телег', 'написать'], 'text' => (string) site('phone_display'), 'href' => (string) site('whatsapp'), 'link' => t('assistant.link.whatsapp')],
    ],
];
?>
<div class="assistant" data-assistant>
        <div class="assistant-panel" id="assistant-panel" hidden data-assistant-panel>
        <div class="assistant-head">
            <img class="assistant-avatar" src="/images/assistant-avatar.jpg?v=2" alt="" width="44" height="44">
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
            <input class="assistant-input" type="text" name="q" maxlength="240" autocomplete="off" readonly placeholder="<?= e(t('assistant.placeholder')) ?>" aria-label="<?= e(t('assistant.placeholder')) ?>">
            <button type="submit" class="assistant-send"><?= t('assistant.send') ?></button>
        </form>
    </div>
    <div class="assistant-offer" hidden data-assistant-nudge>
        <button type="button" class="assistant-offer-close" hidden data-assistant-dismiss aria-label="<?= t('assistant.close') ?>"><?= icon('x', 'size-3.5') ?></button>
        <button type="button" class="assistant-nudge" data-assistant-offer>
            <span><?= t('assistant.idle') ?></span>
        </button>
    </div>
    <button type="button" class="assistant-toggle" data-assistant-toggle aria-expanded="false" aria-controls="assistant-panel" aria-label="<?= t('assistant.open') ?>">
        <img class="assistant-avatar assistant-avatar-sm" src="/images/assistant-avatar.jpg?v=2" alt="" width="40" height="40">
    </button>
    <script type="application/json" data-assistant-data><?= json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
</div>

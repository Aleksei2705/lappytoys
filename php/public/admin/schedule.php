<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Расписание';
$adminSection = 'schedule';
$slots = [];
$loadError = false;

try {
    SiteContent::ensureTable();
    if (Admin::isPost()) {
        Admin::verifyPost();
        $weekdays = $_POST['weekday'] ?? [];
        $times = $_POST['time'] ?? [];
        $notesRu = $_POST['note_ru'] ?? [];
        $notesKk = $_POST['note_kk'] ?? [];
        $rows = [];
        $count = is_array($times) ? count($times) : 0;
        for ($i = 0; $i < $count && count($rows) < 14; $i++) {
            $day = is_array($weekdays) ? Admin::text($weekdays, (string) $i) : '';
            $time = is_array($times) ? Admin::text($times, (string) $i) : '';
            if (!in_array($day, SiteContent::WEEKDAYS, true) || $time === '') {
                continue;
            }
            $rows[] = [
                'weekday' => $day,
                'time' => mb_substr($time, 0, 80),
                'note_ru' => mb_substr(is_array($notesRu) ? Admin::text($notesRu, (string) $i) : '', 0, 180),
                'note_kk' => mb_substr(is_array($notesKk) ? Admin::text($notesKk, (string) $i) : '', 0, 180),
            ];
        }
        SiteContent::saveSchedule($rows);
        Admin::flash('success', 'Расписание сохранено и уже на сайте.');
        Admin::redirect('/admin/schedule.php');
    }
    $slots = SiteContent::scheduleRows();
} catch (RuntimeException) {
    $loadError = true;
}

require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($loadError): ?>
    <p class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Не удалось открыть расписание. Проверьте подключение к базе.</p>
<?php else: ?>
    <p class="mb-5 max-w-2xl text-sm text-warm-500">Дни и часы на главной. Пустое время не сохранится. Порядок — сверху вниз.</p>
    <form method="post" class="space-y-4">
        <?= Security::csrfField() ?>
        <div id="schedule-rows" class="space-y-3">
            <?php foreach ($slots as $slot): ?>
                <?php $day = (string) ($slot['weekday'] ?? 'tue'); ?>
                <div class="card-soft grid gap-3 p-4 sm:grid-cols-[11rem_1fr_auto]" data-row>
                    <div>
                        <label class="mb-2 block text-sm font-medium">День</label>
                        <select name="weekday[]" class="input-field">
                            <?php foreach (SiteContent::WEEKDAYS as $weekday): ?>
                                <option value="<?= e($weekday) ?>" <?= $day === $weekday ? 'selected' : '' ?>><?= e(I18n::translateIn('ru', 'weekday.' . $weekday)) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-3">
                        <div>
                            <label class="mb-2 block text-sm font-medium">Время</label>
                            <input name="time[]" maxlength="80" value="<?= e((string) ($slot['time'] ?? '')) ?>" class="input-field" placeholder="16:30–18:00">
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Подпись (рус.)</label>
                            <input name="note_ru[]" maxlength="180" value="<?= e((string) ($slot['note_ru'] ?? '')) ?>" class="input-field">
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Подпись (қаз.)</label>
                            <input name="note_kk[]" maxlength="180" value="<?= e((string) ($slot['note_kk'] ?? '')) ?>" class="input-field">
                        </div>
                    </div>
                    <div class="flex items-end gap-2">
                        <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="up" aria-label="Выше">↑</button>
                        <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="down" aria-label="Ниже">↓</button>
                        <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <div class="flex flex-wrap gap-3">
            <button type="button" class="btn-secondary !px-4 !py-2" data-add-row="#schedule-rows" data-add-template="#schedule-template">+ Окно</button>
            <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
        </div>
    </form>
    <template id="schedule-template">
        <div class="card-soft grid gap-3 p-4 sm:grid-cols-[11rem_1fr_auto]" data-row>
            <div>
                <label class="mb-2 block text-sm font-medium">День</label>
                <select name="weekday[]" class="input-field">
                    <?php foreach (SiteContent::WEEKDAYS as $weekday): ?>
                        <option value="<?= e($weekday) ?>"><?= e(I18n::translateIn('ru', 'weekday.' . $weekday)) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="grid gap-3 sm:grid-cols-3">
                <div>
                    <label class="mb-2 block text-sm font-medium">Время</label>
                    <input name="time[]" maxlength="80" class="input-field" placeholder="16:30–18:00">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium">Подпись (рус.)</label>
                    <input name="note_ru[]" maxlength="180" class="input-field">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium">Подпись (қаз.)</label>
                    <input name="note_kk[]" maxlength="180" class="input-field">
                </div>
            </div>
            <div class="flex items-end gap-2">
                <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="up" aria-label="Выше">↑</button>
                <button type="button" class="btn-ghost !px-2 !py-1.5" data-move="down" aria-label="Ниже">↓</button>
                <button type="button" class="text-sm text-red-600 underline" data-remove-row>Убрать</button>
            </div>
        </div>
    </template>
<?php endif; ?>
<?php require APP_ROOT . '/templates/admin/footer.php';

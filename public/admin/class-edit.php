<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();

const CLASS_KINDS = ['course' => 'Курс', 'master_class' => 'Мастер-класс'];

/** field => [label, max length, required] */
const CLASS_TEXT_FIELDS = [
    'title_ru' => ['Название (рус.)', 160, true],
    'title_kk' => ['Название (қаз.)', 160, false],
    'description_ru' => ['Краткое описание для карточки (рус.)', 500, true],
    'description_kk' => ['Краткое описание для карточки (қаз.)', 500, false],
    'badge_ru' => ['Бейдж (рус.)', 40, false],
    'badge_kk' => ['Бейдж (қаз.)', 40, false],
    'duration_ru' => ['Длительность (рус.)', 60, false],
    'duration_kk' => ['Длительность (қаз.)', 60, false],
    'level_ru' => ['Уровень (рус.)', 60, false],
    'level_kk' => ['Уровень (қаз.)', 60, false],
];
const CLASS_LONG_FIELDS = ['intro_ru' => 'Вступление (рус.)', 'intro_kk' => 'Вступление (қаз.)'];
const CLASS_LIST_FIELDS = [
    'details_ru' => 'Подробности — абзацы (рус.)', 'details_kk' => 'Подробности — абзацы (қаз.)',
    'learn_ru' => 'Чему научитесь (рус.)', 'learn_kk' => 'Чему научитесь (қаз.)',
    'for_whom_ru' => 'Для кого (рус.)', 'for_whom_kk' => 'Для кого (қаз.)',
];

/** Gradient presets; the Tailwind safelist covers every from-/to- pair of these four tones. */
function accentOptions(): array
{
    $tones = ['brand-50', 'brand-100', 'accent-50', 'accent-100'];
    $options = [];
    foreach ($tones as $from) {
        foreach ($tones as $to) {
            if ($from !== $to) {
                $options[] = "from-{$from} to-{$to}";
            }
        }
    }
    return $options;
}

function accentLabel(string $accent): string
{
    $names = [
        'brand-50' => 'пудра',
        'brand-100' => 'розовый',
        'accent-50' => 'персик',
        'accent-100' => 'тёплый',
    ];
    if (preg_match('/^from-(brand-50|brand-100|accent-50|accent-100) to-(brand-50|brand-100|accent-50|accent-100)$/', $accent, $match) !== 1) {
        return $accent;
    }
    return $names[$match[1]] . ' → ' . $names[$match[2]];
}

$id = Admin::intParam($_GET, 'id');
$errors = [];
$existing = null;
$categories = [];
$form = [];

try {
    $existing = $id > 0 ? Database::fetchOne('SELECT * FROM classes WHERE id = ?', [$id]) : null;
    if ($id > 0 && $existing === null) {
        Admin::flash('error', 'Запись не найдена.');
        Admin::redirect('/admin/classes.php?kind=course');
    }
    $categories = Database::fetchAll('SELECT id, title_ru FROM categories ORDER BY sort_order, id');

    if ($existing !== null) {
        $form = $existing;
        foreach (array_keys(CLASS_LIST_FIELDS) as $field) {
            $form[$field] = Admin::jsonToLines($existing[$field]);
        }
    } else {
        $kind = Admin::text($_GET, 'kind');
        $form = ['kind' => isset(CLASS_KINDS[$kind]) ? $kind : 'course', 'accent' => accentOptions()[0], 'is_published' => 1, 'sort_order' => 0, 'price_label' => '', 'image_path' => null];
    }

    if (Admin::isPost()) {
        Admin::verifyPost();

        $form = ['image_path' => $existing['image_path'] ?? null];
        foreach ([...array_keys(CLASS_TEXT_FIELDS), ...array_keys(CLASS_LONG_FIELDS), ...array_keys(CLASS_LIST_FIELDS), 'slug', 'kind', 'price_label', 'emoji', 'accent'] as $field) {
            $form[$field] = Admin::text($_POST, $field);
        }
        $form['category_id'] = Admin::intParam($_POST, 'category_id') ?: null;
        $form['sort_order'] = (int) ($_POST['sort_order'] ?? 0);
        $form['is_published'] = isset($_POST['is_published']) ? 1 : 0;

        if (preg_match('/^[a-z0-9-]{1,80}$/', $form['slug']) !== 1) {
            $errors[] = 'Slug: только латиница, цифры и дефис (до 80 символов).';
        } elseif (Database::fetchOne('SELECT id FROM classes WHERE slug = ? AND id <> ?', [$form['slug'], $id]) !== null) {
            $errors[] = 'Запись с таким slug уже существует.';
        }
        if (!isset(CLASS_KINDS[$form['kind']])) {
            $errors[] = 'Некорректный тип записи.';
        }
        foreach (CLASS_TEXT_FIELDS as $field => [$label, $max, $required]) {
            $length = mb_strlen($form[$field]);
            if (($required && $length === 0) || $length > $max) {
                $errors[] = "{$label}: " . ($required ? "обязательно, до {$max} символов." : "до {$max} символов.");
            }
        }
        foreach (array_keys(CLASS_LONG_FIELDS) as $field) {
            if (mb_strlen($form[$field]) > 5000) {
                $errors[] = 'Вступление: до 5000 символов.';
            }
        }
        foreach (array_keys(CLASS_LIST_FIELDS) as $field) {
            if (mb_strlen($form[$field]) > 10000) {
                $errors[] = 'Списки и абзацы: до 10000 символов в поле.';
            }
        }
        $priceLength = mb_strlen($form['price_label']);
        if ($priceLength < 1 || $priceLength > 60 || mb_strlen($form['emoji']) > 16) {
            $errors[] = 'Цена: от 1 до 60 символов, эмодзи — до 16.';
        }
        if (!in_array($form['accent'], accentOptions(), true)) {
            $errors[] = 'Некорректный цвет карточки.';
        }
        if ($form['category_id'] !== null && !in_array($form['category_id'], array_map(static fn (array $c): int => (int) $c['id'], $categories), true)) {
            $errors[] = 'Категория не найдена.';
        }

        $newImage = null;
        $hasUpload = ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
        if ($errors === [] && $hasUpload) {
            try {
                $newImage = Admin::storeImage($_FILES['image'], 'classes');
            } catch (InvalidArgumentException $exception) {
                $errors[] = $exception->getMessage();
            }
        }

        if ($errors === []) {
            $oldImage = $existing['image_path'] ?? null;
            $imagePath = $oldImage;
            if ($newImage !== null) {
                $imagePath = $newImage;
            } elseif (isset($_POST['remove_image'])) {
                $imagePath = null;
            }

            $nullable = static fn (string $value): ?string => $value === '' ? null : $value;
            $columns = [
                'slug' => $form['slug'], 'kind' => $form['kind'], 'category_id' => $form['category_id'],
                'title_ru' => $form['title_ru'], 'title_kk' => $nullable($form['title_kk']),
                'description_ru' => $form['description_ru'], 'description_kk' => $nullable($form['description_kk']),
                'intro_ru' => $nullable($form['intro_ru']), 'intro_kk' => $nullable($form['intro_kk']),
                'badge_ru' => $nullable($form['badge_ru']), 'badge_kk' => $nullable($form['badge_kk']),
                'price_label' => $form['price_label'],
                'duration_ru' => $nullable($form['duration_ru']), 'duration_kk' => $nullable($form['duration_kk']),
                'level_ru' => $nullable($form['level_ru']), 'level_kk' => $nullable($form['level_kk']),
                'emoji' => $nullable($form['emoji']), 'accent' => $form['accent'],
                'sort_order' => $form['sort_order'], 'is_published' => $form['is_published'],
                'image_path' => $imagePath,
            ];
            foreach (array_keys(CLASS_LIST_FIELDS) as $field) {
                $columns[$field] = Admin::linesToJson($form[$field]);
            }

            try {
                if ($existing === null) {
                    Database::execute(
                        'INSERT INTO classes (' . implode(', ', array_keys($columns)) . ') VALUES (' . implode(', ', array_fill(0, count($columns), '?')) . ')',
                        array_values($columns),
                    );
                } else {
                    Database::execute(
                        'UPDATE classes SET ' . implode(', ', array_map(static fn (string $c): string => "{$c} = ?", array_keys($columns))) . ' WHERE id = ?',
                        [...array_values($columns), $id],
                    );
                }
            } catch (RuntimeException $exception) {
                Admin::deleteUploadedImage($newImage);
                throw $exception;
            }

            if ($imagePath !== $oldImage) {
                Admin::deleteUploadedImage($oldImage);
            }
            Admin::flash('success', 'Сохранено.');
            $returnKind = isset(CLASS_KINDS[$form['kind'] ?? '']) ? $form['kind'] : 'course';
            Admin::redirect('/admin/classes.php?kind=' . $returnKind);
        }
    }
} catch (RuntimeException) {
    $errors[] = 'Ошибка базы данных. Подробности в логе сервера.';
}

$val = static fn (string $name): string => e((string) ($form[$name] ?? ''));
$localeField = static function (string $name, string $label, int $max, bool $area, bool $required = false) use ($val): void {
    $locale = str_ends_with($name, '_kk') ? 'kk' : 'ru';
    ?>
    <div data-locale-field="<?= $locale ?>" <?= $locale === 'kk' ? 'hidden' : '' ?>>
        <label for="<?= e($name) ?>" class="mb-2 block text-sm font-medium"><?= e($label) ?></label>
        <?php if ($area): ?>
            <textarea id="<?= e($name) ?>" name="<?= e($name) ?>" rows="4" maxlength="<?= $max ?>" <?= $required ? 'required' : '' ?> class="textarea-field"><?= $val($name) ?></textarea>
        <?php else: ?>
            <input id="<?= e($name) ?>" name="<?= e($name) ?>" maxlength="<?= $max ?>" <?= $required ? 'required' : '' ?> value="<?= $val($name) ?>" class="input-field">
        <?php endif; ?>
    </div>
    <?php
};
$adminSection = (($form['kind'] ?? 'course') === 'master_class') ? 'master' : 'courses';
$adminTitle = $existing === null
    ? ($adminSection === 'master' ? 'Новый мастер-класс' : 'Новое занятие')
    : 'Редактирование: ' . ($existing['title_ru'] ?? '');
require APP_ROOT . '/templates/admin/header.php';
?>
<?php if ($errors !== []): ?>
    <ul class="mb-6 list-disc rounded-xl border border-red-200 bg-red-50 py-3 pl-8 pr-4 text-sm text-red-700">
        <?php foreach ($errors as $error): ?><li><?= e($error) ?></li><?php endforeach; ?>
    </ul>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="card-soft max-w-4xl space-y-6 p-6" data-admin-tabs>
    <?= Security::csrfField() ?>

    <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-1">
            <?php foreach (['main' => 'Основное', 'text' => 'Текст', 'lists' => 'Списки', 'photo' => 'Фото'] as $tab => $tabLabel): ?>
                <button type="button" data-tab="<?= e($tab) ?>" class="rounded-lg px-3 py-1.5 text-sm font-medium" aria-selected="<?= $tab === 'main' ? 'true' : 'false' ?>"><?= e($tabLabel) ?></button>
            <?php endforeach; ?>
        </div>
        <div class="flex gap-1" data-locale-switch>
            <button type="button" data-locale="ru" class="rounded-lg px-3 py-1.5 text-sm font-medium" aria-pressed="true">Русский</button>
            <button type="button" data-locale="kk" class="rounded-lg px-3 py-1.5 text-sm font-medium" aria-pressed="false">Қазақша</button>
        </div>
    </div>

    <div data-panel="main" class="space-y-6">
    <div class="grid gap-5 sm:grid-cols-2">
        <div>
            <label for="kind" class="mb-2 block text-sm font-medium">Тип</label>
            <select id="kind" name="kind" class="input-field">
                <?php foreach (CLASS_KINDS as $key => $label): ?>
                    <option value="<?= e($key) ?>" <?= ($form['kind'] ?? '') === $key ? 'selected' : '' ?>><?= e($label) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label for="category_id" class="mb-2 block text-sm font-medium">Категория</label>
            <select id="category_id" name="category_id" class="input-field">
                <option value="">— без категории —</option>
                <?php foreach ($categories as $category): ?>
                    <option value="<?= (int) $category['id'] ?>" <?= (int) ($form['category_id'] ?? 0) === (int) $category['id'] ? 'selected' : '' ?>><?= e((string) $category['title_ru']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label for="slug" class="mb-2 block text-sm font-medium">Slug (адрес страницы)</label>
            <input id="slug" name="slug" required maxlength="80" pattern="[a-z0-9\-]+" value="<?= $val('slug') ?>" placeholder="macrame-sova" class="input-field">
        </div>
        <div>
            <label for="price_label" class="mb-2 block text-sm font-medium">Цена (текстом)</label>
            <input id="price_label" name="price_label" required maxlength="60" value="<?= $val('price_label') ?>" placeholder="от 16 000 ₸" class="input-field">
        </div>
        <div>
            <label for="emoji" class="mb-2 block text-sm font-medium">Эмодзи</label>
            <input id="emoji" name="emoji" maxlength="16" value="<?= $val('emoji') ?>" class="input-field">
        </div>
        <div>
            <label for="accent" class="mb-2 block text-sm font-medium">Градиент карточки</label>
            <select id="accent" name="accent" class="input-field">
                <?php foreach (accentOptions() as $option): ?>
                    <option value="<?= e($option) ?>" <?= ($form['accent'] ?? '') === $option ? 'selected' : '' ?>><?= e(accentLabel($option)) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div>
            <label for="sort_order" class="mb-2 block text-sm font-medium">Порядок сортировки</label>
            <input id="sort_order" name="sort_order" type="number" value="<?= (int) ($form['sort_order'] ?? 0) ?>" class="input-field">
        </div>
        <label class="flex items-center gap-2 pt-8 text-sm">
            <input type="checkbox" name="is_published" value="1" <?= !empty($form['is_published']) ? 'checked' : '' ?>> Показывать на сайте
        </label>
    </div>
    <div class="grid gap-5 sm:grid-cols-2">
        <?php foreach (['title_ru', 'title_kk', 'badge_ru', 'badge_kk', 'duration_ru', 'duration_kk', 'level_ru', 'level_kk'] as $name): ?>
            <?php [$label, $max, $required] = CLASS_TEXT_FIELDS[$name]; $localeField($name, $label, $max, false, $required); ?>
        <?php endforeach; ?>
    </div>
    </div>

    <div data-panel="text" class="grid gap-5" hidden>
        <?php foreach (['description_ru', 'description_kk'] as $name): ?>
            <?php [$label, $max, $required] = CLASS_TEXT_FIELDS[$name]; $localeField($name, $label, $max, true, $required); ?>
        <?php endforeach; ?>
        <?php foreach (CLASS_LONG_FIELDS as $name => $label): ?>
            <?php $localeField($name, $label, 5000, true); ?>
        <?php endforeach; ?>
    </div>

    <div data-panel="lists" class="space-y-5" hidden>
        <p class="text-xs text-warm-500">Каждый пункт — с новой строки.</p>
        <?php foreach (CLASS_LIST_FIELDS as $name => $label): ?>
            <?php $localeField($name, $label, 20000, true); ?>
        <?php endforeach; ?>
    </div>

    <div data-panel="photo" hidden>
        <p class="mb-2 text-sm font-medium">Изображение (JPG, PNG, WebP, до 3 МБ)</p>
        <img id="image-preview" src="<?= $val('image_path') ?>" alt="" class="mb-3 max-h-40 rounded-xl <?= empty($form['image_path']) ? 'hidden' : '' ?>">
        <input type="file" name="image" accept="image/jpeg,image/png,image/webp" data-image-input="#image-preview" class="block text-sm">
        <?php if (!empty($existing['image_path'])): ?>
            <label class="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" name="remove_image" value="1"> Удалить текущее изображение</label>
        <?php endif; ?>
    </div>

    <div class="flex gap-3">
        <button type="submit" class="btn-primary h-11 px-8">Сохранить</button>
        <a href="/admin/classes.php?kind=<?= e((string) ($form['kind'] ?? 'course')) ?>" class="btn-secondary h-11 px-6">Отмена</a>
    </div>
</form>
<?php require APP_ROOT . '/templates/admin/footer.php';

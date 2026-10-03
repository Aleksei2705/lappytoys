<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/app/bootstrap.php';

$adminUser = Admin::guard();
$adminTitle = 'Категории';
$adminSection = 'categories';

/** @return string|null validation error */
function validateCategory(array $post, int $ignoreId): ?string
{
    $slug = Admin::text($post, 'slug');
    if (preg_match('/^[a-z0-9-]{1,60}$/', $slug) !== 1) {
        return 'Slug: только латиница, цифры и дефис (до 60 символов).';
    }
    $titleLength = mb_strlen(Admin::text($post, 'title_ru'));
    if ($titleLength < 2 || $titleLength > 120 || mb_strlen(Admin::text($post, 'title_kk')) > 120) {
        return 'Название: от 2 до 120 символов.';
    }
    $duplicate = Database::fetchOne('SELECT id FROM categories WHERE slug = ? AND id <> ?', [$slug, $ignoreId]);
    return $duplicate !== null ? 'Категория с таким slug уже есть.' : null;
}

try {
    if (Admin::isPost()) {
        Admin::verifyPost();
        $action = Admin::text($_POST, 'action');
        $id = Admin::intParam($_POST, 'id');

        if ($action === 'delete') {
            Admin::guard('admin');
            if ($id > 0) {
                Database::execute('DELETE FROM categories WHERE id = ?', [$id]);
                Admin::flash('success', 'Категория удалена. У её курсов теперь нет категории.');
            }
        } elseif ($action === 'save' || $action === 'create') {
            $error = validateCategory($_POST, $action === 'save' ? $id : 0);
            if ($error !== null) {
                Admin::flash('error', $error);
            } else {
                $params = [Admin::text($_POST, 'slug'), Admin::text($_POST, 'title_ru'), Admin::textOrNull($_POST, 'title_kk'), (int) ($_POST['sort_order'] ?? 0)];
                if ($action === 'create') {
                    Database::execute('INSERT INTO categories (slug, title_ru, title_kk, sort_order) VALUES (?, ?, ?, ?)', $params);
                } else {
                    Database::execute('UPDATE categories SET slug = ?, title_ru = ?, title_kk = ?, sort_order = ? WHERE id = ?', [...$params, $id]);
                }
                Admin::flash('success', 'Категория сохранена.');
            }
        }
        Admin::redirect('/admin/categories.php');
    }

    $categories = Database::fetchAll(
        'SELECT cat.*, (SELECT COUNT(*) FROM classes c WHERE c.category_id = cat.id) AS classes_count
         FROM categories cat ORDER BY sort_order, id',
    );
} catch (RuntimeException) {
    Admin::flash('error', 'Ошибка базы данных. Подробности в логе сервера.');
    $categories = [];
}

require APP_ROOT . '/templates/admin/header.php';
?>
<div class="space-y-3">
    <?php foreach ($categories as $category): ?>
        <form method="post" class="card-soft grid items-end gap-3 p-4 text-sm sm:grid-cols-[1fr_1fr_1fr_5rem_auto]">
            <?= Security::csrfField() ?>
            <input type="hidden" name="id" value="<?= (int) $category['id'] ?>">
            <label>Slug<input name="slug" required maxlength="60" value="<?= e((string) $category['slug']) ?>" class="input-field mt-1"></label>
            <label>Название (рус.)<input name="title_ru" required maxlength="120" value="<?= e((string) $category['title_ru']) ?>" class="input-field mt-1"></label>
            <label>Название (қаз.)<input name="title_kk" maxlength="120" value="<?= e((string) $category['title_kk']) ?>" class="input-field mt-1"></label>
            <label>Порядок<input name="sort_order" type="number" value="<?= (int) $category['sort_order'] ?>" class="input-field mt-1"></label>
            <div class="flex items-center gap-3">
                <button type="submit" name="action" value="save" class="btn-primary !px-4 !py-2">Сохранить</button>
                <?php if ($adminUser['role'] === 'admin'): ?>
                    <button type="submit" name="action" value="delete" class="text-red-600 underline"
                            formnovalidate data-confirm-click="Удалить категорию?">Удалить</button>
                <?php endif; ?>
            </div>
            <p class="text-xs text-warm-500 sm:col-span-5">Курсов в категории: <?= (int) $category['classes_count'] ?></p>
        </form>
    <?php endforeach; ?>
</div>

<h2 class="mb-3 mt-10 font-heading text-xl font-bold">Новая категория</h2>
<form method="post" class="card-soft grid items-end gap-3 p-4 text-sm sm:grid-cols-[1fr_1fr_1fr_5rem_auto]">
    <?= Security::csrfField() ?>
    <input type="hidden" name="action" value="create">
    <label>Slug<input name="slug" required maxlength="60" pattern="[a-z0-9\-]+" placeholder="knitting" class="input-field mt-1"></label>
    <label>Название (рус.)<input name="title_ru" required maxlength="120" class="input-field mt-1"></label>
    <label>Название (қаз.)<input name="title_kk" maxlength="120" class="input-field mt-1"></label>
    <label>Порядок<input name="sort_order" type="number" value="0" class="input-field mt-1"></label>
    <button type="submit" class="btn-primary !px-4 !py-2">Добавить</button>
</form>
<?php require APP_ROOT . '/templates/admin/footer.php';

<?php
/**
 * @var list<array<string, mixed>> $courses
 * @var array{type: string, message: string}|null $flash
 */
$options = [];
foreach ($courses as $course) {
    $options[(string) $course['slug']] = loc($course, 'title');
}
$options['mc'] = I18n::translate('review.option.mc');
$options['other'] = I18n::translate('review.option.other');
?>
<div class="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5" id="review-form">
    <h3 class="font-heading text-xl font-semibold text-warm-900"><?= t('review.formTitle') ?></h3>
    <p class="mt-2 text-sm leading-relaxed text-warm-500"><?= t('review.moderationHint') ?></p>

    <form class="mt-6 space-y-5" method="post" action="/review-submit.php" data-review-form>
        <?= Security::csrfField() ?>
        <div class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
            <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        </div>

        <fieldset class="min-w-0 space-y-5 border-0 p-0">
            <legend class="sr-only"><?= t('review.formLegend') ?></legend>

            <div>
                <label for="review-name" class="mb-2 block text-sm font-medium text-warm-700"><?= t('review.yourName') ?></label>
                <input id="review-name" name="name" required minlength="2" maxlength="60"
                       placeholder="<?= t('review.namePh') ?>" class="input-field" autocomplete="name">
            </div>

            <div>
                <label for="review-course" class="mb-2 block text-sm font-medium text-warm-700"><?= t('review.course') ?></label>
                <select id="review-course" name="course" required class="input-field">
                    <?php foreach ($options as $value => $label): ?>
                        <option value="<?= e((string) $value) ?>"><?= e($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <p class="mb-2 text-sm font-medium text-warm-700"><?= t('review.rating') ?></p>
                <input type="hidden" name="rating" value="5" data-rating-input>
                <div class="flex items-center gap-1" role="group" aria-label="<?= t('review.ratingAria') ?>">
                    <?php for ($value = 1; $value <= 5; $value++): ?>
                        <button type="button" data-rating-value="<?= $value ?>"
                                class="rounded-lg p-1 transition-transform hover:scale-110"
                                aria-label="<?= $value ?> <?= t('review.starsOf') ?>"
                                aria-pressed="<?= $value === 5 ? 'true' : 'false' ?>">
                            <?= icon('star', 'size-8 fill-accent-400 text-accent-400') ?>
                        </button>
                    <?php endfor; ?>
                </div>
            </div>

            <div>
                <label for="review-text" class="mb-2 block text-sm font-medium text-warm-700"><?= t('review.text') ?></label>
                <textarea id="review-text" name="text" required minlength="5" maxlength="600" rows="4"
                          placeholder="<?= t('review.textPh') ?>" class="textarea-field"></textarea>
            </div>

            <button type="submit" class="btn-primary h-11 w-full">
                <?= icon('send', 'size-4') ?><?= t('review.send') ?>
            </button>
        </fieldset>

        <?php if ($flash !== null): ?>
            <p class="text-center text-sm <?= $flash['type'] === 'success' ? 'text-brand-700' : 'text-red-600' ?>" role="status"><?= t($flash['message']) ?></p>
        <?php endif; ?>
    </form>
</div>

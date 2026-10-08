<?php
/**
 * @var list<array<string, mixed>> $courses
 * @var list<array<string, mixed>> $masterClasses
 * @var list<array<string, mixed>> $shopProducts
 * @var array{type: string, message: string}|null $flash
 */
$textMax = ReviewRepository::TEXT_MAX;
?>
<div class="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5" id="review-form">
    <h3 class="font-heading text-xl font-semibold text-warm-900"><?= t('review.formTitle') ?></h3>
    <p class="mt-2 text-sm leading-relaxed text-warm-500"><?= t('review.moderationHint') ?></p>
    <p class="mt-1 text-sm leading-relaxed text-warm-500"><?= t('review.ugcHint') ?></p>

    <form class="mt-6 space-y-5" method="post" action="/review-submit.php" enctype="multipart/form-data" data-review-form>
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
                    <?php if ($courses !== []): ?>
                        <optgroup label="<?= t('review.optionGroup.courses') ?>">
                            <?php foreach ($courses as $course): ?>
                                <option value="<?= e((string) $course['slug']) ?>"><?= e(loc($course, 'title')) ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                    <?php endif; ?>
                    <?php if (($masterClasses ?? []) !== []): ?>
                        <optgroup label="<?= t('review.optionGroup.master') ?>">
                            <?php foreach ($masterClasses as $course): ?>
                                <option value="<?= e((string) $course['slug']) ?>"><?= e(loc($course, 'title')) ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                    <?php endif; ?>
                    <?php if (($shopProducts ?? []) !== []): ?>
                        <optgroup label="<?= t('review.optionGroup.online') ?>">
                            <?php foreach ($shopProducts as $product): ?>
                                <option value="shop:<?= e((string) $product['slug']) ?>"><?= e(loc($product, 'title')) ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                    <?php endif; ?>
                    <optgroup label="<?= t('review.optionGroup.other') ?>">
                        <option value="mc"><?= t('review.option.mc') ?></option>
                        <option value="other"><?= t('review.option.other') ?></option>
                    </optgroup>
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
                <textarea id="review-text" name="text" required minlength="5" maxlength="<?= $textMax ?>" rows="5"
                          placeholder="<?= t('review.textPhLong') ?>" class="textarea-field" data-review-text></textarea>
                <p class="mt-1.5 text-right text-xs text-warm-500"><span data-review-char-count>0</span> / <?= $textMax ?></p>
            </div>

            <div>
                <label for="review-photo" class="mb-2 block text-sm font-medium text-warm-700"><?= t('review.photo') ?></label>
                <p class="mb-2 text-xs text-warm-500"><?= t('review.photoHint') ?></p>
                <input id="review-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"
                       class="block w-full text-sm text-warm-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-800"
                       data-review-photo-input>
                <div class="mt-3 hidden overflow-hidden rounded-2xl border border-cream-200 bg-cream-100/50" data-review-photo-preview>
                    <img alt="" class="max-h-56 w-full object-cover" data-review-photo-preview-img>
                </div>
            </div>

            <?php if (Turnstile::enabled()): ?>
                <div data-turnstile data-sitekey="<?= e(Turnstile::siteKey()) ?>"></div>
                <p class="hidden text-center text-sm text-red-600" data-captcha-error role="alert"><?= t('review.errCaptcha') ?></p>
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
            <?php endif; ?>

            <button type="submit" class="btn-primary h-11 w-full">
                <?= icon('send', 'size-4') ?><?= t('review.send') ?>
            </button>
        </fieldset>

        <?php if ($flash !== null): ?>
            <p class="text-center text-sm <?= $flash['type'] === 'success' ? 'text-brand-700' : 'text-red-600' ?>" role="status"><?= t($flash['message']) ?></p>
        <?php endif; ?>
    </form>
</div>

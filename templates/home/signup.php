<?php
/**
 * @var list<array<string, mixed>> $courses
 * @var list<array<string, mixed>> $masterClasses
 */
$flash = $_SESSION['booking_flash'] ?? null;
unset($_SESSION['booking_flash']);

$waLabels = [
    'hello' => I18n::translate('signup.waHello'),
    'name' => I18n::translate('signup.waName'),
    'phone' => I18n::translate('signup.waPhone'),
    'direction' => I18n::translate('signup.waDirection'),
    'date' => I18n::translate('signup.waDate'),
    'message' => I18n::translate('signup.waMessage'),
    'footer' => I18n::translate('signup.waFooter'),
    'phoneError' => I18n::translate('signup.phoneErr'),
    'whatsapp' => (string) site('whatsapp'),
    'telegram' => (string) site('telegram'),
    'dayOffer' => I18n::translate('offer.short'),
];
?>
<section id="signup" class="page-section section-alt">
    <div class="container-main">
        <?= revealStart(0, 'mx-auto max-w-xl', 'up') ?>
            <?php
            render('partials/section-header', [
                'eyebrow' => t('signup.eyebrow'),
                'titleHtml' => t('signup.title'),
                'description' => t('signup.desc'),
            ]);
            ?>
            <div class="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5" id="signup-form">
                <form class="space-y-5" method="post" action="/booking-submit.php" data-signup-form
                      data-labels="<?= e((string) json_encode($waLabels, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) ?>">
                    <?= Security::csrfField() ?>
                    <div class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
                        <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
                    </div>

                    <div>
                        <label for="name" class="mb-2 block text-sm font-medium text-warm-700"><?= t('signup.name') ?></label>
                        <input id="name" name="name" required minlength="2" maxlength="80" autocomplete="name"
                               placeholder="<?= t('signup.namePh') ?>" class="input-field">
                    </div>
                    <div>
                        <label for="phone" class="mb-2 block text-sm font-medium text-warm-700"><?= t('signup.phone') ?></label>
                        <?php render('partials/phone-field', ['id' => 'phone']); ?>
                        <p id="phone-error" class="mt-2 hidden text-sm text-red-600" data-phone-error></p>
                    </div>
                    <div data-day-offer hidden>
                        <?php render('partials/day-offer', ['offerTone' => 'banner']); ?>
                    </div>
                    <div>
                        <label for="direction" class="mb-2 block text-sm font-medium text-warm-700"><?= t('signup.direction') ?></label>
                        <select id="direction" name="direction" required class="input-field" data-direction>
                            <option value="" disabled selected><?= t('signup.directionPh') ?></option>
                            <?php foreach ($courses as $course): ?>
                                <option value="course:<?= e((string) $course['slug']) ?>"><?= e(loc($course, 'title')) ?></option>
                            <?php endforeach; ?>
                            <?php foreach ($masterClasses as $mc): ?>
                                <option value="mc:<?= e((string) $mc['slug']) ?>"><?= t('signup.mcPrefix') ?> <?= e(loc($mc, 'title')) ?></option>
                            <?php endforeach; ?>
                            <option value="undecided"><?= t('signup.undecided') ?></option>
                        </select>
                    </div>
                    <div>
                        <label for="preferred-date" class="mb-2 block text-sm font-medium text-warm-700"><?= t('signup.date') ?></label>
                        <input id="preferred-date" name="preferredDate" type="date" min="<?= e(date('Y-m-d')) ?>" class="input-field">
                    </div>
                    <div>
                        <label for="message" class="mb-2 block text-sm font-medium text-warm-700"><?= t('signup.message') ?></label>
                        <textarea id="message" name="message" rows="3" maxlength="1000"
                                  placeholder="<?= t('signup.messagePh') ?>" class="textarea-field"></textarea>
                    </div>

                    <div class="flex flex-col gap-3">
                        <?php if (Turnstile::enabled()): ?>
                            <div data-turnstile data-sitekey="<?= e(Turnstile::siteKey()) ?>"></div>
                            <p class="hidden text-center text-sm text-red-600" data-captcha-error role="alert"><?= t('signup.errCaptcha') ?></p>
                            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
                        <?php endif; ?>
                        <button type="submit" class="btn-primary h-11 w-full" data-goal="signup_form">
                            <?= icon('send', 'size-4') ?><?= t('signup.submit') ?>
                        </button>
                        <p class="text-center text-xs uppercase tracking-wider text-warm-500"><?= t('signup.or') ?></p>
                        <div class="grid gap-3 sm:grid-cols-2">
                            <button type="button" class="btn-secondary h-11 w-full" data-direct="whatsapp" data-goal="signup_whatsapp">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                <?= t('signup.viaWhatsapp') ?>
                            </button>
                            <button type="button" class="btn-secondary h-11 w-full" data-direct="telegram" data-goal="signup_telegram">
                                <img src="/images/telegram.svg" alt="" width="128" height="128" class="size-4" aria-hidden="true">
                                <?= t('signup.viaTelegram') ?>
                            </button>
                        </div>
                    </div>

                    <?php if ($flash !== null): ?>
                        <p class="text-center text-sm <?= $flash['type'] === 'success' ? 'text-brand-700' : 'text-red-600' ?>" role="status"><?= t($flash['message']) ?></p>
                    <?php endif; ?>

                    <p class="text-center text-xs leading-relaxed text-warm-500">
                        <?= t('signup.legalServer') ?>
                        <a href="/privacy/" class="underline decoration-brand-300 underline-offset-2 hover:text-brand-800"><?= t('signup.privacy') ?></a>.
                    </p>
                </form>
            </div>
            <div class="mt-6 flex justify-center">
                <a href="#top" class="btn-secondary h-11 px-8"><?= icon('arrow-up', 'size-4') ?><?= t('signup.home') ?></a>
            </div>
        </div>
    </div>
</section>

<div class="guide-exit" hidden data-guide-exit>
    <div class="guide-exit-card" role="dialog" aria-modal="true" aria-labelledby="guide-exit-title">
        <button type="button" class="guide-exit-close" data-guide-exit-close aria-label="<?= t('guide.close') ?>"><?= icon('x', 'size-4') ?></button>
        <div data-guide-exit-form>
            <p class="guide-exit-kicker"><?= t('guide.kicker') ?></p>
            <h2 id="guide-exit-title" class="guide-exit-title"><?= t('guide.title') ?></h2>
            <p class="guide-exit-text"><?= t('guide.text') ?></p>
            <form class="guide-exit-fields" method="post" action="/guide-submit.php" data-guide-form data-phone-error="<?= e(I18n::translate('signup.phoneErr')) ?>">
                <?= Security::csrfField() ?>
                <div class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
                    <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
                </div>
                <?php render('partials/phone-field', ['id' => 'guide-phone']); ?>
                <p class="hidden text-sm text-red-600" data-guide-error role="alert"></p>
                <?php if (Turnstile::enabled()): ?>
                    <div data-turnstile data-sitekey="<?= e(Turnstile::siteKey()) ?>"></div>
                    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
                <?php endif; ?>
                <button type="submit" class="btn-primary h-11 w-full"><?= t('guide.submit') ?></button>
            </form>
            <p class="guide-exit-note"><?= t('guide.note') ?> <a href="/privacy/"><?= t('footer.privacy') ?></a>.</p>
        </div>
        <p class="guide-exit-thanks" hidden data-guide-thanks><?= t('guide.thanks') ?></p>
    </div>
</div>

<?php
$heroBtn = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold leading-snug shadow-md transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:px-4';
?>
<section class="hero-screen">
    <div class="absolute inset-0 overflow-hidden bg-cream">
        <div class="hero-parallax-layer absolute -inset-[8%] bg-cover bg-center" data-hero-parallax
             style="background-image:url(/images/hero-knit.jpg)"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/35 to-transparent"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/90 via-cream/25 to-brand-50/20"></div>
        <div class="pointer-events-none absolute inset-0 bg-white/15"></div>
        <div class="pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light">
            <div class="hero-shimmer absolute inset-0"></div>
        </div>
    </div>
    <div class="container-main relative z-10 flex min-h-0 w-full flex-1 items-end">
        <div class="hero-copy">
            <h1 class="hero-heading max-w-xl">
                <span class="hero-heading-line"><?= t('hero.title.before') ?></span>
                <svg class="hero-heading-yarn" viewBox="0 0 280 14" fill="none" aria-hidden="true">
                    <path d="M2 9 C 28 2, 52 13, 80 7 S 130 1, 160 8 S 220 14, 278 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
                <span class="hero-heading-place">
                    <?= icon('map-pin', 'size-4 shrink-0 sm:size-[1.1rem]') ?>
                    <?= t('hero.title.accent') ?>
                </span>
            </h1>
            <p class="font-heading text-3xl font-bold leading-none tracking-tight text-brand-800 sm:text-4xl"><?= e((string) site('brand_title')) ?></p>
            <p class="text-sm font-medium tracking-wide text-warm-700"><?= t('brand.subtitle') ?></p>
            <p class="hero-usp">
                <strong><?= t('hero.uspLead') ?></strong>
                <?= t('hero.usp') ?>
            </p>

            <div class="hero-actions flex w-full max-w-xl flex-col gap-2.5">
                <div class="hero-cta-row">
                    <a href="#signup" data-signup-direction="course:trial" class="<?= $heroBtn ?> hero-cta">
                        <?= icon('calendar-check', 'size-4 shrink-0') ?><?= t('cta.trial') ?>
                    </a>
                    <div class="hero-messengers">
                        <span><?= t('hero.writeOr') ?></span>
                        <?php
                        $whatsappBase = (string) site('whatsapp');
                        $whatsappHref = $whatsappBase . (str_contains($whatsappBase, '?') ? '&' : '?') . 'text=' . rawurlencode(I18n::translate('wa.floatHello'));
                        ?>
                        <a href="<?= e($whatsappHref) ?>" target="_blank" rel="noopener noreferrer" class="hero-messenger-link" data-goal="hero_whatsapp">
                            <span class="hero-messenger hero-messenger-wa" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </span>
                            WhatsApp
                        </a>
                        <span class="hero-messenger-slash" aria-hidden="true">/</span>
                        <a href="<?= e((string) site('telegram')) ?>" target="_blank" rel="noopener noreferrer" class="hero-messenger-link" data-goal="hero_telegram">
                            <span class="hero-messenger hero-messenger-tg" aria-hidden="true">
                                <img src="/images/telegram.svg" alt="" width="128" height="128">
                            </span>
                            Telegram
                        </a>
                    </div>
                </div>
                <a href="<?= e((string) site('telegram_group')) ?>" target="_blank" rel="noopener noreferrer" class="hero-guide">
                    <span class="hero-guide-icon" aria-hidden="true">
                        <img src="/images/telegram.svg" alt="" width="128" height="128" class="size-7">
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="hero-guide-kicker"><?= t('hero.chatKicker') ?></span>
                        <span class="hero-guide-title"><?= t('hero.chat') ?></span>
                    </span>
                    <?= icon('chevron-right', 'size-5 shrink-0 text-[#1a8bc4]') ?>
                </a>
            </div>
        </div>
        <?php if (is_array($heroFeature ?? null)): ?>
            <button type="button" class="hero-feature" data-hero-feature="<?= e($heroFeature['video']) ?>" aria-label="<?= t('aria.expandVideo') ?>">
                <img class="hero-feature-poster" src="<?= e($heroFeature['poster']) ?>" alt="" width="720" height="960">
                <span class="hero-feature-play" aria-hidden="true"><?= icon('play', 'size-7 fill-current') ?></span>
            </button>
        <?php endif; ?>
    </div>
</section>
<?php if (is_array($heroFeature ?? null)): ?>
    <div class="hero-feature-player" hidden data-hero-feature-player>
        <button type="button" class="hero-feature-close" data-hero-feature-close aria-label="<?= t('aria.close') ?>"><?= icon('x') ?></button>
        <video data-hero-feature-video controls playsinline preload="none" poster="<?= e($heroFeature['poster']) ?>"></video>
    </div>
<?php endif; ?>

<?php
$mapButton = 'btn-secondary h-10 gap-1.5 px-1 text-xs sm:px-2 sm:text-sm';
$mapIcon = 'size-[1.125rem] shrink-0 sm:size-5';
$iconClass = 'size-10 shrink-0';
?>
<section id="contacts" class="page-section section-stitch">
    <div class="container-main">
        <?= revealStart() ?>
            <?php
            render('partials/section-header', [
                'eyebrow' => t('contacts.eyebrow'),
                'titleHtml' => t('contacts.title'),
                'description' => t('contacts.desc'),
            ]);
            ?>
        </div>

        <div class="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
            <?= revealStart() ?>
                <div class="space-y-3">
                    <a href="tel:<?= e((string) site('phone')) ?>" class="contact-card">
                        <div class="flex size-12 shrink-0 items-center justify-center"><img src="/images/phone.png" alt="" width="48" height="48" class="<?= $iconClass ?>" aria-hidden="true"></div>
                        <div>
                            <p class="text-sm text-warm-500"><?= t('contacts.phone') ?></p>
                            <p class="font-semibold text-warm-900"><?= e((string) site('phone_display')) ?></p>
                        </div>
                    </a>
                    <a href="<?= e((string) site('telegram')) ?>" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div class="flex size-12 shrink-0 items-center justify-center"><img src="/images/telegram.svg" alt="" width="128" height="128" class="<?= $iconClass ?>" aria-hidden="true"></div>
                        <div>
                            <p class="text-sm text-warm-500"><?= t('contacts.telegram') ?></p>
                            <p class="font-semibold text-warm-900"><?= e((string) site('telegram_handle')) ?></p>
                        </div>
                    </a>
                    <a href="<?= e((string) site('whatsapp')) ?>" target="_blank" rel="noopener noreferrer" class="contact-card" data-goal="contact_whatsapp">
                        <div class="flex size-12 shrink-0 items-center justify-center">
                            <svg viewBox="0 0 48 48" class="<?= $iconClass ?>" aria-hidden="true">
                                <circle cx="24" cy="24" r="24" fill="#25D366"/>
                                <path fill="#fff" d="M34.5 13.5c-2.7-2.7-6.3-4.2-10.1-4.2-7.9 0-14.3 6.4-14.3 14.3 0 2.5.7 4.9 2 7l-2.1 7.7 7.9-2.1c2 .9 4.2 1.4 6.5 1.4h.006c7.9 0 14.3-6.4 14.3-14.3 0-3.8-1.5-7.4-4.2-10.1zm-10.1 22c-2.2 0-4.3-.6-6.1-1.7l-.4-.3-4.4 1.2 1.2-4.3-.3-.4c-1.2-1.8-1.8-3.9-1.8-6.1 0-6.4 5.2-11.6 11.6-11.6 3.1 0 6 1.2 8.2 3.4s3.4 5.1 3.4 8.2c0 6.4-5.2 11.6-11.6 11.6zm6.4-8.7c-.3-.2-2-1-2.3-1.1-.3-.1-.6-.2-.8.2s-.9 1.1-1.1 1.3-.4.3-.8.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.1-.3 0-.5 0-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.9.6.8.3 1.5.2 2.1.1.6-.1 2-1 2.3-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.3-.6-.5z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-warm-500">WhatsApp</p>
                            <p class="font-semibold text-warm-900"><?= e((string) site('phone_display')) ?></p>
                        </div>
                    </a>
                    <a href="<?= e((string) site('instagram')) ?>" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div class="flex size-12 shrink-0 items-center justify-center"><img src="/images/instagram.png" alt="" width="48" height="48" class="<?= $iconClass ?>" aria-hidden="true"></div>
                        <div>
                            <p class="text-sm text-warm-500">Instagram</p>
                            <p class="font-semibold text-warm-900"><?= e((string) site('instagram_handle')) ?></p>
                        </div>
                    </a>
                    <a href="<?= e((string) site('tiktok')) ?>" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div class="flex size-12 shrink-0 items-center justify-center"><img src="/images/tiktok.svg" alt="" width="48" height="48" class="<?= $iconClass ?>" aria-hidden="true"></div>
                        <div>
                            <p class="text-sm text-warm-500">TikTok</p>
                            <p class="font-semibold text-warm-900"><?= e((string) site('tiktok_handle')) ?></p>
                        </div>
                    </a>
                </div>
            </div>

            <?= revealStart(100) ?>
                <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-2">
                        <a href="<?= e((string) site('map_2gis')) ?>" target="_blank" rel="noopener noreferrer" class="<?= $mapButton ?>">
                            <img src="/images/maps/2gis.png" alt="" width="40" height="40" class="<?= $mapIcon ?>" aria-hidden="true">2ГИС
                        </a>
                        <a href="<?= e((string) site('map_google')) ?>" target="_blank" rel="noopener noreferrer" class="<?= $mapButton ?>">
                            <img src="/images/maps/google-maps.svg" alt="" width="40" height="40" class="<?= $mapIcon ?>" aria-hidden="true">Google
                        </a>
                        <a href="<?= e((string) site('map_link')) ?>" target="_blank" rel="noopener noreferrer" class="<?= $mapButton ?>">
                            <img src="/images/maps/yandex-maps.svg" alt="" width="40" height="40" class="<?= $mapIcon ?>" aria-hidden="true">Яндекс
                        </a>
                    </div>
                    <div class="relative aspect-video overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5 lg:aspect-[4/3]">
                        <iframe title="<?= t('contacts.map') ?>" src="<?= e((string) site('map_embed_url')) ?>"
                                class="absolute inset-0 h-full w-full border-0" loading="lazy" allowfullscreen
                                referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <a href="<?= e((string) site('map_link')) ?>" target="_blank" rel="noopener noreferrer"
                       class="block w-full overflow-hidden whitespace-nowrap text-center font-heading font-semibold leading-none text-brand-700 transition-colors hover:text-brand-800"
                       style="font-size:clamp(0.72rem,3.4vw,1.25rem)"><?= e(SiteContent::address()) ?></a>
                </div>
            </div>
        </div>
    </div>
</section>

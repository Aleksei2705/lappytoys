<section id="instagram" class="page-section section-alt">
    <div class="container-main">
        <?= revealStart() ?>
            <?php render('partials/section-header', [
                'eyebrow' => t('ig.eyebrow'),
                'titleHtml' => t('ig.title'),
                'description' => t('ig.desc'),
            ]); ?>
        </div>
        <div class="mt-8 overflow-x-auto">
            <div class="mx-auto w-full min-w-[326px] max-w-[540px]">
                <blockquote class="instagram-media" data-instgrm-permalink="<?= e(rtrim((string) site('instagram'), '/') . '/?utm_source=ig_embed') ?>" data-instgrm-version="14"
                            style="background:#fff;border:0;border-radius:3px;box-shadow:0 0 1px rgba(0,0,0,.5),0 1px 10px rgba(0,0,0,.15);margin:1px auto;max-width:540px;min-width:326px;padding:0;width:calc(100% - 2px)">
                    <div class="p-6 text-center">
                        <img src="/images/instagram.png" alt="" width="48" height="48" class="mx-auto size-12">
                        <p class="mt-3 font-semibold text-warm-700"><?= e((string) site('instagram_handle')) ?></p>
                        <a href="<?= e((string) site('instagram')) ?>" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-sm text-brand-700 underline"><?= t('ig.open') ?></a>
                    </div>
                </blockquote>
            </div>
        </div>
        <p class="mt-10 flex justify-center"><a href="<?= e((string) site('instagram')) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary h-11 px-6"><img src="/images/instagram.png" alt="" width="16" height="16" class="size-4"><?= t('ig.open') ?></a></p>
    </div>
</section>

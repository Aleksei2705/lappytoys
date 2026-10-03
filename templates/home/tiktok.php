<?php $tiktokUsername = ltrim((string) site('tiktok_handle'), '@'); ?>
<section id="tiktok" class="page-section">
    <div class="container-main">
        <?= revealStart(0, '', 'right') ?>
            <?php render('partials/section-header', [
                'eyebrow' => t('tt.eyebrow'),
                'titleHtml' => t('tt.title'),
                'description' => t('tt.desc'),
            ]); ?>
        </div>
        <div class="mt-8 overflow-x-auto">
            <div class="mx-auto w-full min-w-[288px] max-w-[720px]">
                <blockquote class="tiktok-embed" cite="<?= e((string) site('tiktok')) ?>" data-unique-id="<?= e($tiktokUsername) ?>" data-embed-type="creator" data-embed-from="oembed" style="max-width:720px;min-width:288px">
                    <section>
                        <a target="_blank" rel="noopener noreferrer" href="<?= e((string) site('tiktok')) ?>?refer=creator_embed"><?= e((string) site('tiktok_handle')) ?></a>
                    </section>
                </blockquote>
            </div>
        </div>
        <p class="mt-10 flex justify-center"><a href="<?= e((string) site('tiktok')) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary h-11 px-6"><img src="/images/tiktok.svg" alt="" width="16" height="16" class="size-4"><?= t('tt.open') ?></a></p>
    </div>
</section>

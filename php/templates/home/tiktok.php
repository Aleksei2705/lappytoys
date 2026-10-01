<?php $tiktokUsername = ltrim((string) site('tiktok_handle'), '@'); ?>
<section id="tiktok" class="page-section">
    <div class="container-main">
        <?= revealStart() ?>
            <?php render('partials/section-header', [
                'eyebrow' => t('tt.eyebrow'),
                'titleHtml' => t('tt.title'),
                'description' => t('tt.desc'),
            ]); ?>
        </div>
        <div class="mt-8 overflow-x-auto">
            <div class="mx-auto w-full min-w-[288px] max-w-[720px]">
                <blockquote class="tiktok-embed" cite="<?= e((string) site('tiktok')) ?>" data-unique-id="<?= e($tiktokUsername) ?>" data-embed-type="creator" style="max-width:720px;min-width:288px">
                    <section class="card-soft p-6 text-center">
                        <img src="/images/tiktok.svg" alt="" width="48" height="48" class="mx-auto size-12">
                        <a href="<?= e((string) site('tiktok')) ?>" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block font-semibold text-brand-700 underline"><?= e((string) site('tiktok_handle')) ?></a>
                    </section>
                </blockquote>
            </div>
        </div>
        <p class="mt-10 flex justify-center"><a href="<?= e((string) site('tiktok')) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary h-11 px-6"><img src="/images/tiktok.svg" alt="" width="16" height="16" class="size-4"><?= t('tt.open') ?></a></p>
    </div>
</section>

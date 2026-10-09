<?php
$siteUrl = (string) site('url');
$courses = [
    'Вязание крючком' => 'crochet',
    'Вязание спицами' => 'needles',
    'Макраме' => 'macrame',
    'Вышивка' => 'embroidery',
    'Бисероплетение' => 'beadwork',
    'Пробный урок' => 'trial',
];
$courseItems = [];
foreach ($courses as $title => $slug) {
    $courseItems[] = ['@type' => 'Course', 'name' => $title, 'url' => $siteUrl . '/courses/' . $slug . '/'];
}

$schema = [
    '@context' => 'https://schema.org',
    '@type' => ['LocalBusiness', 'EducationalOrganization'],
    'name' => site('name'),
    'alternateName' => ['Lappy Art', 'lappy.art', 'lappytoys', 'Творческая студия Lappy Art'],
    'description' => 'Творческая студия в Семее: творчество и рукоделие — вязание, макраме, вышивка, бисероплетение, шитьё игрушек. Занятия с нуля для детей и взрослых.',
    'url' => $siteUrl,
    'telephone' => site('phone'),
    'image' => $siteUrl . '/images/logo.png',
    'address' => [
        '@type' => 'PostalAddress',
        'streetAddress' => 'ул. Шугаева 4, каб. 304',
        'addressLocality' => site('city'),
        'addressCountry' => 'KZ',
    ],
    'geo' => ['@type' => 'GeoCoordinates', 'latitude' => 50.412826, 'longitude' => 80.259372],
    'hasMap' => 'https://yandex.kz/maps/-/CXALURZO',
    'areaServed' => ['@type' => 'City', 'name' => site('city')],
    'sameAs' => [site('instagram'), site('tiktok'), site('telegram'), site('telegram_group')],
    'priceRange' => '$$',
    'category' => 'Творчество и рукоделие',
    'teaches' => ['Творчество', 'Вязание крючком', 'Вязание спицами', 'Макраме', 'Вышивка', 'Бисероплетение', 'Шитьё игрушек'],
    'hasOfferCatalog' => [
        '@type' => 'OfferCatalog',
        'name' => 'Творческие курсы и мастер-классы',
        'itemListElement' => [[
            '@type' => 'OfferCatalog',
            'name' => 'Творчество и рукоделие в Семее',
            'itemListElement' => $courseItems,
        ]],
    ],
];
?>
<script type="application/ld+json"><?= json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>

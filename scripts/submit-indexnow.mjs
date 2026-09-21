const host = "lappytoys.kz";
const key = "c3e91a7b4d6f4028a1c5e9b2d7f0a4c8";
const sitemapUrl = `https://${host}/sitemap.xml`;
const keyLocation = `https://${host}/${key}.txt`;

const fallbackUrls = [
  `https://${host}/`,
  `https://${host}/privacy/`,
  `https://${host}/courses/crochet/`,
  `https://${host}/courses/needles/`,
  `https://${host}/courses/macrame/`,
  `https://${host}/courses/embroidery/`,
  `https://${host}/courses/beadwork/`,
  `https://${host}/courses/sewing/`,
  `https://${host}/courses/trial/`,
];

async function loadUrls() {
  try {
    const res = await fetch(sitemapUrl);
    if (!res.ok) throw new Error(`sitemap ${res.status}`);
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
    if (urls.length > 0) return urls;
  } catch (error) {
    console.warn("sitemap fallback:", error instanceof Error ? error.message : error);
  }
  return fallbackUrls;
}

async function pingYandexSitemap() {
  const url = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  const res = await fetch(url);
  const text = (await res.text()).slice(0, 200);
  console.log(`yandex sitemap ping: ${res.status} ${text}`);
}

async function submitIndexNow(urls) {
  const body = JSON.stringify({ host, key, keyLocation, urlList: urls });
  const endpoints = ["https://yandex.com/indexnow", "https://api.indexnow.org/indexnow"];

  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body,
    });
    const text = (await res.text()).slice(0, 200);
    console.log(`indexnow ${endpoint}: ${res.status} ${text}`);
  }
}

const urls = await loadUrls();
console.log("urls", urls.length);
await pingYandexSitemap();
await submitIndexNow(urls);

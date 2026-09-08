import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "src/data/instagram-feed.json");

function pickImage(item) {
  const sizes = item.sizes || {};
  const behold =
    sizes.medium?.mediaUrl || sizes.large?.mediaUrl || sizes.small?.mediaUrl || "";
  if (behold) return behold;
  const type = String(item.mediaType || item.media_type || "").toUpperCase();
  if (type === "VIDEO" || type === "REELS") {
    return item.thumbnailUrl || item.thumbnail_url || item.mediaUrl || item.media_url || "";
  }
  return item.mediaUrl || item.media_url || item.thumbnailUrl || item.thumbnail_url || "";
}

function toPosts(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.posts)
      ? data.posts
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return list
    .map((item) => {
      const permalink = item.permalink || item.url || "";
      const imageUrl = pickImage(item);
      const type = String(item.mediaType || item.media_type || "").toUpperCase();
      if (!permalink || !imageUrl) return null;
      return {
        id: String(item.id || permalink),
        imageUrl,
        permalink,
        caption: String(item.caption || ""),
        isVideo: type === "VIDEO" || type === "REELS",
      };
    })
    .filter(Boolean)
    .slice(0, 6);
}

async function loadFeed() {
  const behold = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL || "https://feeds.behold.so/ZD2jrWRtGAxnQ1Ew6dO1";
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (behold) {
    const res = await fetch(behold);
    if (!res.ok) throw new Error(`Instagram feed ${res.status}`);
    return toPosts(await res.json());
  }

  if (token) {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,permalink,thumbnail_url",
    );
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram API ${res.status}`);
    return toPosts(await res.json());
  }

  return null;
}

try {
  const posts = await loadFeed();
  if (!posts) {
    console.log("Instagram feed skipped (no NEXT_PUBLIC_INSTAGRAM_FEED_URL or INSTAGRAM_ACCESS_TOKEN)");
    process.exit(0);
  }
  if (posts.length === 0) {
    console.log("Instagram feed returned no posts — keeping previous file");
    process.exit(0);
  }
  await writeFile(outFile, `${JSON.stringify({ posts }, null, 2)}\n`, "utf8");
  console.log(`Saved ${posts.length} Instagram posts`);
} catch (error) {
  console.warn("Instagram feed fetch failed:", error.message);
  process.exit(0);
}

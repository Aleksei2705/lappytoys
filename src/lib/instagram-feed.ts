export type InstagramPost = {
  id: string;
  imageUrl: string;
  permalink: string;
  caption: string;
  isVideo: boolean;
};

/** Posts Instagram still has, but Behold has not started returning yet. */
export const PINNED_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "DdB-wVnoztI",
    imageUrl: "/images/instagram/DdB-wVnoztI.jpg",
    permalink: "https://www.instagram.com/reel/DdB-wVnoztI/",
    caption: "Работа ученицы за год обучения",
    isVideo: true,
  },
];

function postKey(post: InstagramPost): string {
  const match = post.permalink.match(/\/(?:reel|p|tv)\/([^/?#]+)/i);
  return (match?.[1] || post.id).toLowerCase();
}

export function mergeInstagramPosts(
  live: InstagramPost[],
  pinned: InstagramPost[] = PINNED_INSTAGRAM_POSTS,
): InstagramPost[] {
  const seen = new Set<string>();
  const posts: InstagramPost[] = [];

  for (const post of [...pinned, ...live]) {
    const key = postKey(post);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    posts.push(post);
    if (posts.length >= 12) break;
  }

  return posts;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const rec = asRecord(data);
  if (!rec) return [];
  if (Array.isArray(rec.posts)) return rec.posts;
  if (Array.isArray(rec.data)) return rec.data;
  return [];
}

export function normalizeInstagramFeed(data: unknown): InstagramPost[] {
  const posts: InstagramPost[] = [];

  for (const item of pickList(data)) {
    const rec = asRecord(item);
    if (!rec) continue;

    const sizes = asRecord(rec.sizes);
    const medium = asRecord(sizes?.medium);
    const large = asRecord(sizes?.large);
    const mediaType = asString(rec.mediaType || rec.media_type).toUpperCase();
    const isVideo = mediaType === "VIDEO" || mediaType === "REELS";
    const imageUrl =
      asString(medium?.mediaUrl) ||
      asString(large?.mediaUrl) ||
      asString(rec.imageUrl) ||
      asString(rec.thumbnailUrl) ||
      asString(rec.thumbnail_url) ||
      asString(rec.mediaUrl) ||
      asString(rec.media_url);
    const permalink = asString(rec.permalink) || asString(rec.url);
    const id = asString(rec.id) || permalink || imageUrl;
    if (!imageUrl || !permalink) continue;

    posts.push({
      id,
      imageUrl,
      permalink,
      caption: asString(rec.caption),
      isVideo,
    });
    if (posts.length >= 12) break;
  }

  return posts;
}

export type InstagramPost = {
  id: string;
  imageUrl: string;
  permalink: string;
  caption: string;
  isVideo: boolean;
};

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
    if (posts.length >= 6) break;
  }

  return posts;
}

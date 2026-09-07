"use client";

import { useState } from "react";

type UserAvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
} as const;

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export function UserAvatar({ name, src, size = "md", className = "" }: UserAvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-800 ring-1 ring-brand-100 ${sizeClass[size]} ${className}`}
      aria-hidden={!name}
    >
      {showImage ? (
        // External Google avatars — plain img (static export, no optimizer domains needed)
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          className="size-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        initialsFromName(name)
      )}
    </span>
  );
}

/** Avatar URL from Supabase Auth user metadata (Google / providers). */
export function avatarUrlFromUser(user: {
  user_metadata?: Record<string, unknown> | null;
} | null | undefined) {
  if (!user?.user_metadata) return null;
  const meta = user.user_metadata;
  const raw =
    (meta.avatar_url as string | undefined) ||
    (meta.picture as string | undefined) ||
    null;
  return raw?.trim() || null;
}

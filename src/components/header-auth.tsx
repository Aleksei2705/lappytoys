"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LogIn, LogOut, User, UserPlus, X } from "lucide-react";
import { getSupabase, isReviewsEnabled, type User as AuthUser } from "@/lib/supabase";

type Mode = "login" | "register";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-.9 2.4-2 3.1l3.2 2.5c1.9-1.7 3-4.2 3-7.2 0-.7-.1-1.4-.2-2H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3 5.7 15l-2.7 2.1C4.6 20.5 8 22.5 12 22.5c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3z"
      />
      <path
        fill="#4A90E2"
        d="M3 7C2.4 8.1 2 9.5 2 11s.4 2.9 1 4c0 .1 3.6-2.8 3.6-2.8C6.2 11.3 6 10.2 6 10s.2-1.3.6-2.2L3 7z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.4 14.7 1.5 12 1.5 8 1.5 4.6 3.5 3 7l3.6 2.8C7 7.3 9.3 5.5 12 5.5z"
      />
    </svg>
  );
}

function displayName(user: AuthUser) {
  return (
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    "Профиль"
  );
}

function initial(user: AuthUser) {
  const name = displayName(user);
  return name.charAt(0).toUpperCase();
}

export function HeaderAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReviewsEnabled()) {
      setReady(true);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onOpenAuth() {
      setOpen(true);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-header-auth", onOpenAuth);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-header-auth", onOpenAuth);
    };
  }, []);

  if (!isReviewsEnabled() || !ready) {
    return null;
  }

  async function handleGoogle() {
    setMessage("");
    setStatus("loading");

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setMessage("Вход временно недоступен.");
      return;
    }

    const redirectTo = `${window.location.origin}/`;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setStatus("error");
        setMessage(error.message || "Не удалось открыть вход через Google.");
        return;
      }

      if (!data.url) {
        setStatus("error");
        setMessage("Google-вход не настроен в Supabase.");
        return;
      }

      window.location.assign(data.url);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Ошибка входа через Google.");
    }
  }

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setStatus("loading");

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setMessage("Регистрация временно недоступна.");
      return;
    }

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setStatus("error");
        const msg = error.message.toLowerCase();
        if (msg.includes("already") || msg.includes("registered")) {
          setMessage("Этот email уже зарегистрирован. Нажмите «Вход».");
        } else if (msg.includes("password")) {
          setMessage("Пароль слишком простой. Минимум 6 символов.");
        } else if (msg.includes("email")) {
          setMessage("Проверьте правильность email.");
        } else {
          setMessage(error.message);
        }
        return;
      }

      if (data.session) {
        setStatus("success");
        setMessage("Готово! Можно оставить отзыв.");
        setOpen(false);
        return;
      }

      setStatus("success");
      setMessage("Аккаунт создан. Подтвердите email из письма, затем войдите.");
      setMode("login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setStatus("error");
      const msg = error.message.toLowerCase();
      if (msg.includes("confirm") || msg.includes("not confirmed")) {
        setMessage("Сначала подтвердите email из письма, затем войдите.");
      } else if (msg.includes("invalid")) {
        setMessage("Неверный email или пароль.");
      } else {
        setMessage(error.message);
      }
      return;
    }

    setStatus("success");
    setMessage("");
    setOpen(false);
  }

  async function handleLogout() {
    const supabase = getSupabase();
    await supabase?.auth.signOut();
    setEmail("");
    setPassword("");
    setStatus("idle");
    setMessage("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      {user ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 max-w-[10rem] items-center gap-2 rounded-xl border border-cream-200 bg-white px-2.5 text-sm text-warm-700 transition-colors hover:border-brand-200 hover:text-brand-800"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
            {initial(user)}
          </span>
          <span className="truncate">{displayName(user)}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-secondary h-9 px-3 text-sm"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <User className="size-4" />
          <span className="hidden sm:inline">Войти</span>
        </button>
      )}

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(20.5rem,calc(100vw-1.5rem))] rounded-2xl border border-cream-200 bg-white p-4 shadow-xl">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-warm-500">Вы вошли как</p>
                  <p className="truncate text-sm font-medium text-warm-900">{displayName(user)}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-warm-500 hover:bg-cream-100"
                  aria-label="Закрыть"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </button>
              </div>
              <button type="button" onClick={handleLogout} className="btn-ghost h-10 w-full text-sm">
                <LogOut className="size-4" />
                Выйти
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-base font-semibold text-warm-900">Профиль</p>
                  <p className="mt-0.5 text-xs text-warm-500">Вход нужен, чтобы оставить отзыв</p>
                </div>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-warm-500 hover:bg-cream-100"
                  aria-label="Закрыть"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={status === "loading"}
                className="btn-secondary h-10 w-full border-brand-100 bg-white text-sm"
              >
                <GoogleIcon className="size-4" />
                {status === "loading" ? "Открываем Google..." : "Войти через Google"}
              </button>

              <div className="my-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-cream-200" />
                <span className="text-[10px] uppercase tracking-wider text-warm-500">или</span>
                <div className="h-px flex-1 bg-cream-200" />
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setStatus("idle");
                    setMessage("");
                  }}
                  className={`btn h-9 flex-1 px-2 text-xs ${
                    mode === "register" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <UserPlus className="size-3.5" />
                  Регистрация
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setStatus("idle");
                    setMessage("");
                  }}
                  className={`btn h-9 flex-1 px-2 text-xs ${
                    mode === "login" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <LogIn className="size-3.5" />
                  Вход
                </button>
              </div>

              <form className="mt-3 space-y-3" onSubmit={handleAuth}>
                <div>
                  <label htmlFor="header-auth-email" className="mb-1.5 block text-xs font-medium text-warm-700">
                    Email
                  </label>
                  <input
                    id="header-auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field h-10 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="header-auth-password"
                    className="mb-1.5 block text-xs font-medium text-warm-700"
                  >
                    Пароль
                  </label>
                  <input
                    id="header-auth-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    placeholder="Не менее 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field h-10 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary h-10 w-full text-sm"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Подождите..."
                    : mode === "register"
                      ? "Зарегистрироваться"
                      : "Войти"}
                </button>
              </form>

              {message ? (
                <p
                  className={`mt-3 text-center text-xs ${
                    status === "error" ? "text-red-600" : "text-brand-700"
                  }`}
                >
                  {message}
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

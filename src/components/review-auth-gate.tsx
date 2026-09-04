"use client";

import { FormEvent, useEffect, useState } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { getSupabase, isReviewsEnabled, type User } from "@/lib/supabase";
import { ReviewForm } from "@/components/review-form";

type Mode = "login" | "register";

type ReviewAuthGateProps = {
  onSubmitted?: () => void;
};

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

export function ReviewAuthGate({ onSubmitted }: ReviewAuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
      // After Google OAuth return, open reviews section
      if (data.session && typeof window !== "undefined") {
        const el = document.getElementById("reviews");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleGoogle() {
    setMessage("");
    setStatus("loading");

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setMessage("Вход временно недоступен.");
      return;
    }

    // Do not put #hash in redirectTo — OAuth tokens also use the URL hash.
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
        setMessage(
          "Google-вход не настроен в Supabase (Authentication → Providers → Google).",
        );
        return;
      }

      // Explicit navigation — more reliable than the client auto-redirect after await.
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
        setMessage("Готово! Теперь можно оставить отзыв.");
        return;
      }

      // Email confirmation enabled in Supabase
      setStatus("success");
      setMessage(
        "Аккаунт создан. Если включено подтверждение почты — откройте письмо от Supabase, затем войдите. Или в Supabase отключите Confirm email.",
      );
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
    setMessage("Вы вошли. Можно оставить отзыв.");
  }

  async function handleLogout() {
    const supabase = getSupabase();
    await supabase?.auth.signOut();
    setEmail("");
    setPassword("");
    setStatus("idle");
    setMessage("");
  }

  if (!ready) {
    return (
      <div className="card-soft mt-10 px-5 py-6 text-center text-sm text-warm-500 shadow-lg sm:px-7">
        Загрузка...
      </div>
    );
  }

  if (!isReviewsEnabled()) {
    return <ReviewForm onSubmitted={onSubmitted} />;
  }

  if (user) {
    const displayName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      user.email;

    return (
      <div className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100/80 bg-white/70 px-4 py-3 text-sm text-warm-600">
          <p>
            Вы вошли как <span className="font-medium text-warm-900">{displayName}</span>
          </p>
          <button type="button" onClick={handleLogout} className="btn-ghost h-9 px-3 text-xs">
            <LogOut className="size-3.5" />
            Выйти
          </button>
        </div>
        <ReviewForm onSubmitted={onSubmitted} />
      </div>
    );
  }

  return (
    <div className="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
      <h3 className="font-heading text-xl font-semibold text-warm-900">Оставить отзыв</h3>
      <p className="mt-2 text-sm leading-relaxed text-warm-500">
        Чтобы оставить отзыв, войдите через Google или зарегистрируйтесь по email.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={status === "loading"}
        className="btn-secondary mt-6 h-11 w-full border-brand-100 bg-white"
      >
        <GoogleIcon className="size-5" />
        {status === "loading" ? "Открываем Google..." : "Войти через Google"}
      </button>

      {message ? (
        <p
          className={`mt-3 text-center text-sm ${
            status === "error" ? "text-red-600" : "text-brand-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-cream-200" />
        <span className="text-xs uppercase tracking-wider text-warm-500">или</span>
        <div className="h-px flex-1 bg-cream-200" />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setStatus("idle");
            setMessage("");
          }}
          className={`btn h-10 flex-1 px-3 ${
            mode === "register" ? "btn-primary" : "btn-secondary"
          }`}
        >
          <UserPlus className="size-4" />
          Регистрация
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setStatus("idle");
            setMessage("");
          }}
          className={`btn h-10 flex-1 px-3 ${mode === "login" ? "btn-primary" : "btn-secondary"}`}
        >
          <LogIn className="size-4" />
          Вход
        </button>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleAuth}>
        <div>
          <label htmlFor="auth-email" className="mb-2 block text-sm font-medium text-warm-700">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="auth-password" className="mb-2 block text-sm font-medium text-warm-700">
            Пароль
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            placeholder="Не менее 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary h-11 w-full" disabled={status === "loading"}>
          {status === "loading"
            ? "Подождите..."
            : mode === "register"
              ? "Зарегистрироваться"
              : "Войти"}
        </button>
      </form>
    </div>
  );
}

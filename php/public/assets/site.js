(() => {
  "use strict";

  const header = document.querySelector("[data-site-header]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initHeaderShadow = () => {
    if (!header) return;
    const update = () => header.classList.toggle("scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  const initMobileMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.getElementById("mobile-nav");
    if (!toggle || !menu) return;

    const iconOpen = toggle.querySelector("[data-icon-open]");
    const iconClose = toggle.querySelector("[data-icon-close]");
    let scrollY = 0;

    const setOpen = (open) => {
      const body = document.body;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
      iconOpen.hidden = open;
      iconClose.hidden = !open;

      if (open) {
        scrollY = window.scrollY;
        body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%`;
      } else {
        body.style.cssText = "";
        window.scrollTo(0, scrollY);
      }
    };

    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.querySelectorAll("[data-menu-close]").forEach((node) =>
      node.addEventListener("click", (event) => {
        if (node.tagName === "A") {
          const url = new URL(node.href, location.href);
          const samePage = url.pathname === location.pathname;
          const target = url.hash && samePage ? document.getElementById(url.hash.slice(1)) : null;
          if (target) {
            event.preventDefault();
            setOpen(false);
            history.pushState(null, "", url.hash);
            requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
            return;
          }
        }
        setOpen(false);
      }),
    );
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !menu.hidden) setOpen(false);
    });
  };

  const initDesktopNav = () => {
    const wrap = document.querySelector("[data-nav-wrap]");
    const nav = document.querySelector("[data-nav]");
    if (!wrap || !nav) return;

    let velocity = 0;
    let hovering = false;
    let frame = 0;

    const maxScroll = () => Math.max(0, nav.scrollWidth - nav.clientWidth);

    const updateMore = () => {
      const overflow = maxScroll();
      wrap.classList.toggle("has-more-left", overflow > 8 && nav.scrollLeft > 8);
      wrap.classList.toggle("has-more-right", overflow > 8 && nav.scrollLeft < overflow - 8);
    };

    const setVelocityFromX = (clientX) => {
      if (maxScroll() <= 0) {
        velocity = 0;
        return;
      }
      const rect = nav.getBoundingClientRect();
      const x = (clientX - rect.left) / Math.max(1, rect.width);
      const edge = 0.34;
      if (x < edge) velocity = -18 * ((edge - x) / edge) ** 2;
      else if (x > 1 - edge) velocity = 18 * ((x - (1 - edge)) / edge) ** 2;
      else velocity = 0;
    };

    const tick = () => {
      frame = 0;
      if (!hovering || velocity === 0) return;
      const overflow = maxScroll();
      if (overflow > 0) {
        const next = nav.scrollLeft + (reduceMotion ? velocity * 3 : velocity);
        nav.scrollLeft = Math.min(overflow, Math.max(0, next));
        updateMore();
      }
      frame = requestAnimationFrame(tick);
    };

    nav.addEventListener("pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      hovering = true;
      setVelocityFromX(event.clientX);
      if (!frame) frame = requestAnimationFrame(tick);
    });
    nav.addEventListener("pointerleave", () => {
      hovering = false;
      velocity = 0;
    });
    nav.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        hovering = false;
        velocity = 0;
        nav.scrollLeft = Math.min(maxScroll(), Math.max(0, nav.scrollLeft + event.deltaY));
        updateMore();
        event.preventDefault();
      },
      { passive: false },
    );
    nav.addEventListener("scroll", updateMore, { passive: true });
    window.addEventListener("resize", updateMore);
    new ResizeObserver(updateMore).observe(nav);
    updateMore();
  };

  const initMetrikaInformer = () => {
    const root = document.querySelector("[data-metrika-informer]");
    if (!root) return;

    const pickToday = (value) => (Array.isArray(value) ? value[0] ?? null : (value ?? null));
    const format = (value) => (typeof value === "number" ? new Intl.NumberFormat("ru-RU").format(value) : "—");

    const apply = () => {
      const raw = window.yandex_metrika_json_informer;
      root.querySelectorAll("[data-informer-field]").forEach((node) => {
        node.textContent = format(raw ? pickToday(raw[node.dataset.informerField]) : null);
      });
    };

    const script = document.createElement("script");
    script.src = `https://informer.yandex.ru/informer/${root.dataset.metrikaInformer}/json`;
    script.async = true;
    script.onload = apply;
    script.onerror = apply;
    document.body.appendChild(script);
  };

  const initReveal = () => {
    const blocks = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      blocks.forEach((block) => block.classList.add("reveal-block-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-block-in");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    blocks.forEach((block) => observer.observe(block));
  };

  const initExpandable = () => {
    document.querySelectorAll("[data-expandable-toggle]").forEach((toggle) => {
      const scope = toggle.dataset.expandableScope
        ? document.querySelector(toggle.dataset.expandableScope)
        : toggle.closest("[data-expandable]");
      if (!scope) return;
      const collapsedLabel = toggle.querySelector("[data-label-collapsed]");
      const expandedLabel = toggle.querySelector("[data-label-expanded]");

      toggle.addEventListener("click", () => {
        const expand = toggle.getAttribute("aria-expanded") !== "true";
        scope.querySelectorAll("[data-expandable-extra]").forEach((node) => {
          node.hidden = !expand;
        });
        toggle.setAttribute("aria-expanded", String(expand));
        collapsedLabel?.classList.toggle("hidden", expand);
        collapsedLabel?.classList.toggle("inline-flex", !expand);
        expandedLabel?.classList.toggle("hidden", !expand);
        expandedLabel?.classList.toggle("inline-flex", expand);
      });
    });
  };

  const initMasterClasses = () => {
    const root = document.querySelector("[data-mc-carousel]");
    const scroller = root?.querySelector("[data-mc-scroller]");
    if (!root || !scroller) return;

    const slides = Array.from(scroller.querySelectorAll("[data-mc-slide]"));
    const dots = Array.from(root.querySelectorAll("[data-mc-dot]"));
    const indexLabel = root.querySelector("[data-mc-index]");
    const titleLabel = root.querySelector("[data-mc-title]");
    const count = slides.length;
    let index = 0;

    const render = (next) => {
      index = next;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle("translate-y-0", active);
        slide.classList.toggle("opacity-100", active);
        slide.classList.toggle("translate-y-1", !active);
        slide.classList.toggle("opacity-75", !active);
      });
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.setAttribute("aria-selected", String(active));
        ["w-8", "bg-brand-600"].forEach((name) => dot.classList.toggle(name, active));
        ["w-2", "bg-brand-200", "hover:bg-brand-300"].forEach((name) => dot.classList.toggle(name, !active));
      });
      if (indexLabel) indexLabel.textContent = String(index + 1);
      if (titleLabel) titleLabel.textContent = slides[index].dataset.title ?? "";
    };

    const goTo = (target) => {
      const bounded = ((target % count) + count) % count;
      render(bounded);
      slides[bounded].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };

    root.querySelector("[data-mc-prev]")?.addEventListener("click", () => goTo(index - 1));
    root.querySelector("[data-mc-next]")?.addEventListener("click", () => goTo(index + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

    scroller.addEventListener(
      "scroll",
      () => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDistance = Infinity;
        slides.forEach((slide, i) => {
          const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        if (best !== index) render(best);
      },
      { passive: true },
    );
  };

  const initRatingInput = () => {
    document.querySelectorAll("[data-review-form]").forEach((form) => {
      const input = form.querySelector("[data-rating-input]");
      const buttons = Array.from(form.querySelectorAll("[data-rating-value]"));
      if (!input) return;

      const render = (value) => {
        input.value = String(value);
        buttons.forEach((button) => {
          const active = Number(button.dataset.ratingValue) <= value;
          const star = button.querySelector("svg");
          star?.classList.toggle("fill-accent-400", active);
          star?.classList.toggle("text-accent-400", active);
          star?.classList.toggle("text-cream-200", !active);
          button.setAttribute("aria-pressed", String(Number(button.dataset.ratingValue) === value));
        });
      };
      buttons.forEach((button) => button.addEventListener("click", () => render(Number(button.dataset.ratingValue))));
    });
  };

  const initShare = () => {
    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-share]");
      if (!button) return;
      const { shareTitle, shareText, shareUrl, shareCopied } = button.dataset;

      try {
        if (navigator.share) {
          await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
          return;
        }
      } catch {
        // cancelled or unsupported: fall back to the clipboard
      }
      try {
        await navigator.clipboard.writeText(shareText);
        window.alert(shareCopied);
      } catch {
        // clipboard unavailable
      }
    });
  };

  const initHeroParallax = () => {
    const layer = document.querySelector("[data-hero-parallax]");
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!layer || reduceMotion || !desktop || !finePointer) return;

    const scale = 1.12;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let running = false;

    const tick = () => {
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      layer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${scale})`;
      if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    window.addEventListener(
      "mousemove",
      (event) => {
        target.x = (event.clientX / window.innerWidth - 0.5) * 2 * -18;
        target.y = (event.clientY / window.innerHeight - 0.5) * 2 * -12;
        if (!running) {
          running = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true },
    );
  };

  const initGoals = () => {
    const metricaId = Number(document.body.dataset.metricaId);
    document.addEventListener("click", (event) => {
      const element = event.target.closest("[data-goal]");
      if (!element || typeof window.ym !== "function") return;
      try {
        window.ym(metricaId, "reachGoal", element.dataset.goal);
      } catch {
        // analytics must never break navigation
      }
    });
  };

  const initBackLinks = () => {
    document.querySelectorAll("[data-back]").forEach((link) =>
      link.addEventListener("click", (event) => {
        if (window.history.length > 1 && document.referrer.startsWith(location.origin)) {
          event.preventDefault();
          window.history.back();
        }
      }),
    );
  };

  const interpretPhone = (raw) => {
    const trimmed = raw.trim();
    const startsPlus = trimmed.startsWith("+") || trimmed.startsWith("00");
    let digits = raw.replace(/\D/g, "");
    if (trimmed.startsWith("00") && digits.startsWith("00")) digits = digits.slice(2);
    if (!digits) return { digits: "", mode: startsPlus ? "intl" : "cis" };

    if (startsPlus && !digits.startsWith("7")) return { digits: digits.slice(0, 15), mode: "intl" };

    if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
    if (!digits.startsWith("7")) digits = `7${digits}`;
    return { digits: digits.slice(0, 11), mode: "cis" };
  };

  const formatPhone = (digits, mode) => {
    if (!digits) return mode === "intl" ? "+" : "";
    if (mode === "intl") {
      const chunks = [digits.slice(0, Math.min(3, digits.length))];
      for (let i = chunks[0].length; i < digits.length; i += 3) chunks.push(digits.slice(i, i + 3));
      return `+${chunks.join(" ")}`;
    }
    const rest = digits.startsWith("7") ? digits.slice(1) : digits;
    let out = "+7";
    if (!rest) return out;
    out += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) out += ")";
    if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
    if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
    return out;
  };

  const isValidPhone = (digits) => {
    if (/^7\d{10}$/.test(digits)) return true;
    if (digits.startsWith("7")) return false;
    return digits.length >= 10 && digits.length <= 15;
  };

  const initSignupForm = () => {
    const form = document.querySelector("[data-signup-form]");
    if (!form) return;

    const labels = JSON.parse(form.dataset.labels || "{}");
    const phoneInput = form.querySelector("[data-phone-input]");
    const phoneError = form.querySelector("[data-phone-error]");

    const setPhoneError = (message) => {
      phoneError.textContent = message;
      phoneError.classList.toggle("hidden", !message);
      phoneInput.setAttribute("aria-invalid", message ? "true" : "false");
    };

    phoneInput.addEventListener("input", () => {
      const parsed = interpretPhone(phoneInput.value);
      phoneInput.value = formatPhone(parsed.digits, parsed.mode);
      setPhoneError("");
    });

    form.addEventListener("submit", (event) => {
      if (!isValidPhone(interpretPhone(phoneInput.value).digits)) {
        event.preventDefault();
        setPhoneError(labels.phoneError);
        phoneInput.focus();
      }
    });

    const buildMessage = () => {
      const field = (name) => form.elements[name]?.value.trim() ?? "";
      const direction = form.querySelector("[data-direction]");
      const directionText = direction.selectedIndex > 0 ? direction.options[direction.selectedIndex].text : "";
      const optional = (label, value) => (value ? `${label} ${value}` : null);
      return [
        labels.hello,
        optional(labels.name, field("name")),
        optional(labels.phone, field("phone")),
        optional(labels.direction, directionText),
        optional(labels.date, field("preferredDate")),
        optional(labels.message, field("message")),
        "",
        labels.footer,
      ]
        .filter((line) => line !== null)
        .join("\n");
    };

    form.querySelectorAll("[data-direct]").forEach((button) =>
      button.addEventListener("click", () => {
        if (!form.reportValidity()) return;
        if (!isValidPhone(interpretPhone(phoneInput.value).digits)) {
          setPhoneError(labels.phoneError);
          phoneInput.focus();
          return;
        }
        const base = labels[button.dataset.direct];
        window.open(`${base}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener,noreferrer");
      }),
    );
  };

  const initMedia = () => {
    const lightbox = document.querySelector("[data-media-lightbox]");
    const stage = lightbox?.querySelector("[data-lightbox-stage]");
    const title = lightbox?.querySelector("[data-lightbox-title]");
    const closeButton = lightbox?.querySelector("[data-lightbox-close]");
    let activeSlides = [];
    let activeIndex = 0;

    const close = () => {
      if (!lightbox) return;
      lightbox.hidden = true;
      stage.replaceChildren();
      document.body.style.overflow = "";
    };

    const open = (slides, index) => {
      if (!lightbox || !stage || !title) return;
      activeSlides = slides;
      activeIndex = ((index % slides.length) + slides.length) % slides.length;
      const slide = slides[activeIndex];
      stage.replaceChildren();

      if (slide.dataset.lightboxImage) {
        const image = document.createElement("img");
        image.src = slide.dataset.lightboxImage;
        image.alt = slide.dataset.lightboxAlt || "";
        image.className = "max-h-full max-w-full object-contain";
        stage.append(image);
      } else if (slide.dataset.lightboxVideo) {
        const frame = document.createElement("iframe");
        frame.src = `https://www.youtube.com/embed/${slide.dataset.lightboxVideo}?rel=0&playsinline=1&modestbranding=1&autoplay=1`;
        frame.title = slide.dataset.title || "";
        frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.allowFullscreen = true;
        frame.className = "h-[min(75dvh,calc(100vw*16/9))] w-[min(calc(75dvh*9/16),90vw)] rounded-2xl border-0 bg-black shadow-2xl";
        stage.append(frame);
      }
      title.textContent = [slide.dataset.title, slide.dataset.category].filter(Boolean).join(" · ");
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeButton?.focus();
    };

    document.querySelectorAll("[data-media-carousel]").forEach((root) => {
      const scroller = root.querySelector("[data-carousel-scroller]");
      const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
      const dotsRoot = root.querySelector("[data-carousel-dots]");
      const indexLabel = root.querySelector("[data-carousel-index]");
      const titleLabel = root.querySelector("[data-carousel-title]");
      if (!scroller || !slides.length) return;
      let index = 0;

      const dots = slides.map((slide, slideIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "h-2 rounded-full transition-all duration-300";
        dot.setAttribute("aria-label", `${slideIndex + 1}: ${slide.dataset.title || ""}`);
        dot.addEventListener("click", () => goTo(slideIndex));
        dotsRoot?.append(dot);
        return dot;
      });

      const render = (next) => {
        index = next;
        dots.forEach((dot, i) => {
          dot.classList.toggle("w-7", i === index);
          dot.classList.toggle("bg-brand-600", i === index);
          dot.classList.toggle("w-2", i !== index);
          dot.classList.toggle("bg-brand-200", i !== index);
          if (i === index) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
        if (indexLabel) indexLabel.textContent = String(index + 1);
        if (titleLabel) titleLabel.textContent = slides[index].dataset.title || "";
      };

      const goTo = (next) => {
        const bounded = ((next % slides.length) + slides.length) % slides.length;
        render(bounded);
        const slide = slides[bounded];
        scroller.scrollTo({
          left: slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      };

      root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => goTo(index - 1));
      root.querySelector("[data-carousel-next]")?.addEventListener("click", () => goTo(index + 1));
      slides.forEach((slide, slideIndex) => slide.addEventListener("click", () => open(slides, slideIndex)));
      let frame = 0;
      scroller.addEventListener("scroll", () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const center = scroller.scrollLeft + scroller.clientWidth / 2;
          const next = slides.reduce(
            (best, slide, i) =>
              Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center) < best.distance
                ? { index: i, distance: Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center) }
                : best,
            { index: 0, distance: Infinity },
          ).index;
          if (next !== index) render(next);
        });
      }, { passive: true });
      render(0);
    });

    const stepLightbox = (direction) => activeSlides.length && open(activeSlides, activeIndex + direction);
    closeButton?.addEventListener("click", close);
    lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => stepLightbox(-1));
    lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => stepLightbox(1));
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target === stage) close();
    });
    document.addEventListener("keydown", (event) => {
      if (!lightbox || lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") stepLightbox(-1);
      if (event.key === "ArrowRight") stepLightbox(1);
    });

    document.querySelectorAll("[data-video-section]").forEach((root) => {
      const collapsed = root.querySelector("[data-video-collapsed]");
      const expanded = root.querySelector("[data-video-expanded]");
      root.querySelectorAll("[data-video-toggle]").forEach((button) =>
        button.addEventListener("click", () => {
          const show = expanded.hidden;
          expanded.hidden = !show;
          collapsed.hidden = show;
          button.setAttribute("aria-expanded", String(show));
          if (!show) close();
        }),
      );
    });
  };

  const initSocialEmbeds = () => {
    const load = (src, onload) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        onload?.();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onload;
      document.body.append(script);
    };
    if (document.querySelector(".instagram-media")) {
      load("https://www.instagram.com/embed.js", () => window.instgrm?.Embeds?.process?.());
    }
    const tiktok = document.querySelector(".tiktok-embed");
    if (!tiktok) return;
    const startTikTok = () => {
      const src = "https://www.tiktok.com/embed.js";
      if (document.querySelector(`script[src="${src}"]`)) return;
      load(src);
    };
    if (!("IntersectionObserver" in window)) {
      startTikTok();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      startTikTok();
    }, { rootMargin: "480px 0px" });
    observer.observe(tiktok);
  };

  initHeaderShadow();
  initMobileMenu();
  initSignupForm();
  initMedia();
  initSocialEmbeds();
  initDesktopNav();
  initMetrikaInformer();
  initReveal();
  initExpandable();
  initMasterClasses();
  initRatingInput();
  initShare();
  const initAssistant = () => {
    const root = document.querySelector("[data-assistant]");
    const dataNode = root?.querySelector("[data-assistant-data]");
    const panel = root?.querySelector("[data-assistant-panel]");
    const log = root?.querySelector("[data-assistant-log]");
    const form = root?.querySelector("[data-assistant-form]");
    const toggle = root?.querySelector("[data-assistant-toggle]");
    const nudge = root?.querySelector("[data-assistant-nudge]");
    if (!root || !dataNode || !panel || !log || !form || !toggle) return;
    const data = JSON.parse(dataNode.textContent || "{}");
    const input = form.querySelector("input");

    const avatar = () => {
      const image = document.createElement("img");
      image.className = "assistant-avatar";
      image.src = "/images/assistant-avatar.jpg";
      image.alt = "";
      image.width = 30;
      image.height = 30;
      return image;
    };

    const addMessage = (text, role, href, link) => {
      const item = document.createElement("p");
      item.className = `assistant-msg assistant-msg-${role}`;
      item.textContent = text;
      if (href && link) {
        const anchor = document.createElement("a");
        anchor.className = "assistant-link";
        anchor.href = href;
        anchor.textContent = link;
        if (/^https?:/i.test(href)) {
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
        }
        item.append(document.createElement("br"), anchor);
      }
      if (role === "user") {
        log.append(item);
      } else {
        const row = document.createElement("div");
        row.className = "assistant-row";
        row.append(avatar(), item);
        log.append(row);
      }
      log.scrollTop = log.scrollHeight;
    };

    const showTyping = () => {
      const bubble = document.createElement("p");
      bubble.className = "assistant-msg assistant-msg-bot";
      bubble.innerHTML = '<span class="assistant-typing" aria-hidden="true"><span></span><span></span><span></span></span>';
      const row = document.createElement("div");
      row.className = "assistant-row";
      row.append(avatar(), bubble);
      log.append(row);
      log.scrollTop = log.scrollHeight;
      return row;
    };

    const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

    const localAnswer = (question) => {
      const query = question.toLocaleLowerCase("ru").replaceAll("ё", "е");
      const match = (data.answers || []).find((answer) =>
        (answer.keys || []).some((key) => query.includes(String(key).toLocaleLowerCase("ru"))),
      );
      return {
        text: match?.text || data.fallback || "",
        href: match?.href || "",
        link: match?.link || "",
      };
    };

    const reply = async (question) => {
      const pending = showTyping();
      const started = performance.now();
      let answer = null;
      if (data.ai) {
        const history = Array.from(log.querySelectorAll(".assistant-msg"))
          .filter((node) => !node.querySelector(".assistant-typing"))
          .slice(0, -1)
          .slice(-6)
          .map((node) => ({
            role: node.classList.contains("assistant-msg-user") ? "user" : "assistant",
            text: node.childNodes[0]?.textContent || "",
          }));
        try {
          const response = await fetch("/assistant.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _csrf: data.csrf, q: question, history }),
          });
          const body = response.ok ? await response.json() : null;
          if (body?.text) answer = body;
        } catch {
          answer = null;
        }
      }
      const wait = 900 + Math.round(Math.random() * 700) - (performance.now() - started);
      if (wait > 0) await pause(wait);
      pending.remove();
      const ready = answer || localAnswer(question);
      addMessage(ready.text, "bot", ready.href, ready.link);
    };

    const ask = (question) => {
      const text = question.trim();
      if (!text) return;
      addMessage(text, "user");
      reply(text);
    };

    const setOpen = (open) => {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (nudge) nudge.hidden = true;
      if (open && !log.childElementCount) {
        const pending = showTyping();
        pause(800).then(() => {
          pending.remove();
          addMessage(data.greeting || "", "bot");
        });
      }
      if (open) {
        sessionStorage.setItem("lappy-assistant-opened", "1");
        input?.focus();
      }
    };

    if (nudge && sessionStorage.getItem("lappy-assistant-opened") !== "1") {
      window.setTimeout(() => {
        if (!panel.hidden || sessionStorage.getItem("lappy-assistant-opened") === "1") return;
        nudge.hidden = false;
      }, 50000);
      nudge.addEventListener("click", () => setOpen(true));
    }

    log.addEventListener("click", (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;
      const url = new URL(anchor.href, location.href);
      const samePage = url.pathname === location.pathname;
      const target = url.hash && samePage ? document.getElementById(url.hash.slice(1)) : null;
      setOpen(false);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", url.hash);
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    });

    toggle.addEventListener("click", () => setOpen(panel.hidden));
    root.querySelector("[data-assistant-close]")?.addEventListener("click", () => setOpen(false));
    root.querySelectorAll("[data-assistant-ask]").forEach((button) => {
      button.addEventListener("click", () => ask(button.getAttribute("data-assistant-ask") || ""));
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      ask(input?.value || "");
      if (input) input.value = "";
    });
  };

  initHeroParallax();
  initAssistant();
  initGoals();
  initBackLinks();
})();

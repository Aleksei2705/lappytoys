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
      node.addEventListener("click", () => {
        if (node.tagName === "A") {
          const hash = new URL(node.href, location.href).hash;
          setOpen(false);
          if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
          return;
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
    if (document.querySelector(".tiktok-embed")) {
      load("https://www.tiktok.com/embed.js", () => window.tiktokEmbed?.lib?.render?.());
    }
  };

  const initKnitScarf = () => {
    const canvas = document.querySelector("[data-knit-scarf]");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const crafts = [
      "/images/craft-scarf.png?v=1",
      "/images/craft-amigurumi.png?v=1",
      "/images/craft-embroidery.png?v=1",
      "/images/craft-macrame.png?v=1",
      "/images/craft-crochet-toy.png?v=1",
      "/images/craft-beads.png?v=1",
      "/images/craft-hat.png?v=1",
      "/images/craft-amigurumi-bunny.png?v=1",
      "/images/craft-crochet-bag.png?v=1",
      "/images/craft-embroidery-bird.png?v=1",
      "/images/craft-mittens.png?v=1",
      "/images/craft-macrame-hanger.png?v=1",
      "/images/craft-beads-bracelet.png?v=3",
      "/images/craft-sweater.png?v=1",
      "/images/craft-amigurumi-cat.png?v=1",
      "/images/craft-granny-blanket.png?v=1",
      "/images/craft-embroidery-leaves.png?v=1",
      "/images/craft-socks.png?v=1",
      "/images/craft-macrame-bag.png?v=1",
      "/images/craft-beads-pendant.png?v=1",
      "/images/craft-amigurumi-fox.png?v=1",
      "/images/craft-booties.png?v=1",
      "/images/craft-crochet-flower.png?v=1",
      "/images/craft-headband.png?v=1",
    ];

    const needleSprite = new Image();
    needleSprite.src = "/images/knit-needle.png?v=2";
    let needleReady = false;
    needleSprite.decode().then(() => {
      needleReady = true;
    }).catch(() => {
      needleReady = needleSprite.naturalWidth > 0;
    });

    const craftImgs = crafts.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    let craftsReady = 0;
    craftImgs.forEach((img) => {
      img.decode().then(() => {
        craftsReady += 1;
      }).catch(() => {
        if (img.naturalWidth > 0) craftsReady += 1;
      });
    });

    let dpr = 1;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let last = performance.now();
    let travel = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const hypot = (x, y) => Math.sqrt(x * x + y * y);

    const contentBand = () => {
      const pad = width < 640 ? 16 : 24;
      const inner = Math.min(width, 1280);
      const x0 = (width - inner) / 2 + pad;
      const x1 = (width + inner) / 2 - pad;
      return { x0, bandW: Math.max(1, x1 - x0) };
    };

    const workPoint = () => {
      const { x0 } = contentBand();
      if (width < 768) return { x: x0 + 4, y: 24 };
      return { x: x0 + 54, y: 46 };
    };

    const drawNeedle = (tipX, tipY, nearX, nearY) => {
      if (!needleReady) return;
      const dx = nearX - tipX;
      const dy = nearY - tipY;
      const len = hypot(dx, dy) || 1;
      const aspect = needleSprite.naturalHeight / needleSprite.naturalWidth;
      const h = Math.max(9, len * aspect * 1.05);
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(Math.atan2(dy, dx));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(needleSprite, 0, -h / 2, len, h);
      ctx.restore();
    };

    const withYarn = (widthY, draw) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(110, 62, 72, 0.45)";
      ctx.lineWidth = widthY + 2;
      draw();
      ctx.stroke();
      ctx.strokeStyle = "#c48b8f";
      ctx.lineWidth = widthY;
      draw();
      ctx.stroke();
      ctx.strokeStyle = "rgba(236, 214, 214, 0.65)";
      ctx.lineWidth = Math.max(0.8, widthY * 0.28);
      draw();
      ctx.stroke();
    };

    const drawHeldLoops = (tipX, tipY, nearX, nearY, pump, pass) => {
      const dx = nearX - tipX;
      const dy = nearY - tipY;
      for (let i = 0; i < 5; i += 1) {
        const u = 0.04 + i * 0.05;
        const x = tipX + dx * u;
        const y = tipY + dy * u;
        const rx = 3.6 + (4 - i) * 0.18;
        const ry = 5.8 + pump * 0.7;
        const rot = Math.atan2(dy, dx) + Math.PI * 0.5;
        withYarn(1.4, () => {
          ctx.beginPath();
          if (pass === "back") ctx.ellipse(x, y, rx, ry, rot, Math.PI, 0, true);
          else ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI, false);
        });
      }
    };

    const craftLayout = () => {
      const itemH = width < 768 ? 31 : 43;
      const gap = width < 768 ? 14 : 20;
      const items = craftImgs.map((img) => {
        const nw = img.naturalWidth || 1;
        const nh = img.naturalHeight || 1;
        return { img, w: (nw / nh) * itemH, h: itemH };
      });
      const loopW = items.reduce((sum, item) => sum + item.w + gap, 0);
      return { items, gap, loopW, itemH };
    };

    const drawCrafts = (oy) => {
      if (craftsReady < craftImgs.length) return;
      const { items, gap, loopW, itemH } = craftLayout();
      if (loopW <= 0) return;
      const { x0, bandW } = contentBand();
      const firstW = items[0] ? items[0].w : 0;
      const destX = x0;
      const destY = oy - itemH * 0.28;
      const destW = bandW;
      const shift = ((travel % loopW) + loopW) % loopW;
      const fadeW = width < 768 ? 96 : 120;
      const zoneStart = destX + destW * 0.52;
      const maxScale = width < 768 ? 2.2 : 2.5;
      const maxDrop = width < 768 ? 62 : 96;
      const bandH = itemH * maxScale + maxDrop + 20;

      ctx.save();
      ctx.beginPath();
      ctx.rect(destX, destY - 8, destW, bandH);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      let x = destX - firstW + shift - loopW;
      while (x < destX + destW + itemH * maxScale) {
        for (const item of items) {
          const shown = x + item.w - destX;
          if (shown > 0 && x < destX + destW) {
            const mid = x + item.w * 0.5;
            const raw = (mid - zoneStart) / Math.max(80, destW - zoneStart);
            const u = Math.min(1, Math.max(0, raw));
            const p = u * u * (3 - 2 * u);
            const scale = 1 + p * (maxScale - 1);
            const t = Math.min(1, Math.max(0, shown / Math.max(90, item.w * 2)));
            const fade = t * t * (3 - 2 * t);
            ctx.globalAlpha = fade;
            ctx.drawImage(item.img, x, destY + p * maxDrop, item.w * scale, item.h * scale);
            ctx.globalAlpha = 1;
          }
          x += item.w + gap;
        }
      }

      const veil = ctx.createLinearGradient(destX, 0, destX + fadeW, 0);
      veil.addColorStop(0, "rgba(0,0,0,0)");
      veil.addColorStop(0.4, "rgba(0,0,0,0.2)");
      veil.addColorStop(0.75, "rgba(0,0,0,0.7)");
      veil.addColorStop(1, "rgba(0,0,0,1)");
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = veil;
      ctx.fillRect(destX, destY - 8, destW, bandH);
      ctx.restore();
    };

    const tick = (now) => {
      if (!running) return;
      const dt = Math.min(32, now - last);
      last = now;
      if (craftsReady >= craftImgs.length) travel += dt * 0.016;
      ctx.clearRect(0, 0, width, height);
      const { x, y } = workPoint();
      const pump = Math.sin((now / 420) * Math.PI);
      const mobile = width < 768;
      const n1x = x - (mobile ? 16 : 30) - pump * (mobile ? 2 : 3);
      const n1y = y + (mobile ? 28 : 46) + pump * (mobile ? 1.6 : 2.5);
      const n2x = x + (mobile ? 7 : 9) + pump * (mobile ? 2 : 3);
      const n2y = y + (mobile ? 34 : 54) - pump * (mobile ? 1.4 : 2);
      ctx.save();
      ctx.globalAlpha = 0.94;
      drawCrafts(y);
      drawHeldLoops(x, y, n2x, n2y, pump, "back");
      drawNeedle(x, y, n1x, n1y);
      drawNeedle(x, y, n2x, n2y);
      drawHeldLoops(x, y, n2x, n2y, pump, "front");
      ctx.restore();
      frame = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      running = true;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (!motion.matches) return;
      running = false;
      window.cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
    };

    resize();
    frame = window.requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotionChange);
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
  initHeroParallax();
  initKnitScarf();
  initGoals();
  initBackLinks();
})();

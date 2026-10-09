(() => {
  const nav = document.querySelector("[data-admin-nav]");
  const current = nav?.querySelector("[aria-current='page']");
  if (nav && current && nav.scrollWidth > nav.clientWidth + 8) {
    nav.scrollLeft = current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2;
  }

  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      button.setAttribute("aria-pressed", String(reveal));
      button.setAttribute("aria-label", reveal ? "Скрыть пароль" : "Показать пароль");
      const openEye = button.querySelector("[data-eye-show]");
      const closedEye = button.querySelector("[data-eye-hide]");
      if (openEye) openEye.hidden = reveal;
      if (closedEye) closedEye.hidden = !reveal;
    });
  });

  document.addEventListener("submit", (event) => {
    const message = event.target.dataset?.confirm;
    if (message && !window.confirm(message)) event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-confirm-click]");
    if (button && !window.confirm(button.dataset.confirmClick)) event.preventDefault();
  });

  document.querySelectorAll("[data-chat-bulk]").forEach((form) => {
    const all = form.querySelector("[data-chat-all]");
    const picks = Array.from(form.querySelectorAll("[data-chat-pick]"));
    const remove = form.querySelector("[data-chat-delete]");
    const sync = () => {
      const chosen = picks.filter((box) => box.checked).length;
      if (remove) remove.disabled = chosen === 0;
      if (all) all.checked = chosen > 0 && chosen === picks.length;
    };
    all?.addEventListener("change", () => {
      picks.forEach((box) => {
        box.checked = all.checked;
      });
      sync();
    });
    picks.forEach((box) => box.addEventListener("change", sync));
    form.addEventListener("submit", (event) => {
      const chosen = picks.filter((box) => box.checked).length;
      if (chosen === 0 || !window.confirm(`Удалить выбранные разговоры (${chosen}) безвозвратно?`)) {
        event.preventDefault();
      }
    });
  });

  document.querySelectorAll("[data-autosubmit]").forEach((element) =>
    element.addEventListener("change", () => element.form?.submit()),
  );

  document.querySelectorAll("[data-image-input]").forEach((input) =>
    input.addEventListener("change", () => {
      const preview = document.querySelector(input.dataset.imageInput);
      const file = input.files?.[0];
      if (!preview || !file) return;
      preview.src = URL.createObjectURL(file);
      preview.classList.remove("hidden");
    }),
  );

  const tabOn = ["bg-brand-100", "text-brand-800"];
  const tabOff = ["text-warm-700"];

  document.querySelectorAll("[data-admin-tabs]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-tab]")];
    const panels = [...root.querySelectorAll("[data-panel]")];
    const show = (name) => {
      buttons.forEach((button) => {
        const active = button.dataset.tab === name;
        button.setAttribute("aria-selected", String(active));
        button.classList.remove(...tabOn, ...tabOff);
        button.classList.add(...(active ? tabOn : tabOff));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== name;
      });
    };
    buttons.forEach((button) => button.addEventListener("click", () => show(button.dataset.tab)));
    show(buttons.find((button) => button.getAttribute("aria-selected") === "true")?.dataset.tab || buttons[0]?.dataset.tab);
  });

  document.querySelectorAll("[data-locale-switch]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-locale]")];
    const apply = (locale) => {
      buttons.forEach((button) => {
        const active = button.dataset.locale === locale;
        button.setAttribute("aria-pressed", String(active));
        button.classList.remove(...tabOn, ...tabOff);
        button.classList.add(...(active ? tabOn : tabOff));
      });
      document.querySelectorAll("[data-locale-field]").forEach((field) => {
        field.hidden = field.dataset.localeField !== locale;
      });
    };
    buttons.forEach((button) => button.addEventListener("click", () => apply(button.dataset.locale)));
    apply("ru");
  });

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("invalid", (event) => {
      const field = event.target;
      const panel = field.closest?.("[data-panel]");
      if (panel) {
        const tabs = panel.closest("[data-admin-tabs]");
        tabs?.querySelector(`[data-tab="${panel.dataset.panel}"]`)?.click();
      }
      const localeField = field.closest?.("[data-locale-field]");
      if (localeField) {
        document.querySelector(`[data-locale-switch] [data-locale="${localeField.dataset.localeField}"]`)?.click();
      }
    }, true);
  });

  document.querySelectorAll("[data-add-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const template = document.querySelector(button.dataset.addTemplate);
      const list = document.querySelector(button.dataset.addRow);
      if (!template || !list) return;
      list.append(template.content.cloneNode(true));
    });
  });

  document.addEventListener("click", (event) => {
    const remove = event.target.closest?.("[data-remove-row]");
    if (remove) {
      remove.closest("[data-row]")?.remove();
      return;
    }
    const move = event.target.closest?.("[data-move]");
    if (!move) return;
    const row = move.closest("[data-row]");
    if (!row) return;
    if (move.dataset.move === "up" && row.previousElementSibling) row.previousElementSibling.before(row);
    if (move.dataset.move === "down" && row.nextElementSibling) row.nextElementSibling.after(row);
  });
})();

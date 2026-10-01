(() => {
  document.addEventListener("submit", (event) => {
    const message = event.target.dataset?.confirm;
    if (message && !window.confirm(message)) event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-confirm-click]");
    if (button && !window.confirm(button.dataset.confirmClick)) event.preventDefault();
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
})();

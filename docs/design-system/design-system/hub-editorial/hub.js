(() => {
  "use strict";

  const root = document.documentElement;
  const themeButtons = document.querySelectorAll("[data-he-theme-toggle]");
  const renderTheme = () => {
    const dark = root.dataset.heTheme === "dark";
    themeButtons.forEach((button) => {
      button.textContent = dark ? "Tema claro" : "Tema escuro";
      button.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
      button.setAttribute("aria-pressed", String(dark));
      button.hidden = false;
    });
  };
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.heTheme = root.dataset.heTheme === "dark" ? "light" : "dark";
      renderTheme();
    });
  });
  renderTheme();

  document.querySelectorAll("[data-he-header]").forEach((header) => {
    const toggle = header.querySelector("[data-he-menu-toggle]");
    const navId = toggle?.getAttribute("aria-controls");
    const nav = navId ? document.getElementById(navId) : null;
    if (!(toggle instanceof HTMLButtonElement) || !(nav instanceof HTMLElement)) {
      throw new Error("Hub Editorial: the menu requires a button and its aria-controls navigation.");
    }
    const mobile = window.matchMedia("(max-width: 1080px)");
    const setOpen = (open) => {
      nav.hidden = mobile.matches && !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Fechar" : "Menu";
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    const updateLayout = () => {
      const restoreFocus = mobile.matches && nav.contains(document.activeElement);
      toggle.hidden = !mobile.matches;
      setOpen(!mobile.matches);
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    header.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobile.matches && !nav.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a") && mobile.matches) {
        setOpen(false);
      }
    });
    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !header.contains(event.target) && mobile.matches && !nav.hidden) {
        setOpen(false);
      }
    });
    mobile.addEventListener("change", updateLayout);
    updateLayout();
  });

  const normalize = (value) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
  document.querySelectorAll("[data-he-catalog]").forEach((catalog) => {
    const search = catalog.querySelector("[data-he-search]");
    const filters = catalog.querySelectorAll("[data-he-filter]");
    const cards = catalog.querySelectorAll("[data-he-category]");
    const count = catalog.querySelector("[data-he-count]");
    const empty = catalog.querySelector("[data-he-empty]");
    const clear = catalog.querySelector("[data-he-clear]");
    const controls = catalog.querySelector("[data-he-catalog-controls]");
    if (!(search instanceof HTMLInputElement) || !count || !empty || !clear || !controls) {
      throw new Error("Hub Editorial: the catalog is missing its search, controls or result messages.");
    }
    let category = "all";
    const filter = () => {
      let visible = 0;
      const query = normalize(search.value);
      cards.forEach((card) => {
        const matches = (category === "all" || card.dataset.heCategory === category)
          && normalize(card.textContent ?? "").includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.heFilter === category)));
      count.textContent = `${visible} de ${cards.length} exemplos visíveis.`;
      empty.hidden = visible !== 0;
    };
    search.addEventListener("input", filter);
    filters.forEach((button) => button.addEventListener("click", () => {
      category = button.dataset.heFilter;
      filter();
    }));
    clear.addEventListener("click", () => {
      search.value = "";
      category = "all";
      filter();
      search.focus();
    });
    controls.hidden = false;
    filter();
  });

  document.querySelectorAll("[data-he-demo-form]").forEach((form) => {
    const fieldset = form.querySelector("fieldset");
    const email = form.querySelector("[data-he-demo-email]");
    const error = form.querySelector("[data-he-demo-error]");
    const status = form.querySelector("[data-he-demo-status]");
    if (!(form instanceof HTMLFormElement) || !(fieldset instanceof HTMLFieldSetElement)
      || !(email instanceof HTMLInputElement) || !error || !status) {
      throw new Error("Hub Editorial: the demo form requires an email field and feedback elements.");
    }
    const clearFeedback = () => {
      email.removeAttribute("aria-invalid");
      error.hidden = true;
      error.textContent = "";
      status.textContent = "";
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFeedback();
      if (!email.validity.valid) {
        error.textContent = email.validity.valueMissing
          ? "Erro: preencha o email para testar a validação."
          : "Erro: informe um email no formato nome@exemplo.com.";
        error.hidden = false;
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
      }
      status.textContent = "Formato validado. Demonstração local: nenhum email foi enviado ou salvo.";
    });
    form.addEventListener("reset", clearFeedback);
    email.addEventListener("input", clearFeedback);
    form.noValidate = true;
    fieldset.disabled = false;
  });

  document.querySelectorAll("[data-he-select]").forEach((button) => {
    const field = document.getElementById(button.dataset.heSelect);
    if (!(field instanceof HTMLTextAreaElement)) {
      throw new Error("Hub Editorial: the select button requires a textarea target.");
    }
    button.addEventListener("click", () => {
      field.focus();
      field.select();
    });
    button.hidden = false;
  });
})();

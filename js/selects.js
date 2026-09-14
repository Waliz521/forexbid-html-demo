(function () {
  const CHEVRON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function closeAll(except) {
    document.querySelectorAll(".fx-select.is-open").forEach((el) => {
      if (el === except) return;
      el.classList.remove("is-open");
      const menu = el.querySelector(".fx-select-menu");
      const btn = el.querySelector(".fx-select-btn");
      if (menu) {
        menu.hidden = true;
        menu.classList.remove("is-up");
      }
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function enhance(select) {
    if (select.dataset.fxbSelect === "on" || select.multiple) return;
    select.dataset.fxbSelect = "on";

    const wrap = document.createElement("div");
    wrap.className = "fx-select";
    if (select.closest(".currency-select")) wrap.classList.add("is-compact");
    if (select.closest(".bids-sort")) wrap.classList.add("is-inline");
    if (select.classList.contains("tc-input")) wrap.classList.add("is-soft");
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fx-select-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    if (select.getAttribute("aria-label")) btn.setAttribute("aria-label", select.getAttribute("aria-label"));
    btn.innerHTML = "<span></span>" + CHEVRON;

    const menu = document.createElement("div");
    menu.className = "fx-select-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    wrap.appendChild(btn);
    wrap.appendChild(menu);

    function label() {
      const opt = select.options[select.selectedIndex];
      return opt ? opt.textContent : "";
    }

    function renderMenu() {
      menu.replaceChildren();
      Array.from(select.options).forEach((opt) => {
        const item = document.createElement("button");
        item.type = "button";
        item.setAttribute("role", "option");
        item.dataset.value = opt.value;
        item.textContent = opt.textContent;
        if (opt.selected) item.classList.add("is-on");
        if (opt.disabled) item.disabled = true;
        menu.appendChild(item);
      });
    }

    function sync() {
      btn.querySelector("span").textContent = label();
      menu.querySelectorAll("[role='option']").forEach((el) => {
        el.classList.toggle("is-on", el.dataset.value === select.value);
      });
    }

    function place() {
      const rect = btn.getBoundingClientRect();
      const minW = wrap.classList.contains("is-compact") ? 140 : wrap.classList.contains("is-inline") ? 180 : rect.width;
      const width = Math.min(Math.max(rect.width, minW), window.innerWidth - 24);
      let left = wrap.classList.contains("is-inline") ? rect.right - width : rect.left;
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
      const spaceBelow = window.innerHeight - rect.bottom;
      const up = spaceBelow < 220 && rect.top > spaceBelow;
      menu.style.position = "fixed";
      menu.style.width = width + "px";
      menu.style.left = left + "px";
      menu.style.right = "auto";
      if (up) {
        menu.style.top = "auto";
        menu.style.bottom = window.innerHeight - rect.top + 6 + "px";
      } else {
        menu.style.top = rect.bottom + 6 + "px";
        menu.style.bottom = "auto";
      }
    }

    function open() {
      closeAll(wrap);
      renderMenu();
      sync();
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      wrap.classList.add("is-open");
      place();
    }

    function close() {
      menu.hidden = true;
      menu.classList.remove("is-up");
      btn.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (select.disabled) return;
      if (menu.hidden) open();
      else close();
    });

    menu.addEventListener("click", (e) => {
      const item = e.target.closest("[role='option']");
      if (!item || item.disabled) return;
      select.value = item.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
      close();
    });

    select.addEventListener("change", sync);
    new MutationObserver(() => {
      renderMenu();
      sync();
    }).observe(select, { childList: true, subtree: true, characterData: true });

    renderMenu();
    sync();
  }

  function scan() {
    document.querySelectorAll("select").forEach(enhance);
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".fx-select")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
  window.addEventListener("scroll", () => closeAll(), true);
  window.addEventListener("resize", () => closeAll());

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
})();

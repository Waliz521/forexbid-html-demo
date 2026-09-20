(function () {
  const CAL =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const CHEV =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toISO(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseDate(value) {
    if (!value) return null;
    const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    const t = Date.parse(String(value).replace(",", " "));
    return Number.isNaN(t) ? null : new Date(t);
  }

  function pretty(d) {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  function closeAll(except) {
    document.querySelectorAll(".fx-date.is-open").forEach((el) => {
      if (el === except) return;
      el.classList.remove("is-open");
      const pop = el.querySelector(".fx-date-pop");
      const btn = el.querySelector(".fx-date-btn");
      if (pop) pop.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function enhance(input) {
    if (input.dataset.fxbDate === "on" || input.type !== "date") return;
    input.dataset.fxbDate = "on";

    const parsed = parseDate(input.value);
    if (parsed && !/^\d{4}-\d{2}-\d{2}$/.test(input.value)) input.value = toISO(parsed);

    const wrap = document.createElement("div");
    wrap.className = "fx-date";
    if (input.classList.contains("tc-input")) wrap.classList.add("is-soft");
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fx-date-btn";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    if (input.id) btn.setAttribute("aria-controls", input.id + "-cal");
    btn.innerHTML = "<span></span>" + CAL;

    const pop = document.createElement("div");
    pop.className = "fx-date-pop";
    pop.id = input.id ? input.id + "-cal" : "";
    pop.hidden = true;

    wrap.appendChild(btn);
    wrap.appendChild(pop);

    let view = parseDate(input.value) || new Date();

    function label() {
      const d = parseDate(input.value);
      return d ? pretty(d) : "Select date";
    }

    function sync() {
      const span = btn.querySelector("span");
      span.textContent = label();
      span.classList.toggle("is-empty", !input.value);
    }

    function place() {
      const rect = btn.getBoundingClientRect();
      const width = Math.min(308, window.innerWidth - 24);
      let left = rect.left;
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
      const spaceBelow = window.innerHeight - rect.bottom;
      pop.style.position = "fixed";
      pop.style.width = width + "px";
      pop.style.left = left + "px";
      pop.style.right = "auto";
      if (spaceBelow < 360 && rect.top > spaceBelow) {
        pop.style.top = "auto";
        pop.style.bottom = window.innerHeight - rect.top + 6 + "px";
      } else {
        pop.style.top = rect.bottom + 6 + "px";
        pop.style.bottom = "auto";
      }
    }

    function setValue(iso) {
      input.value = iso || "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    }

    function render() {
      const y = view.getFullYear();
      const m = view.getMonth();
      const first = new Date(y, m, 1);
      const start = (first.getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      const selected = parseDate(input.value);
      const today = new Date();
      const todayISO = toISO(today);

      let cells = "";
      for (let i = 0; i < start; i++) {
        const d = new Date(y, m, i - start + 1);
        cells += dayBtn(d, true, selected, todayISO);
      }
      for (let day = 1; day <= days; day++) {
        cells += dayBtn(new Date(y, m, day), false, selected, todayISO);
      }
      const leftover = (7 - ((start + days) % 7)) % 7;
      for (let i = 1; i <= leftover; i++) {
        cells += dayBtn(new Date(y, m + 1, i), true, selected, todayISO);
      }

      pop.innerHTML =
        '<div class="fx-date-head">' +
        '<button type="button" class="fx-date-nav" data-nav="y-1" aria-label="Previous year">' + CHEV + CHEV + "</button>" +
        '<button type="button" class="fx-date-nav" data-nav="m-1" aria-label="Previous month">' + CHEV + "</button>" +
        '<span class="fx-date-title">' + MONTHS[m] + " " + y + "</span>" +
        '<button type="button" class="fx-date-nav is-next" data-nav="m1" aria-label="Next month">' + CHEV + "</button>" +
        '<button type="button" class="fx-date-nav is-next" data-nav="y1" aria-label="Next year">' + CHEV + CHEV + "</button>" +
        "</div>" +
        '<div class="fx-date-dows">' + DOW.map((d) => "<span>" + d + "</span>").join("") + "</div>" +
        '<div class="fx-date-grid">' + cells + "</div>" +
        '<div class="fx-date-foot">' +
        '<button type="button" data-act="clear">Clear</button>' +
        '<button type="button" data-act="today">Today</button>' +
        "</div>";
    }

    function dayBtn(d, muted, selected, todayISO) {
      const iso = toISO(d);
      const cls = [
        muted ? "is-muted" : "",
        selected && toISO(selected) === iso ? "is-on" : "",
        todayISO === iso ? "is-today" : ""
      ].filter(Boolean).join(" ");
      return '<button type="button" class="' + cls + '" data-day="' + iso + '">' + d.getDate() + "</button>";
    }

    function open() {
      closeAll(wrap);
      view = parseDate(input.value) || new Date();
      render();
      pop.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      wrap.classList.add("is-open");
      place();
    }

    function close() {
      pop.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (input.disabled) return;
      if (pop.hidden) open();
      else close();
    });

    pop.addEventListener("click", (e) => {
      e.stopPropagation();
      const nav = e.target.closest("[data-nav]");
      if (nav) {
        const map = { "y-1": [ -1, 0 ], y1: [ 1, 0 ], "m-1": [ 0, -1 ], m1: [ 0, 1 ] };
        const step = map[nav.dataset.nav];
        if (step) view = new Date(view.getFullYear() + step[0], view.getMonth() + step[1], 1);
        render();
        return;
      }
      const day = e.target.closest("[data-day]");
      if (day) {
        setValue(day.dataset.day);
        close();
        return;
      }
      const act = e.target.closest("[data-act]");
      if (!act) return;
      if (act.dataset.act === "clear") setValue("");
      if (act.dataset.act === "today") setValue(toISO(new Date()));
      close();
    });

    input.addEventListener("change", sync);
    input.addEventListener("input", sync);
    sync();
    if (input.dataset.open === "1") open();
  }

  function scan() {
    document.querySelectorAll('input[type="date"]').forEach(enhance);
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".fx-date")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
  window.addEventListener("scroll", () => closeAll(), true);
  window.addEventListener("resize", () => closeAll());

  window.fxbDates = { scan: scan, parse: parseDate, iso: toISO, pretty: pretty };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
})();

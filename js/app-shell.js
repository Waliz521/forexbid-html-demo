(function () {
  function ico(path) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  const ICONS = {
    house: ico("M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"),
    list: ico("M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"),
    briefcase: ico("M8 7V6a2 2 0 012-2h4a2 2 0 012 2v1M4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"),
    globe: ico("M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 3 3.5 6 3.5 9s-1 6-3.5 9c-2.5-3-3.5-6-3.5-9S9.5 6 12 3z"),
    file: ico("M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5"),
    info: ico("M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01"),
    settings: ico("M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"),
    search: ico("M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3"),
    bell: ico("M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 004 0"),
    panel: ico("M15 6l-6 6 6 6"),
    menu: ico("M4 7h16M4 12h16M4 17h16"),
    out: ico("M10 7V5a2 2 0 012-2h7v18h-7a2 2 0 01-2-2v-2M4 12h11M8 8l-4 4 4 4")
  };

  const NAV = [
    { id: "dashboard", href: "dashboard.html", label: "Dashboard", icon: "house" },
    { id: "requests", href: "requests.html", label: "Requests", icon: "list" },
    { id: "deals", href: "deals.html", label: "Deals", icon: "briefcase" },
    { id: "currencies", href: "currencies.html", label: "Trading Currencies", icon: "globe" },
    { id: "statements", href: "statements.html", label: "Statements", icon: "file" }
  ];

  const SEC = [
    { id: "help", href: "index.html#contact", label: "Help & Support", icon: "info" },
    { id: "settings", href: "profile.html", label: "Settings", icon: "settings" },
    { id: "signout", href: "index.html", label: "Sign Out", icon: "out" }
  ];

  function navItem(item, active) {
    return `<a class="app-nav-item${active === item.id ? " is-active" : ""}" href="${item.href}" title="${item.label}">${ICONS[item.icon]}<span>${item.label}</span></a>`;
  }

  function sidebarHTML(active) {
    return `
      <aside class="app-sidebar" id="app-sidebar">
        <div>
          <div class="app-sidebar-brand">
            <a class="app-sidebar-logo" href="dashboard.html">
              <img src="assets/logo-dark.jpg" alt="ForexBID">
            </a>
            <button class="app-icon-btn app-sidebar-fold" type="button" data-toggle-sidebar aria-label="Collapse menu">${ICONS.panel}</button>
          </div>
          <nav class="app-sidenav" aria-label="Main">${NAV.map((n) => navItem(n, active)).join("")}</nav>
        </div>
        <nav class="app-sidenav" aria-label="Secondary">${SEC.map((n) => navItem(n, active)).join("")}</nav>
      </aside>
      <div class="app-sidebar-backdrop" data-toggle-sidebar hidden></div>`;
  }

  function topbarHTML(title, lede) {
    return `
      <header class="app-topbar">
        <button class="app-icon-btn app-menu-btn" type="button" data-toggle-sidebar aria-label="Open menu">${ICONS.menu}</button>
        <div class="app-title-area">
          <h1>${title}</h1>
          ${lede ? `<p>${lede}</p>` : ""}
        </div>
        <div class="app-topbar-right">
          <label class="app-search">
            ${ICONS.search}
            <input type="search" placeholder="Search requests, deals, help..." aria-label="Search">
          </label>
          <a class="app-bell" href="notifications.html" aria-label="Notifications">
            ${ICONS.bell}
            <span class="app-badge">3</span>
          </a>
          <div class="app-userchip">
            <a class="app-avatar" href="profile.html" aria-label="James Wilson, profile">JW</a>
            <div class="app-user-meta">
              <strong>James Wilson</strong>
              <a href="index.html">Sign Out</a>
            </div>
          </div>
        </div>
      </header>`;
  }

  function mount() {
    const root = document.getElementById("app-shell");
    if (!root) return;
    document.body.classList.add("is-app");
    const active = root.dataset.active || "dashboard";
    const title = root.dataset.title || "My Dashboard";
    const lede = root.dataset.lede || "";
    const main = root.querySelector(".app-main") || root;
    main.insertAdjacentHTML("afterbegin", topbarHTML(title, lede));
    root.insertAdjacentHTML("afterbegin", sidebarHTML(active));

    root.querySelectorAll("[data-toggle-sidebar]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const backdrop = root.querySelector(".app-sidebar-backdrop");
        if (window.matchMedia("(max-width: 900px)").matches) {
          document.body.classList.remove("sidebar-collapsed");
          const open = document.body.classList.toggle("sidebar-open");
          if (backdrop) backdrop.hidden = !open;
        } else {
          document.body.classList.remove("sidebar-open");
          if (backdrop) backdrop.hidden = true;
          document.body.classList.toggle("sidebar-collapsed");
          const fold = root.querySelector(".app-sidebar-fold");
          if (fold) {
            fold.setAttribute(
              "aria-label",
              document.body.classList.contains("sidebar-collapsed") ? "Expand menu" : "Collapse menu"
            );
          }
        }
      });
    });

    window.addEventListener("resize", () => {
      const backdrop = root.querySelector(".app-sidebar-backdrop");
      if (window.matchMedia("(max-width: 900px)").matches) {
        document.body.classList.remove("sidebar-collapsed");
      } else {
        document.body.classList.remove("sidebar-open");
        if (backdrop) backdrop.hidden = true;
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();

(function () {
  function ico(d) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="#4A154B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  const ICONS = {
    bid: ico("M4 19V9l6-5 6 5v10M9 19v-6h6v6"),
    funding: ico("M4 10h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8zM4 10l8-5 8 5M12 14h.01"),
    deal: ico("M8 7V6a2 2 0 012-2h4a2 2 0 012 2v1M4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"),
    expired: ico("M12 8v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z"),
    pair: ico("M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 3 3.5 6 3.5 9s-1 6-3.5 9"),
    message: ico("M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z"),
    system: ico("M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7zM19.4 15l1.6 2.8-2.8 1.6M4.6 15L3 17.8l2.8 1.6M12 3v2M12 19v2"),
    welcome: ico("M12 21a9 9 0 100-18 9 9 0 000 18zM8 12l2.5 2.5L16 9")
  };

  const ALL = [
    { id: 1, cat: "Bids", tone: "blue", icon: "bid", title: "New bid received", body: "Ikeja BDC bid 1,880.00 on your GBP/USD request.", time: "2 min ago", href: "dashboard.html", unread: true },
    { id: 2, cat: "Funding", tone: "green", icon: "funding", title: "Funding confirmed", body: "Your GBP 2,525.00 bank transfer has been confirmed.", time: "1 hour ago", href: "deal-flow.html#funding", unread: true },
    { id: 3, cat: "Deals", tone: "green", icon: "deal", title: "Deal completed", body: "Deal #DL-9071 GBP/EUR has been completed successfully.", time: "3 hours ago", href: "deal-flow.html", unread: false },
    { id: 4, cat: "Bids", tone: "red", icon: "expired", title: "Bid expired", body: "Your bid on request REQ-9842 has expired.", time: "Yesterday", href: "requests.html", unread: false },
    { id: 5, cat: "System", tone: "orange", icon: "pair", title: "Trading pair expiring", body: "Your GBP/USD trading pair expires in 2 days.", time: "Yesterday", href: "currencies.html", unread: false },
    { id: 6, cat: "Deals", tone: "blue", icon: "message", title: "New message", body: "Ikeja BDC sent you a message in Deal #234567890.", time: "2 days ago", href: "deal-flow.html", unread: false },
    { id: 7, cat: "System", tone: "gold", icon: "system", title: "System maintenance", body: "Scheduled maintenance on Jun 20, 2026 from 2:00-4:00 AM UTC.", time: "3 days ago", href: "notifications.html", unread: false },
    { id: 8, cat: "System", tone: "green", icon: "welcome", title: "Welcome to ForexBid", body: "Your account has been verified. You can now start trading.", time: "1 week ago", href: "dashboard.html", unread: false }
  ];

  const TABS = ["All", "Deals", "Bids", "Funding", "System"];
  let tab = "All";

  function unreadCount() {
    return ALL.filter((n) => n.unread).length;
  }

  function syncBadge() {
    const badge = document.querySelector(".app-badge");
    if (!badge) return;
    const n = unreadCount();
    badge.textContent = String(n);
    badge.hidden = n === 0;
  }

  function filtered() {
    if (tab === "All") return ALL;
    return ALL.filter((n) => n.cat === tab);
  }

  function renderPills() {
    document.getElementById("notif-pills").innerHTML = TABS.map((name) =>
      `<button type="button" class="${tab === name ? "is-on" : ""}" data-tab="${name}">${name}</button>`
    ).join("");
  }

  function renderList() {
    const rows = filtered();
    const list = document.getElementById("notif-list");
    if (!rows.length) {
      list.innerHTML = `<p class="notif-empty">No ${tab.toLowerCase()} notifications.</p>`;
      return;
    }
    list.innerHTML = rows.map((n) => `
      <a class="notif-row${n.unread ? " is-unread" : ""}" href="${n.href}" data-id="${n.id}">
        <span class="unread-dot" aria-hidden="true"></span>
        <span class="notif-ico tone-${n.tone}">${ICONS[n.icon]}</span>
        <span class="notif-texts">
          <strong>${n.title}</strong>
          <span>${n.body}</span>
        </span>
        <time>${n.time}</time>
      </a>`).join("");
  }

  function render() {
    renderPills();
    renderList();
    syncBadge();
  }

  document.getElementById("notif-pills").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    tab = btn.dataset.tab;
    render();
  });

  document.getElementById("notif-mark").addEventListener("click", () => {
    ALL.forEach((n) => { n.unread = false; });
    render();
  });

  document.getElementById("notif-list").addEventListener("click", (e) => {
    const row = e.target.closest("[data-id]");
    if (!row) return;
    const item = ALL.find((n) => String(n.id) === row.dataset.id);
    if (item) item.unread = false;
    syncBadge();
  });

  render();
})();

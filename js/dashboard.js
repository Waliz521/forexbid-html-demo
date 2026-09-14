(function () {
  const PAIRS = {
    "GBP/USD": {
      buy: "NGN 1,850.00 - NGN 1,910.00",
      sell: "NGN 1,860.00 - NGN 1,920.00",
      limits: "GBP 1,000 - GBP 50,000",
      expiry: "15 Sep 2026, 10:00 PM",
      from: "GBP",
      to: "NGN"
    },
    "GBP/EUR": {
      buy: "EUR 1.14 - EUR 1.18",
      sell: "EUR 1.15 - EUR 1.19",
      limits: "GBP 500 - GBP 25,000",
      expiry: "22 Sep 2026, 6:00 PM",
      from: "GBP",
      to: "EUR"
    },
    "USD/NGN": {
      buy: "NGN 1,460.00 - NGN 1,510.00",
      sell: "NGN 1,470.00 - NGN 1,520.00",
      limits: "USD 1,000 - USD 40,000",
      expiry: "30 Sep 2026, 9:00 AM",
      from: "USD",
      to: "NGN"
    }
  };

  const BIDS = {
    "GBP/USD": [
      { name: "Individual Trader", type: "person", rate: "1,880.00", delivery: "Instant (<1hr)", rating: "4.8", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,895.00", delivery: "2-4 Hours", rating: "4.9", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,875.00", delivery: "Same Day", rating: "4.5", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,890.00", delivery: "Next Day", rating: "4.2", status: "Open" },
      { name: "Individual Trader", type: "person", rate: "1,870.00", delivery: "Same Day", rating: "4.4", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,865.00", delivery: "2-4 Hours", rating: "4.1", status: "Open" },
      { name: "Individual Trader", type: "person", rate: "1,860.00", delivery: "Next Day", rating: "4.6", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,855.00", delivery: "Instant (<1hr)", rating: "4.0", status: "Open" },
      { name: "Individual Trader", type: "person", rate: "1,850.00", delivery: "Same Day", rating: "4.7", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,848.00", delivery: "Next Day", rating: "4.3", status: "Open" },
      { name: "Individual Trader", type: "person", rate: "1,845.00", delivery: "2-4 Hours", rating: "4.5", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,840.00", delivery: "Same Day", rating: "4.2", status: "Open" }
    ],
    "GBP/EUR": [
      { name: "Organisation Trader", type: "org", rate: "1.172", delivery: "Instant (<1hr)", rating: "4.8", status: "Bidding" },
      { name: "Individual Trader", type: "person", rate: "1.168", delivery: "Same Day", rating: "4.4", status: "Open" },
      { name: "Organisation Trader", type: "org", rate: "1.165", delivery: "2-4 Hours", rating: "4.6", status: "Bidding" },
      { name: "Individual Trader", type: "person", rate: "1.161", delivery: "Next Day", rating: "4.1", status: "Open" }
    ],
    "USD/NGN": [
      { name: "Organisation Trader", type: "org", rate: "1,495.00", delivery: "Instant (<1hr)", rating: "4.7", status: "Bidding" },
      { name: "Individual Trader", type: "person", rate: "1,488.00", delivery: "Same Day", rating: "4.5", status: "Bidding" },
      { name: "Organisation Trader", type: "org", rate: "1,480.00", delivery: "2-4 Hours", rating: "4.2", status: "Open" },
      { name: "Individual Trader", type: "person", rate: "1,472.00", delivery: "Next Day", rating: "4.0", status: "Open" }
    ]
  };

  let pair = "GBP/USD";
  let page = 1;
  const pageSize = 4;
  let query = "";

  function personIco() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" fill="currentColor"/><path d="M5 19c1-3.5 3.5-5 7-5s6 1.5 7 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  }

  function orgIco() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 19V9.5L12 5l8 4.5V19" stroke="currentColor" stroke-width="1.7"/><path d="M9 19v-5h6v5" stroke="currentColor" stroke-width="1.7"/></svg>`;
  }

  function rows() {
    const all = BIDS[pair] || [];
    const q = query.toLowerCase();
    return all.filter((b) => !q || b.name.toLowerCase().includes(q) || b.delivery.toLowerCase().includes(q));
  }

  function renderParams() {
    const p = PAIRS[pair];
    document.getElementById("pair-params").innerHTML = `
      <div class="param"><span>Buy Rate Range</span><b>${p.buy}</b></div>
      <div class="param"><span>Sell Rate Range</span><b>${p.sell}</b></div>
      <div class="param"><span>Trading Limits</span><b>${p.limits}</b></div>
      <div class="param"><span>Pair Expiry</span><b>${p.expiry}</b></div>`;
  }

  function renderBids() {
    const p = PAIRS[pair];
    const list = rows();
    const pages = Math.max(1, Math.ceil(list.length / pageSize));
    if (page > pages) page = pages;
    const start = (page - 1) * pageSize;
    const slice = list.slice(start, start + pageSize);
    document.getElementById("bids-title").textContent = `Matched Bids for ${pair}`;
    document.getElementById("bids-body").innerHTML = slice.map((b) => {
      const badge = b.status === "Open" ? "status-open" : "status-bid";
      return `<tr>
        <td><span class="provider-cell"><span class="ico-wrap">${b.type === "org" ? orgIco() : personIco()}</span>${b.name}</span></td>
        <td>${b.rate}</td>
        <td>${b.delivery}</td>
        <td><span class="route-cell"><span class="route-from">${p.from}</span>→<span class="route-to">${p.to}</span></span></td>
        <td class="rating-cell">★ ${b.rating}</td>
        <td><span class="status-badge ${badge}">${b.status}</span></td>
        <td><a class="accept-btn" href="deal-flow.html">Accept Bid</a></td>
      </tr>`;
    }).join("");
    const end = start + slice.length;
    document.getElementById("bids-count").textContent = `Showing ${list.length ? start + 1 : 0}-${end} of ${list.length} bids`;
    document.getElementById("bids-pages").innerHTML = Array.from({ length: pages }, (_, i) => {
      const n = i + 1;
      return `<button type="button" class="${n === page ? "is-on" : ""}" data-page="${n}">${n}</button>`;
    }).join("");
  }

  document.getElementById("copy-account").addEventListener("click", (e) => {
    const done = () => {
      e.target.textContent = "Copied";
      setTimeout(() => {
        e.target.textContent = "Copy Account ID";
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("FB-00234891").then(done).catch(done);
    } else done();
  });

  document.getElementById("dismiss-alert").addEventListener("click", () => {
    document.getElementById("pair-alert").hidden = true;
  });

  const scroller = document.getElementById("deal-scroll");
  document.getElementById("deal-prev").addEventListener("click", () => scroller.scrollBy({ left: -284, behavior: "smooth" }));
  document.getElementById("deal-next").addEventListener("click", () => scroller.scrollBy({ left: 284, behavior: "smooth" }));

  document.getElementById("pair-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-pair]");
    if (!btn) return;
    pair = btn.dataset.pair;
    page = 1;
    document.querySelectorAll("#pair-tabs button").forEach((b) => b.classList.toggle("is-on", b === btn));
    renderParams();
    renderBids();
  });

  document.getElementById("bid-q").addEventListener("input", (e) => {
    query = e.target.value;
    page = 1;
    renderBids();
  });

  document.getElementById("bids-pages").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    page = Number(btn.dataset.page);
    renderBids();
  });

  renderParams();
  renderBids();
})();

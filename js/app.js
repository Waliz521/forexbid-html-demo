(function () {
  const COUNTRIES = [
    { code: "UK", name: "United Kingdom", flag: flagUK },
    { code: "US", name: "United States", flag: flagUS },
    { code: "CA", name: "Canada", flag: flagCA },
    { code: "NG", name: "Nigeria", flag: flagNG }
  ];

  function flagUK() {
    return `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="4"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="14"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="8"/></svg>`;
  }

  function flagUS() {
    return `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#BF0A30"/><path d="M0 4.4h60M0 11h60M0 17.6h60M0 24.2h60M0 30.8h60M0 37.4h60" stroke="#fff" stroke-width="3.2"/><rect width="26" height="21.5" fill="#002868"/></svg>`;
  }

  function flagCA() {
    return `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><rect width="15" height="40" fill="#FF0000"/><rect x="45" width="15" height="40" fill="#FF0000"/><path d="M30 8l2.2 7h7.3l-5.9 4.3 2.2 7L30 22.2 24.2 26.3l2.2-7-5.9-4.3h7.3z" fill="#FF0000"/></svg>`;
  }

  function flagNG() {
    return `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><rect width="20" height="40" fill="#008751"/><rect x="40" width="20" height="40" fill="#008751"/></svg>`;
  }

  function selectedCountry() {
    const saved = localStorage.getItem("fxb-country") || "UK";
    return COUNTRIES.find((c) => c.code === saved) || COUNTRIES[0];
  }

  function headerHTML(active) {
    const current = selectedCountry();
    const link = (href, id, label, extraClass) =>
      `<a href="${href}" class="${extraClass || ""} ${active === id ? "is-active" : ""}">${label}</a>`;

    return `
      <header class="site-header">
        <div class="container header-inner">
          <a class="logo" href="index.html">
            <img src="assets/logo-dark.jpg" alt="ForexBID">
          </a>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>
          <nav class="nav" id="site-nav">
            <div class="nav-links">
              ${link("index.html", "home", "Home")}
              ${link("index.html#get-fx", "get-fx", "Get Started")}
              ${link("index.html#faqs", "faqs", "FAQs")}
              ${link("index.html#contact", "contact", "Contact")}
              ${link("dashboard.html", "dashboard", "Dashboard")}
            </div>
            <div class="country-dd" id="country-dd">
              <button class="country-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
                <span class="flag">${current.flag()}</span>
                <span data-country-code>${current.code}</span>
                <span aria-hidden="true">▾</span>
              </button>
              <div class="country-menu" role="listbox">
                ${COUNTRIES.map(
                  (c) => `<button class="country-option" type="button" role="option" data-code="${c.code}" aria-selected="${c.code === current.code}">
                    <span class="flag">${c.flag()}</span>${c.name}<small>${c.code}</small>
                  </button>`
                ).join("")}
              </div>
            </div>
            ${link("login.html", "login", "Sign In", "nav-signin")}
          </nav>
        </div>
      </header>`;
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="logo" href="index.html">
                <img src="assets/logo-footer.png" alt="ForexBID">
              </a>
              <p class="footer-blurb">The premier peer-to-peer auction marketplace for global currency exchange. Cutting margin overheads and returning rate control back to you.</p>
            </div>
            <div>
              <h4>Marketplace</h4>
              <a href="index.html">Home</a>
              <a href="index.html#get-fx">Get FX Requests</a>
              <a href="index.html#value">Value Proposition</a>
              <a href="index.html#faqs">FAQ Answers</a>
            </div>
            <div>
              <h4>Account</h4>
              <a href="login.html">Sign In</a>
              <a href="dashboard.html">Dashboard</a>
              <a href="requests.html">My Requests</a>
              <a href="new-request.html">Create FX Request</a>
              <a href="deals.html">My Deals</a>
              <a href="deal-flow.html">Deal Room</a>
              <a href="currencies.html">Trading Currencies</a>
              <a href="statements.html">Statements</a>
              <a href="notifications.html">Notifications</a>
              <a href="profile.html">My Profile</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="legal.html#license">Regulatory License</a>
              <a href="legal.html#terms">Terms &amp; Conditions</a>
              <a href="legal.html#privacy">Privacy Statement</a>
              <a href="legal.html#dispute">Dispute Resolution</a>
            </div>
            <div>
              <h4>UK Desk</h4>
              <p>10 Finsbury Square, London, EC2A 1AF</p>
            </div>
          </div>
          <div class="footer-bottom">
            <div>© ${year} ForexBid Ltd. Licensed as an FX intermediary facilitator.</div>
            <div class="footer-social" aria-hidden="true">
              <span>f</span><span>x</span><span>in</span>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function mount() {
    const headerMount = document.getElementById("site-header");
    if (headerMount) {
      const wrap = document.createElement("div");
      wrap.innerHTML = headerHTML(headerMount.dataset.active || "");
      headerMount.replaceWith(wrap.firstElementChild);
    }

    const footerMount = document.getElementById("site-footer");
    if (footerMount) {
      const wrap = document.createElement("div");
      wrap.innerHTML = footerHTML();
      footerMount.replaceWith(wrap.firstElementChild);
    }

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    const dd = document.getElementById("country-dd");
    if (dd) {
      const btn = dd.querySelector(".country-btn");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        dd.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(dd.classList.contains("open")));
      });
      dd.querySelectorAll(".country-option").forEach((opt) => {
        opt.addEventListener("click", () => {
          localStorage.setItem("fxb-country", opt.dataset.code);
          const picked = COUNTRIES.find((c) => c.code === opt.dataset.code);
          btn.querySelector(".flag").innerHTML = picked.flag();
          btn.querySelector("[data-country-code]").textContent = picked.code;
          dd.querySelectorAll(".country-option").forEach((o) => {
            o.setAttribute("aria-selected", String(o === opt));
          });
          dd.classList.remove("open");
        });
      });
      document.addEventListener("click", () => dd.classList.remove("open"));
    }
  }

  window.ForexBid = window.ForexBid || {};
  window.ForexBid.countries = COUNTRIES;
  window.ForexBid.selectedCountry = selectedCountry;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

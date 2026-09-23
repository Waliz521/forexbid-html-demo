(function () {
  const activity = document.getElementById("tab-activity");
  const chats = document.getElementById("tab-chats");
  const funding = document.getElementById("tab-funding");
  const filings = document.getElementById("tab-filings");
  const tabs = document.getElementById("dr-tabs");
  const fundModal = document.getElementById("fund-modal");
  const disputeModal = document.getElementById("dispute-modal");
  const fundBtn = document.getElementById("dr-fund-btn");
  const fundDeposit = document.getElementById("fund-deposit");
  const FUND_METHODS = {
    bank: { label: "Bank Transfer", cta: "Proceed with Secure Bank Deposit" },
    paypal: { label: "PayPal Account", cta: "Proceed with PayPal Deposit" },
    card: { label: "Debit Card", cta: "Proceed with Debit Card Deposit" }
  };
  let funded = 75;
  let currentTab = "activity";
  let fromCode = "GBP";
  let required = 5050;
  let fundMethod = "bank";
  let lastDeposit = { amount: "GBP 1,262.50", method: "Bank Transfer" };
  const LEDES = {
    activity: "Securely finalize details and deposit transaction funds to escrow.",
    chats: "Securely discuss, coordinate escrow steps, and verify payouts.",
    funding: "Coordinate transaction escrow funding parameters.",
    filings: "Securely finalize details and deposit transaction funds to escrow."
  };

  function money(code, n) {
    const formatted = n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${code} ${formatted}`;
  }

  function isEscrowView(id) {
    return id === "chats" || id === "funding";
  }

  function applyBid() {
    try {
      const bid = JSON.parse(sessionStorage.getItem("fxb-selected-bid") || "null");
      if (!bid) return;
      const base = Number(bid.amount) || 5000;
      const fee = base * 0.01;
      const rate = Number(bid.rate) || 1.29;
      const recv = base * rate;
      const partner = bid.partner || "Organisation Trader";
      document.getElementById("dr-party").textContent = partner;
      document.getElementById("dr-pay").textContent = money(bid.from, base + fee);
      document.getElementById("dr-pay-note").textContent = `Breakdown: Base ${money(bid.from, base)} + Fee ${money(bid.from, fee)}`;
      document.getElementById("dr-recv").textContent = money(bid.to, recv);
      document.getElementById("dr-recv-note").textContent = `Exchange from ${money(bid.from, base)}`;
      document.getElementById("dr-rate").textContent = rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
      fromCode = bid.from || "GBP";
      required = base + fee;
      const partyLabel = document.getElementById("fund-party-label");
      if (partyLabel) partyLabel.textContent = `(${partner})`;
      fillFundModal();
    } catch (e) {}
  }

  function formatAmt(n) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fillFundModal() {
    const already = required * (funded / 100);
    const remain = Math.max(0, required - already);
    const reqEl = document.getElementById("fund-required");
    const alreadyEl = document.getElementById("fund-already");
    const remainEl = document.getElementById("fund-remain-val");
    const amountEl = document.getElementById("fund-amount");
    const labelEl = document.getElementById("fund-amount-label");
    const barEl = document.getElementById("fund-modal-bar");
    if (reqEl) reqEl.textContent = money(fromCode, required);
    if (alreadyEl) alreadyEl.textContent = money(fromCode, already);
    if (remainEl) {
      remainEl.textContent = money(fromCode, remain);
      remainEl.classList.toggle("is-remain", remain > 0);
    }
    if (amountEl) amountEl.value = formatAmt(remain);
    if (labelEl) labelEl.textContent = `Enter Amount to Deposit (${fromCode})`;
    if (barEl) barEl.style.width = `${funded}%`;
  }

  function setFunded(n) {
    funded = n;
    const left = document.getElementById("dr-funded-left");
    const label = document.getElementById("dr-funded-label");
    if (isEscrowView(currentTab)) {
      left.textContent = `${n}% Escrow Funded`;
      label.textContent = n >= 100 ? "GBP 5,050.00 of GBP 5,050.00" : "GBP 3,787.50 of GBP 5,050.00";
    } else {
      left.textContent = "Funding Progress";
      label.textContent = `${n}% Funded`;
    }
    document.getElementById("dr-funded-bar").style.width = `${n}%`;

    const progressCopy = document.getElementById("fund-progress-copy");
    const progressFill = document.getElementById("fund-progress-fill");
    if (progressCopy) progressCopy.textContent = `${n}% of transaction funded`;
    if (progressFill) progressFill.style.width = `${n}%`;

    const total = document.getElementById("fund-total");
    const remain = document.getElementById("fund-remain");
    if (total) total.textContent = n >= 100 ? "GBP 5,050.00" : "GBP 3,787.50";
    if (remain) {
      remain.textContent = n >= 100 ? "GBP 0.00" : "GBP 1,262.50";
      remain.classList.toggle("is-remain", n < 100);
    }

    const youChip = document.getElementById("fund-you-chip");
    if (youChip) youChip.textContent = n >= 100 ? "Fully Funded" : "Active Deposit";

    if (n >= 100) {
      fundBtn.disabled = true;
      fundBtn.textContent = "Fully funded";
      if (fundDeposit) {
        fundDeposit.disabled = true;
        fundDeposit.textContent = "Fully funded";
      }
      const lines = document.getElementById("fund-you-lines");
      if (lines && !document.getElementById("fund-last-deposit")) {
        const li = document.createElement("li");
        li.id = "fund-last-deposit";
        li.innerHTML = `<div><b>${lastDeposit.amount}</b><small>Jun 18, 2026 • ${lastDeposit.method}</small></div><span class="mini-chip ok">Confirmed</span>`;
        lines.appendChild(li);
      }
    }
    fillFundModal();
  }

  function showTab(id) {
    currentTab = id;
    activity.hidden = id !== "activity";
    chats.hidden = id !== "chats";
    if (funding) funding.hidden = id !== "funding";
    filings.hidden = id !== "filings";
    tabs.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.classList.toggle("is-on", btn.dataset.tab === id);
    });
    const actions = document.querySelector(".dr-actions");
    if (actions) actions.hidden = isEscrowView(id);
    document.getElementById("dr-bar").classList.toggle("is-full", isEscrowView(id));
    document.getElementById("dr-status").textContent = isEscrowView(id) ? "Active" : "In Progress";
    const lede = document.querySelector(".app-title-area p");
    if (lede) lede.textContent = LEDES[id] || LEDES.activity;
    const sub = document.getElementById("dr-party-sub");
    if (sub) {
      if (isEscrowView(id)) sub.textContent = "Payout Provider";
      else sub.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#F0AE00" aria-hidden="true"><path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 18.4l.9-5.4L4.2 9.2l5.4-.8L12 3.5z"/></svg> 4.8 Rating`;
    }
    setFunded(funded);
    if (id === "chats" || id === "funding") location.hash = id;
    else if (location.hash === "#chats" || location.hash === "#funding") history.replaceState(null, "", location.pathname);
  }

  function openModal(el) {
    el.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(el) {
    el.classList.remove("open");
    document.body.style.overflow = "";
  }

  function prependEvent(title, body, tone) {
    const wrap = document.createElement("article");
    wrap.className = "dr-event";
    wrap.innerHTML = `<time>Just now</time><span class="dr-event-ico ${tone}"></span><div><strong>${title}</strong><span>${body}</span></div>`;
    activity.prepend(wrap);
  }

  applyBid();

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    showTab(btn.dataset.tab);
  });

  document.querySelectorAll("[data-tab='chats']").forEach((btn) => {
    if (btn.closest(".dr-actions")) {
      btn.addEventListener("click", () => showTab("chats"));
    }
  });

  fundBtn.addEventListener("click", () => {
    if (funded >= 100) return;
    showTab("funding");
  });
  if (fundDeposit) {
    fundDeposit.addEventListener("click", () => {
      if (funded >= 100) return;
      fillFundModal();
      openModal(fundModal);
    });
  }
  document.querySelectorAll("[data-close-fund]").forEach((el) => {
    el.addEventListener("click", () => closeModal(fundModal));
  });
  document.querySelectorAll(".fund-method").forEach((btn) => {
    btn.addEventListener("click", () => {
      fundMethod = btn.dataset.method;
      document.querySelectorAll(".fund-method").forEach((el) => {
        el.classList.toggle("is-on", el === btn);
      });
      const proceed = document.getElementById("fund-proceed");
      if (proceed) proceed.textContent = FUND_METHODS[fundMethod].cta;
    });
  });
  document.getElementById("fund-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = document.getElementById("fund-amount").value.trim() || formatAmt(required * 0.25);
    lastDeposit = {
      amount: `${fromCode} ${raw.replace(/^[A-Z]{3}\s*/, "")}`,
      method: FUND_METHODS[fundMethod].label
    };
    setFunded(100);
    prependEvent("ForexBid System", "Full funding confirmed — 100% escrow secure.", "tone-green");
    closeModal(fundModal);
    showTab("funding");
  });
  const fundPing = document.getElementById("fund-ping");
  if (fundPing) {
    fundPing.addEventListener("click", () => {
      const note = document.getElementById("fund-ping-note");
      const party = document.getElementById("dr-party");
      const name = party ? party.textContent : "Organisation Trader";
      if (note) {
        note.textContent = `Reminder sent to ${name}.`;
        note.hidden = false;
      }
      prependEvent("James Wilson (You)", `Funding reminder ping sent to ${name}.`, "tone-orange");
    });
  }

  document.getElementById("dr-dispute-btn").addEventListener("click", () => openModal(disputeModal));
  document.querySelectorAll("[data-close-dispute]").forEach((el) => {
    el.addEventListener("click", () => closeModal(disputeModal));
  });
  document.getElementById("dispute-form").addEventListener("submit", (e) => {
    e.preventDefault();
    prependEvent("James Wilson (You)", "Dispute reported. Support will review this mock case.", "tone-orange");
    e.target.reset();
    closeModal(disputeModal);
    showTab("activity");
  });

  document.getElementById("dr-composer").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("dr-chat-input");
    const text = input.value.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const row = document.createElement("div");
    row.className = "chat-row is-you";
    row.innerHTML = `<article class="chat-bubble you"><p></p><time>${time}</time></article>`;
    row.querySelector("p").textContent = text;
    document.getElementById("dr-chat").appendChild(row);
    input.value = "";
    row.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  document.getElementById("dr-chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("dr-composer").requestSubmit();
    }
  });

  document.getElementById("chat-attach").addEventListener("click", () => {
    document.getElementById("chat-file").click();
  });
  document.getElementById("chat-file").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const row = document.createElement("div");
    row.className = "chat-row is-you";
    row.innerHTML = `<article class="chat-bubble you"><p></p><time>${time}</time></article>`;
    row.querySelector("p").textContent = "Attached: " + file.name;
    document.getElementById("dr-chat").appendChild(row);
    e.target.value = "";
  });

  document.getElementById("chat-call").addEventListener("click", () => {
    const note = document.getElementById("chat-call-note");
    note.hidden = false;
    setTimeout(() => { note.hidden = true; }, 2500);
  });

  const chatParty = document.getElementById("chat-party");
  const party = document.getElementById("dr-party");
  if (chatParty && party) chatParty.textContent = party.textContent;

  if (location.hash === "#chats") showTab("chats");
  if (location.hash === "#funding") showTab("funding");
})();

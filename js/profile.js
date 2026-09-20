(function () {
  const tabs = document.getElementById("pf-tabs");
  const panels = document.querySelectorAll("[data-panel]");
  const statusEl = document.getElementById("pf-kyc-status");

  function show(id) {
    tabs.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-on", btn.dataset.tab === id);
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== id;
    });
    if (location.hash.slice(1) !== id) {
      history.replaceState(null, "", "#" + id);
    }
  }

  function flash(form) {
    const note = form.querySelector(".pf-note");
    if (!note) return;
    note.hidden = false;
    clearTimeout(form._pfTimer);
    form._pfTimer = setTimeout(() => {
      note.hidden = true;
    }, 2200);
  }

  function setKycState(state) {
    const label = {
      progress: "Verification in progress",
      ok: "KYC successful",
      fail: "KYC failed"
    }[state] || "Verification in progress";
    statusEl.dataset.state = state;
    statusEl.querySelector(".pf-kyc-label").textContent = label;
  }

  function bindUpload(input) {
    const name = input.parentElement.querySelector(".pf-upload-name");
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      name.textContent = file ? file.name : name.dataset.empty;
    });
  }

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    show(btn.dataset.tab);
  });

  document.getElementById("pf-details").addEventListener("submit", (e) => {
    e.preventDefault();
    flash(e.currentTarget);
  });

  document.getElementById("pf-kyc").addEventListener("submit", (e) => {
    e.preventDefault();
    setKycState("ok");
    flash(e.currentTarget);
  });

  document.getElementById("pf-security").addEventListener("submit", (e) => {
    e.preventDefault();
    flash(e.currentTarget);
  });

  bindUpload(document.getElementById("pf-id-file"));
  bindUpload(document.getElementById("pf-addr-file"));

  const start = location.hash.slice(1);
  show(start === "kyc" || start === "security" ? start : "details");
})();

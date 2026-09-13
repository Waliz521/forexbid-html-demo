(function () {
  document.querySelectorAll("form[data-next]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = form.dataset.next;
    });
  });
})();

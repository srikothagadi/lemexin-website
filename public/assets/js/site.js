// Small, dependency-free helpers: mobile menu, footer year, contact form.
(function () {
  "use strict";

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact form: check, then post to the Cloudflare Pages Function.
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function say(text, kind) {
    status.textContent = text;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = Object.fromEntries(new FormData(form));

    if (!data.name.trim() || !data.message.trim()) return say("Please fill in your name and message.", "err");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return say("Please enter a valid email address.", "err");

    var button = form.querySelector("button[type=submit]");
    button.disabled = true;
    say("Sending...");

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("bad status " + res.status);
        form.reset();
        say("Thank you. We will reply within one working day.", "ok");
      })
      .catch(function () {
        say("Something went wrong. Please email us directly instead.", "err");
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();

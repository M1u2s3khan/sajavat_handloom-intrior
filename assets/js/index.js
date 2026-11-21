/* =====================================================================
   Sajavat - Shared main.js  (navigation, scroll reveal, form, WhatsApp)
   ===================================================================== */

/* ⚠️ YAHAN APNA ASLI WHATSAPP NUMBER DALEIN (91 + number, bina + ya space) */
const WA_NUMBER = "9198XXXXXXX00";

function openWA(text){
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
  return false;
}

document.addEventListener("DOMContentLoaded", function (){

  /* ---------- Mobile menu ---------- */
  const ham = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (ham && links) {
    ham.addEventListener("click", () => {
      ham.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      ham.classList.remove("open");
      links.classList.remove("open");
    }));
  }

  /* ---------- Navbar shadow on scroll ---------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal animation ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ---------- Active nav link on scroll (only on home page) ---------- */
  if (document.body.dataset.page !== "gallery") {
    const secs = ["home","about","services","reviews","contact"];
    const navAnchors = document.querySelectorAll(".nav-links a");
    const updateActive = () => {
      let cur = "home";
      secs.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) cur = id;
      });
      // Gallery is separate page; ignore if it's the active link
      navAnchors.forEach(a => {
        const href = a.getAttribute("href");
        if (href && href.indexOf("#") === 0) {
          a.classList.toggle("active", href === "#" + cur);
        }
      });
    };
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  /* ---------- Quote form -> WhatsApp ---------- */
  const form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e){
      e.preventDefault();
      const n = (document.getElementById("fName")||{}).value || "";
      const p = (document.getElementById("fPhone")||{}).value || "";
      const s = (document.getElementById("fService")||{}).value || "";
      const u = (document.getElementById("fUrgent")||{}).value || "";
      const m = (document.getElementById("fMsg")||{}).value || "";
      const msg =
        "Hello Sajavat! 👋\n\n" +
        "Naam: " + n.trim() + "\n" +
        "Phone: " + p.trim() + "\n" +
        "Service: " + s + "\n" +
        "Urgency: " + u +
        (m.trim() ? "\nMessage: " + m.trim() : "") +
        "\n\nMujhe free estimate chahiye.";
      openWA(msg);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const faq = q.parentElement;
      const isOpen = faq.classList.contains("open");
      // close all (uncomment for single-open behaviour)
      // document.querySelectorAll(".faq").forEach(f => f.classList.remove("open"));
      faq.classList.toggle("open", !isOpen);
    });
  });

});
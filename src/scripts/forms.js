// Temporary email-app behavior retained until secure delivery is configured and tested.
import "./integrations.js";
    function bindPoolReviewForm(root) {
      root.querySelectorAll("[data-pool-review-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          if (!form.reportValidity()) return;
          const data = Object.fromEntries(new FormData(form).entries());
          window.Paradise.integrations.submitInquiry({ ...data, type: "pool-review", createdAt: new Date().toISOString() });
          const subject = encodeURIComponent(`Pool review from ${data.name}`);
          const body = encodeURIComponent(`Name: ${data.name}\nLocation: ${data.location}\nPool model: ${data.model}\nRating: ${data.rating}\n\n${data.review}`);
          form.querySelector(".review-status").textContent = "Your review email draft is ready. Reviews are only shared publicly with your permission.";
          window.location.href = `mailto:service@thinkparadisepools.com?subject=${subject}&body=${body}`;
        });
      });
    }

  function bindForms() {
    document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form).entries());
        const inquiry = { ...data, source: location.pathname, createdAt: new Date().toISOString() };
        window.Paradise.integrations.submitInquiry(inquiry);
        const subject = encodeURIComponent(`Paradise Pools inquiry: ${data.interest}`);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nInterest: ${data.interest}\n\n${data.message}`);
        const status = form.querySelector(".form-status");
        status.textContent = "Your email draft is ready. Review it and press Send to reach our team.";
        window.location.href = `mailto:service@thinkparadisepools.com?subject=${subject}&body=${body}`;
      });
    });
  }


export function initializeForms(root) { bindForms(); bindPoolReviewForm(root); }

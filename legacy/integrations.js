(function () {
  const listeners = new Set();

  window.Paradise = window.Paradise || {};
  window.Paradise.integrations = {
    onInquiry(handler) {
      listeners.add(handler);
      return () => listeners.delete(handler);
    },
    submitInquiry(inquiry) {
      listeners.forEach((handler) => handler(inquiry));
      window.dispatchEvent(new CustomEvent("paradise:inquiry", { detail: inquiry }));
    },
    onAssistantRequest(handler) {
      window.addEventListener("paradise:assistant-request", (event) => handler(event.detail));
    },
    requestAssistant(input) {
      window.dispatchEvent(new CustomEvent("paradise:assistant-request", { detail: input }));
    }
  };
})();
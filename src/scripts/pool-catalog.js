import { poolModels, matchesPool, comparePoolModels } from "../data/pools.js";
    function renderPoolComparison(root, models) {
      const selected = [...root.querySelectorAll(".model-compare-toggle input:checked")]
        .map((input) => models.find((model) => model.id === input.value))
        .filter(Boolean);
      const rows = [
        ["Pool type", "type"],
        ["Available sizes", "sizes"],
        ["Dimensions", "dimensions"],
        ["Features", "features"],
        ["Backyard fit", "fit"]
      ];
      return `<table class="compare-table"><thead><tr><th scope="col">Compare</th>${selected.map((model) => `<th scope="col">${model.name}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, key]) => `<tr><th scope="row">${label}</th>${selected.map((model) => `<td>${model[key]}</td>`).join("")}</tr>`).join("")}<tr><th scope="row">Latham details</th>${selected.map((model) => `<td><a href="${model.url}" target="_blank" rel="noreferrer">Open ${model.name} specs <span aria-hidden="true">&#8599;</span></a></td>`).join("")}</tr></tbody></table>`;
    }

    function bindPoolComparison(root, models) {
      const dock = document.querySelector("#pool-compare-dock");
      const status = document.querySelector("#compare-status");
      const compareButton = document.querySelector("[data-compare-pools]");
      const dialog = document.querySelector(".pool-compare-dialog");
      const update = () => {
        const inputs = [...root.querySelectorAll(".model-compare-toggle input")];
        const selectedCount = inputs.filter((input) => input.checked).length;
        dock.hidden = selectedCount === 0;
        compareButton.disabled = selectedCount < 2;
        status.textContent = `${selectedCount} selected. Choose up to 3 models.`;
        inputs.forEach((input) => { input.disabled = selectedCount >= 3 && !input.checked; });
      };
      root.querySelectorAll(".model-compare-toggle input").forEach((input) => input.addEventListener("change", update));
      document.querySelector("[data-clear-comparison]").addEventListener("click", () => {
        root.querySelectorAll(".model-compare-toggle input").forEach((input) => { input.checked = false; });
        update();
      });
      compareButton.addEventListener("click", () => {
        document.querySelector("#pool-comparison-table").innerHTML = renderPoolComparison(root, models);
        dialog.showModal();
      });
      update();
    }

function bindPoolFilters(root) {
  const grid = root.querySelector('.pool-model-grid');
  const entries = [...grid.querySelectorAll('.pool-model-card')].map(card => ({ card, model: poolModels.find(model => model.id === card.dataset.modelId) }));
  const controls = Object.fromEntries([...root.querySelectorAll('[data-pool-filter]')].map(control => [control.dataset.poolFilter, control]));
  const results = root.querySelector('[data-pool-results]');
  const emptyState = root.querySelector('[data-pool-empty]');
  const update = () => {
    const filters = Object.fromEntries(Object.entries(controls).map(([key, control]) => [key, control.value]));
    let visible = 0;
    entries.sort((a, b) => comparePoolModels(a.model, b.model, filters.sort, filters));
    for (const { card, model } of entries) {
      card.hidden = !matchesPool(model, filters);
      if (!card.hidden) visible++;
      grid.append(card);
    }
    results.textContent = `Showing ${visible} of ${entries.length} models`;
    emptyState.hidden = visible > 0;
  };
  for (const [name, control] of Object.entries(controls)) control.addEventListener(name === 'search' ? 'input' : 'change', update);
  root.querySelector('[data-clear-pool-filters]').addEventListener('click', () => {
    for (const [name, control] of Object.entries(controls)) control.value = name === 'sort' ? 'recommended' : '';
    update();
  });
  update();
}

export function initializeCatalog(root) {
  bindPoolFilters(root);
  bindPoolComparison(root, poolModels);
}

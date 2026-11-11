import { poolModels } from "../data/pools.js";
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
    const grid = root.querySelector(".pool-model-grid");
    const cards = [...grid.querySelectorAll(".pool-model-card")];
    const search = root.querySelector('[data-pool-filter="search"]');
    const shape = root.querySelector('[data-pool-filter="shape"]');
    const size = root.querySelector('[data-pool-filter="size"]');
    const depth = root.querySelector('[data-pool-filter="depth"]');
    const feature = root.querySelector('[data-pool-filter="feature"]');
    const sort = root.querySelector('[data-pool-filter="sort"]');
    const results = root.querySelector("[data-pool-results]");
    const emptyState = root.querySelector("[data-pool-empty]");
    const numbers = (value) => value ? value.split(",").map(Number).filter(Number.isFinite) : [];
    const ranges = (value) => value ? value.split(";").map((range) => range.split(",").map(Number)) : [];

    const sortCards = () => {
      const metric = (card, key) => {
        const values = key === "lengths" ? numbers(card.dataset.lengths) : ranges(card.dataset.depthRanges).flat();
        if (!values.length) return key === "lengths" ? Infinity : 0;
        if (key === "lengths") return sort.value === "smallest" ? Math.min(...values) : Math.max(...values);
        return sort.value === "shallowest" ? Math.min(...values) : Math.max(...values);
      };
      cards.sort((first, second) => {
        if (sort.value === "recommended") {
          const featuredDifference = Number(first.dataset.featuredOrder || 99) - Number(second.dataset.featuredOrder || 99);
          return featuredDifference || first.querySelector(".model-name").textContent.localeCompare(second.querySelector(".model-name").textContent);
        }
        if (sort.value === "name") return first.querySelector(".model-name").textContent.localeCompare(second.querySelector(".model-name").textContent);
        const key = ["smallest", "largest"].includes(sort.value) ? "lengths" : "depths";
        const difference = metric(first, key) - metric(second, key);
        return ["largest", "deepest"].includes(sort.value) ? -difference : difference;
      });
      cards.forEach((card) => grid.append(card));
    };

    const update = () => {
      const query = search.value.trim().toLowerCase();
      let visibleCount = 0;
      cards.forEach((card) => {
        const modelShapes = card.dataset.shapes.split(",");
        const modelFeatures = card.dataset.features.split(",");
        const modelLengths = numbers(card.dataset.lengths);
        const modelDepths = ranges(card.dataset.depthRanges);
        const matchesSize = !size.value || modelLengths.some((length) => size.value === "small" ? length <= 25 : size.value === "medium" ? length > 25 && length <= 35 : length > 35);
        const matchesDepth = !depth.value || modelDepths.some(([, maximum]) => depth.value === "over-7" ? maximum > 7 : maximum <= Number(depth.value));
        const matches = (!query || card.textContent.toLowerCase().includes(query))
          && (!shape.value || modelShapes.includes(shape.value))
          && matchesSize
          && matchesDepth
          && (!feature.value || modelFeatures.includes(feature.value));
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      results.textContent = `Showing ${visibleCount} of ${cards.length} models`;
      emptyState.hidden = visibleCount > 0;
    };

    [search, shape, size, depth, feature, sort].forEach((control) => control.addEventListener(control === search ? "input" : "change", () => {
      sortCards();
      update();
    }));
    root.querySelector("[data-clear-pool-filters]").addEventListener("click", () => {
      [search, shape, size, depth, feature].forEach((control) => { control.value = ""; });
      sort.value = "recommended";
      sortCards();
      update();
    });
    sortCards();
    update();
  }


export function initializeCatalog(root) {
  bindPoolFilters(root);
  bindPoolComparison(root, poolModels);
}

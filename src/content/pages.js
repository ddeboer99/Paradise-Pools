import { quoteForm, poolReviewSection } from "./forms.js";
// Trusted HTML templates migrated from Dan’s original site; never interpolate form submissions here.
import { poolModels, poolModelFacets } from "../data/pools.js";

      function waterCareProductSection() {
        const products = [
          { issue: "Cloudy water or organic load", product: "Smart Shock", image: "https://dpbvj4a9anukr.cloudfront.net/303ea2c8-8d4b-4eaa-916a-124b41d84728/ff73366c-3241-497a-ad7a-7dc8668c5ff2/24362d65c32110d487a5a879addfaae4/shock-product-feature.png", alt: "BioGuard Smart Shock product visual", url: "https://bioguard.com/pool-products/shock-to-remove-contaminants/" },
          { issue: "Green water or algae", product: "Algae Complete", image: "https://dpbvj4a9anukr.cloudfront.net/303ea2c8-8d4b-4eaa-916a-124b41d84728/ff73366c-3241-497a-ad7a-7dc8668c5ff2/d75f57a6ac902f03dff37783bda41fab/algae-product-feature.png", alt: "BioGuard algae-care product visual", url: "https://bioguard.com/pool-products/algae-killing-and-prevention/" },
          { issue: "Balance and pH", product: "BioGuard Balancers", image: "https://dpbvj4a9anukr.cloudfront.net/303ea2c8-8d4b-4eaa-916a-124b41d84728/ff73366c-3241-497a-ad7a-7dc8668c5ff2/b82f3ccfea543e5bff307bfbf4fee33d/balancer-product-feature.png", alt: "BioGuard water-balancing product visual", url: "https://bioguard.com/pool-products/water-balancers/" }
        ];
        return `<section class="section water-product-section"><div class="water-help-heading"><p class="eyebrow">Test results guide product choice</p><h2>BioGuard options for common water needs.</h2><p>These are examples, not prescriptions. Bring a sample for on-site testing before choosing a product; current availability may vary by retail location.</p></div><div class="water-product-grid">${products.map((product) => `<article class="water-product-item"><a href="${product.url}" target="_blank" rel="noreferrer"><img src="${product.image}" alt="${product.alt}" loading="lazy"></a><p class="product-issue">${product.issue}</p><h3>${product.product}</h3><a class="text-link" href="${product.url}" target="_blank" rel="noreferrer">BioGuard product details <span aria-hidden="true">&#8599;</span></a></article>`).join("")}</div></section>`;
      }

      function waterCareVideoSection() {
        const videos = [
          { title: "Better Water Testing with ALEX", id: "V0shGymfmqc", note: "See how a professional water analysis helps guide a pool-care plan." },
          { title: "The Value of Shocking Your Pool Water", id: "spJDtNuIT-I", note: "Learn how routine shock helps oxidize swimmer and environmental contaminants." },
          { title: "Algae Complete", id: "hH6fq17Gd9Y", note: "A short introduction to BioGuard algae prevention and treatment." },
          { title: "The Importance of Balanced Water", id: "DMUAoqFBrAw", note: "Understand why balanced water supports swimmer comfort and pool surfaces." },
          { title: "5 Easy Steps to Open Your Pool", id: "4jdTtE_9Bjw", note: "Review water testing and other steps that help prepare for swim season." }
        ];
        return `<section class="section water-video-section"><div class="water-help-heading"><p class="eyebrow">Helpful tips from BioGuard</p><h2>Watch, learn, then test.</h2><p>Short videos on water testing, cloudy water, algae, balance and seasonal care.</p></div><div class="water-video-grid">${videos.map((video) => `<article class="water-video-item"><div class="water-video-frame"><a class="water-video-preview" href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${video.title} on YouTube"><img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="Video preview: ${video.title}" loading="lazy" onerror="this.style.display='none'"/><span class="water-video-play" aria-hidden="true">▶</span><span class="water-video-watch">Watch on YouTube ↗</span></a></div><h3>${video.title}</h3><p>${video.note}</p></article>`).join("")}</div><a class="text-link" href="https://bioguard.com/pool-answers/pool-care-basics/video-library/" target="_blank" rel="noreferrer">Browse the full BioGuard video library <span aria-hidden="true">&#8599;</span></a></section>`;
      }
    function poolCompareControls() {
      return `<div class="compare-dock" id="pool-compare-dock" hidden><p id="compare-status" aria-live="polite">Select up to three models.</p><button class="button button-dark" type="button" data-compare-pools disabled>Compare selected</button><button class="compare-clear" type="button" data-clear-comparison>Clear</button></div><dialog class="pool-compare-dialog" aria-labelledby="pool-compare-title"><div class="compare-dialog-heading"><div><p class="eyebrow">Latham fiberglass comparison</p><h2 id="pool-compare-title">Find the right fit.</h2></div><form method="dialog"><button class="compare-dialog-close" aria-label="Close comparison">Close</button></form></div><div id="pool-comparison-table"></div></dialog>`;
    }

  function coverStateGallery(page, closedPhoto) {
    const coverStates = [
      { label: "Partially open", copy: "Retract the cover when it's time to swim.", image: page.image, alt: page.imageAlt },
      { label: "Fully closed", copy: "Close the pool between swims to help keep out debris and reduce evaporation.", image: closedPhoto, alt: "Coverstar automatic safety cover fully closed over a swimming pool" }
    ];
    return `<section class="cover-state-section"><div class="cover-state-heading"><div><p class="eyebrow">Coverstar automatic pool covers</p><h2>See the cover in action.</h2></div><p>At a touch, your cover moves between open-swim time and a closed pool.</p></div><div class="cover-state-grid">${coverStates.map((state) => `<figure><img src="${state.image}" alt="${state.alt}" loading="lazy"><figcaption><strong>${state.label}</strong><span>${state.copy}</span></figcaption></figure>`).join("")}</div><section class="cover-safety-note"><div><p class="eyebrow">Safety, engineered in</p><h3>Protection starts with the right system and installation.</h3></div><div><p>Coverstar options include secure key-switch or PIN-protected controls, durable heat-sealed webbing and custom-fit track systems. Ask Paradise Pools which safety features and applicable ASTM compliance are specified for your model and pool.</p><p>There is no single pounds rating that applies to every cover and installation. We will confirm the manufacturer’s model-specific load information and test scope. A test rating is not permission to walk, sit or play on the cover; keep children and pets off it and maintain required barriers and adult supervision.</p></div></section></section>`;
  }

  function coverstarOptions() {
    const cs = (path, size = "0x0") => `https://coverstarcentral.com/custom_image/asp_csc/${size}/${path}`;
    const colorNames = ["Navy", "Royal", "Light Blue", "Green", "Tan", "Aqua", "Mocha", "Grey", "Charcoal", "Black"];
    const poolFiles = ["167_1582570878", "166_1582570872", "168_1584016117", "164_1582570856", "160_1582570845", "165_1582571758", "161_1582570848", "158_1582570835", "159_1582570842", "163_1582571771"];
    const swatchFiles = ["169_1582571841", "170_1582571844", "171_1584016128", "172_1582571851", "173_1582571852", "174_1582571886", "175_1582571857", "177_1582571860", "178_1582571862", "179_1582571880"];
    const colorImages = colorNames.map((name, i) => ({ label: name, src: cs(`images/image_file/${poolFiles[i]}.jpg`, "0x0"), thumb: cs(`images/image_file/${swatchFiles[i]}.jpg`, "125x82"), alt: `${name} Coverstar fabric on a pool` }));
    const trackImages = (label, files) => files.map((file, i) => ({ label: `${label} view ${i + 1}`, src: cs(`images/image_file/${file}.jpg`), thumb: cs(`images/image_file/${file}.jpg`, "250x0"), alt: `${label} Coverstar system, view ${i + 1}` }));
    const single = (path, alt, size) => [{ label: alt, src: cs(path, size), thumb: cs(path, size), alt }];
    const groups = [
      {
        title: "Track types",
        intro: "The track is the channel that guides the cover along the sides of your pool. The right style depends on your pool's construction and deck.",
        items: [
          { title: "Under track", images: trackImages("Under track", ["191_1562692525", "192_1574103740"]), copy: "The track is mounted beneath the coping, so it is largely out of sight. Choose it for the cleanest, most finished look on pools where there is room to install it." },
          { title: "Top track", images: trackImages("Top track", ["193_1562692563", "194_1574103820", "195_1562692577"]), copy: "The track mounts on top of the deck or coping. It is a practical solution for many existing pools and keeps installation straightforward when an under-track system is not a fit." },
          { title: "Deck mount", images: trackImages("Deck mount", ["196_1562693285", "197_1562693292", "198_1562693302"]), copy: "The mechanism mounts on the deck rather than in a below-deck pit, which can suit pools where the layout or structure limits other options. We will confirm which style fits your pool." }
        ]
      },
      {
        title: "Control options",
        intro: "How you operate the cover matters every day. Coverstar offers two ways to open and close it.",
        items: [
          { title: "Leviton key switch", images: single("content/image/71_1615814427.jpg", "Leviton key switch control", "250x250"), copy: "Coverstar's standard switch. You hold the lever up or down to run the cover, and it stops the instant you let go, which is a built-in safety feature. A power indicator light lets you check for power, and the brushed aluminum locking door keeps the control secure." },
          { title: "Touch screen controller", images: single("content/image/73_1679674069.jpg", "Coverstar touch screen controller", "250x250"), copy: "A modern controller with simple setup that works on its own or pairs with up to 4 touch controllers. It adds 4 users with unique passcodes, Wi-Fi notifications when the cover is operated or left open, and current limiting. It can also be retrofitted to an existing system." }
        ]
      },
      {
        title: "Fabrics",
        intro: "The fabric is what you see and what protects the pool, so durability counts.",
        items: [
          { title: "17 oz. acrylic-coated vinyl", images: [colorImages[0]], copy: "Heavy-duty vinyl with a closed polyester weave and an acrylic coating, designed to resist UV, chemicals, mildew, tears and abrasion. Coverstar reports more than 30 years of testing." },
          { title: "Heat-sealed webbing", images: single("content/image/84_1574095549.jpg", "Heat-sealed webbing on Coverstar fabric", "400x0"), copy: "Webbing is bonded to the fabric instead of sewn, so it does not stretch or bunch the way sewn webbing can. Coverstar reports independent lab tests showing it is over twice as strong as standard sewn webbing." },
          { title: "Color choices", images: colorImages, colors: true, copy: "Choose from Navy, Royal, Light Blue, Green, Tan, Aqua, Mocha, Grey, Charcoal and Black so the cover complements your deck and landscaping. Some colors have limited availability; ask us what is offered for your system." }
        ]
      }
    ];
    return `<section class="cover-benefits cover-options" aria-labelledby="cover-options-title"><div class="cover-benefits-heading"><p class="eyebrow light">Customize your Coverstar cover</p><h2 id="cover-options-title">Choose the track, controls and fabric that suit you.</h2><p>Every pool and household is different. Paradise Pools will help you choose the right combination and confirm availability for your model. Tap an option to see photos and details.</p></div>${groups.map((group, g) => `<div class="cover-option-group" data-option-group><h3 class="cover-option-title"><span>0${g + 1}</span>${group.title}</h3><p class="cover-option-intro">${group.intro}</p><div class="option-tabs" role="tablist" aria-label="${group.title}">${group.items.map((item, i) => `<button type="button" role="tab" id="opt-tab-${g}-${i}" aria-controls="opt-panel-${g}-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-option-tab>${item.title}</button>`).join("")}</div>${group.items.map((item, i) => `<div class="option-panel" role="tabpanel" id="opt-panel-${g}-${i}" aria-labelledby="opt-tab-${g}-${i}" ${i === 0 ? "" : "hidden"}><div class="option-viewer"><img class="option-main" src="${item.images[0].src}" alt="${item.images[0].alt}" loading="lazy">${item.images.length > 1 ? `<div class="option-thumbs">${item.images.map((image, k) => `<button type="button" class="option-thumb${k === 0 ? " is-active" : ""}${item.colors ? " is-color" : ""}" data-option-thumb data-src="${image.src}" data-alt="${image.alt}" aria-label="Show ${image.label}" aria-pressed="${k === 0}"><img src="${image.thumb}" alt="" loading="lazy">${item.colors ? `<span>${image.label}</span>` : ""}</button>`).join("")}</div>` : ""}</div><div class="option-detail"><h4>${item.title}</h4><p>${item.copy}</p><a class="text-link" href="/contact/">Ask about this option</a></div></div>`).join("")}</div>`).join("")}<a class="text-link" href="https://coverstarcentral.com/standard-features-and-options" target="_blank" rel="noopener noreferrer">See all Coverstar options <span aria-hidden="true">&#8599;</span></a></section>`;
  }

  function coverstarBenefits() {
    const benefits = [
      { title: "Open and close in seconds", copy: "Coverstar says full operation typically takes about 45–60 seconds, depending on pool size, with switch- or button-operated convenience." },
      { title: "Spend less time cleaning", copy: "When closed, the cover helps keep leaves and dirt out of the water, reducing routine debris cleanup and helping lower evaporation and chemical use." },
      { title: "Hold heat between swims", copy: "By limiting evaporative heat loss and capturing solar warmth, a cover may help extend the swimming season. Coverstar reports potential temperature gains of 7–10°F; actual results vary." },
      { title: "Options built around your pool", copy: "Coverstar offers a range of system models, fabrics, colors and options. The right configuration depends on your pool, deck and preferred controls." },
      { title: "Designed for dependable operation", copy: "Coverstar describes its mechanisms and fabrics as reliability-focused, using heavy-duty components and precision-machined parts." }
    ];
    return `<section class="cover-benefits" aria-labelledby="cover-benefits-title"><div class="cover-benefits-heading"><p class="eyebrow">Automatic cover features & benefits</p><h2 id="cover-benefits-title">A simpler routine, from day one.</h2><p>Coverstar automatic safety covers combine convenient operation with everyday pool-care benefits. Manufacturer performance figures are estimates, not guarantees; pool size, weather, installation and use affect results.</p></div><div class="cover-benefits-grid">${benefits.map((benefit, index) => `<article><span>0${index + 1}</span><h3>${benefit.title}</h3><p>${benefit.copy}</p></article>`).join("")}</div><a class="text-link" href="https://coverstarcentral.com/content/why-choose-us" target="_blank" rel="noopener noreferrer">See Coverstar’s product information <span aria-hidden="true">&#8599;</span></a></section>`;
  }
  const poolPhoto = "https://www.lathampool.com/wp-content/uploads/2024/06/Main-Astoria-vid.jpg";
  const couplePhoto = "https://www.lathampool.com/wp-content/uploads/2020/01/aruba-fiberglass-pool.jpg";
  const cleanPhoto = "https://www.lathampool.com/wp-content/uploads/2020/01/gemini-fiberglass-pool-03.jpg";
  const corinthianPhoto = "https://www.lathampool.com/wp-content/uploads/2020/01/f-162-1-15644267_XhXmthXZ_image_corinthian-14-1200px.jpg";
  const coverClosedPhoto = "https://www.coverstar.com/wp-content/uploads/2026/01/Gallery-Pics_0002_f-184-1-16880149_Auto_Cover.jpg";
export const pages = {
    home: {
      title: "Paradise Pools | Pool construction, service & supply since 1963",
      description: "Paradise Pools has built over 1,500 in-ground pools in Michiana since 1963. Explore fiberglass pools, pool service, automatic covers and supplies.",
      render: homePage
    },
    "new-pools": {
      title: "Latham Fiberglass Pools in Michiana | Paradise Pools",
      description: "Explore Latham fiberglass pool models, colors and upgrades with Paradise Pools. Serving Michiana with pool construction since 1963.",
      eyebrow: "Latham fiberglass pools · Michiana since 1963",
      heading: "Your backyard,\nreimagined.",
      intro: "Paradise Pools specializes in Latham fiberglass pools. Explore different models, finishes and upgrades, then work with our local team to plan the pool around your backyard.",
      image: corinthianPhoto,
      imageAlt: "Latham Corinthian 14 fiberglass pool",
      render: fiberglassPoolPage
    },
    "pool-service": {
      title: "2027 Pool Openings, Closings & Gold Program | Paradise Pools",
      description: "Plan pool openings, closings and vinyl liner replacement in Michiana. Learn about Paradise Pools service, seasonal rates and Gold benefits.",
      eyebrow: "2027 openings, closings & Gold Program",
      heading: "Open with confidence.\nClose with peace of mind.",
      intro: "Professional pool service from your local Michiana team. Plan openings and closings, ask about vinyl liner replacement, or join the Gold Program for annual savings and priority service.",
      image: cleanPhoto,
      imageAlt: "Clear blue water in a swimming pool",
      render: function seasonalServicePage() {
        return `${hero(pages["pool-service"])}
          <section class="service-options" aria-label="Pool service options">
            <article class="service-option seasonal-service-option">
              <p class="eyebrow">Seasonal pool service</p>
              <h2 id="seasonal-service-title">Openings & closings</h2>
              <p>Get your pool ready for the season and prepare it for winter. Choose the service that fits your cover arrangement, then check current rates and details.</p>
              <a class="button button-dark" href="#seasonal-pricing-title">View opening & closing rates <span aria-hidden="true">&#8594;</span></a>
            </article>
            <article class="service-option liner-service-option">
              <p class="eyebrow light">A major part of our service work</p>
              <h2 id="liner-replacement-title">Vinyl liner replacement</h2>
              <p>Paradise Pools replaces more than 50 vinyl liners each year. Our experienced team helps existing vinyl-liner pool owners with measuring and fitting for a replacement.</p>
              <div class="service-liner-proof"><strong>50+</strong><span>liners replaced each year</span></div>
              <a class="button button-light" href="/contact/">Ask about a liner replacement <span aria-hidden="true">&#8594;</span></a>
            </article>
          </section>
          <section class="section seasonal-pricing" aria-labelledby="seasonal-pricing-title">
            <div class="seasonal-section-heading">
              <div><p class="eyebrow">2027 seasonal pool service</p><h2 id="seasonal-pricing-title">Openings & closings</h2></div>
              <p>Choose the service that matches your cover arrangement. Rates below are for standard seasonal service.</p>
            </div>
            <div class="seasonal-table-wrap">
              <table class="seasonal-table">
                <thead><tr><th scope="col">Cover arrangement</th><th scope="col">Opening</th><th scope="col">Closing</th><th scope="col">Gold annual</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Solid or mesh cover</th><td>$340</td><td>$365</td><td>$634.50</td></tr>
                  <tr><th scope="row">Automatic cover</th><td>$215</td><td>$215</td><td>$387</td></tr>
                  <tr><th scope="row">Without a cover</th><td>$215</td><td>$215</td><td>$387</td></tr>
                  <tr><th scope="row">Waterbag cover</th><td>$375</td><td>$400</td><td>$697.50</td></tr>
                </tbody>
              </table>
            </div>
            <p class="seasonal-rate-note">Gold annual pricing includes 10% off the combined standard opening-and-closing package. Confirm current service details and appointment availability when scheduling.</p>
            <div class="seasonal-service-details">
              <article><h3>Pool opening</h3><p>We reassemble pool equipment, prime the pump, address minor start-up issues, install ladders and handrails, and attach applicable lights. Removable winter covers are cleaned, folded and placed in your storage area when available.</p><p>Opening service does not include chemicals. Please set the water at the center of the skimmer and have accessories ready with clear equipment access.</p></article>
              <article><h3>Pool closing</h3><p>We winterize accessible pool plumbing and equipment, add antifreeze to the skimmer line, and remove ladders and handrails when needed. Cover handling depends on your arrangement.</p><p>Please test and balance water one week before closing. Water level depends on cover type and pool features; contact our team when requirements overlap.</p></article>
            </div>
          </section>
          <section class="gold-program" aria-labelledby="gold-program-title">
            <div class="gold-program-intro"><p class="eyebrow light">Preferred seasonal care</p><h2 id="gold-program-title">The Gold Program</h2><p>One annual opening-and-closing package, plus priority when you need help through the season.</p></div>
            <div class="gold-benefits">
              <article><strong>10% seasonal savings</strong><p>Save 10% on your combined annual opening-and-closing package. The Gold annual rates are shown in the table above.</p></article>
              <article><strong>Priority scheduling</strong><p>Get preferred scheduling for your seasonal appointments and priority service when you need pool assistance.</p></article>
              <article><strong>Lower service-call fee</strong><p>Gold members pay $100 per service call instead of the standard $150, a $50 savings on the call fee. Additional work and materials are quoted separately.</p></article>
              <article><strong>Clear annual terms</strong><p>Annual payment is charged on or about February 1 only under your signed authorization. Weather and safe service conditions still apply; confirm annual pricing and dates before the charge.</p></article>
            </div>
            <p class="gold-fine-print">Gold covers standard opening and closing service. Repairs, labor, parts, specialty chemicals, extensive cleaning, travel and tax are additional. Automatic-cover mechanism repairs are excluded. We explain additional work before proceeding.</p>
            <a class="button button-coral" href="/contact/">Ask about Gold or reserve seasonal service <span aria-hidden="true">&#8594;</span></a>
          </section>
          <section class="section additional-services">
            <p class="eyebrow">More ways we can help</p><h2>Support between seasons.</h2>
            ${serviceCards([
              { title: "Equipment repair", copy: "We service pumps, heaters, filters, cleaners, automatic covers, salt systems and more.", href: "/contact/", link: "Request a repair" },
              { title: "Replacement liners", copy: "Paradise Pools replaces more than 50 vinyl liners a year, with experienced measuring and fitting.", href: "/contact/", link: "Ask about liner replacement" },
              { title: "Pool inspections", copy: "Buying or selling a home with an in-ground pool? Arrange an inspection with a qualified technician.", href: "/contact/", link: "Request an inspection" }
            ])}
          </section>
          <section class="service-callout"><div><p class="eyebrow light">Elkhart & Granger</p><h2>Reserve your<br>2027 service.</h2></div><div><p>Call the store closest to you to confirm dates, cover arrangements and service details.</p><a class="callout-phone" href="tel:${elkhart.tel}">Elkhart ${elkhart.phone}</a><a class="callout-phone" href="tel:${granger.tel}">Granger ${granger.phone}</a><a class="button button-coral" href="/contact/">Send a service inquiry <span aria-hidden="true">&#8594;</span></a></div></section>`;
      },
    },
    "automatic-covers": {
      title: "Pool Covers | Automatic, Manual & Mesh | Paradise Pools",
      description: "Explore automatic, manual and mesh pool covers from Paradise Pools in Michiana. Automatic covers are our specialty; we also install and service Coverstar systems.",
      eyebrow: "Pool covers · Automatic, manual & mesh",
      heading: "Cover your pool.\nKeep more summer.",
      intro: "Automatic pool covers are our specialty. We also offer manual and mesh covers, helping Michiana pool owners choose practical protection for their pool, routine and budget.",
      image: "https://www.coverstar.com/wp-content/uploads/2026/01/Gallery-Pics_0001_f-162-161-15633444_Snyder_Pools_Auto_Cover_Charcoal.jpg",
      imageAlt: "Coverstar automatic pool cover partially open over a backyard pool",
      render: poolCoversPage
    },
    equipment: {
      title: "Pool Equipment & Repair | Paradise Pools Michiana",
      description: "Pool equipment sales, troubleshooting and repair for pumps, heaters, filters, cleaners, salt systems and automatic covers.",
      eyebrow: "Equipment · Sales, repair & know-how",
      heading: "The right parts.\nThe right people.",
      intro: "When equipment needs attention, get guidance from a team that works with pools every day. We repair many of the systems that keep your water moving, warm and clean.",
      image: poolPhoto,
      imageAlt: "Blue swimming pool with a clean, modern finish",
      render: equipmentPage
    },
    chemicals: {
      title: "Water Care & BioGuard Pool Chemicals | Paradise Pools",
      description: "Find BioGuard and Mineral Springs water care in Elkhart and Granger. Learn what to do about green, cloudy or unbalanced pool water.",
      eyebrow: "Water care · BioGuard dealer · Elkhart & Granger",
      heading: "Water care,\nmade simpler.",
      intro: "BioGuard is more than a shelf of chemicals: its three-step approach pairs sanitizing, shock treatment and algae prevention. Paradise Pools carries BioGuard and Mineral Springs products to help Michiana pool owners care for their water.",
      image: cleanPhoto,
      imageAlt: "Bright, clean swimming pool water",
      render: waterCarePage
    },
    "about-us": {
      title: "About Paradise Pools | Serving Michiana Since 1963",
      description: "Meet Paradise Pools: a Michiana pool construction, service and supply company with more than six decades of local experience, now focused on Latham Olympia and Apollo fiberglass pools.",
      eyebrow: "A Michiana tradition · Established 1963",
      heading: "Built on good\nneighbors.",
      intro: "Since 1963, Paradise Pools has helped families around Michiana make more of their backyards. After more than 1,500 in-ground pools, our current fiberglass focus features Latham Olympia and Apollo models.",
      image: "https://www.lathampool.com/wp-content/uploads/2020/01/majesty-fiberglass-pool-01.jpg",
      imageAlt: "Latham Olympia fiberglass pool",
      render: aboutPage
    },
    locations: {
      title: "Paradise Pools Retail Locations | Elkhart & Granger, Indiana",
      description: "Visit Paradise Pools retail locations in Elkhart or Granger for experienced pool, water and equipment advice, on-site water testing and BioGuard solutions.",
      eyebrow: "Retail locations · Elkhart & Granger",
      heading: "Close by,\nall season long.",
      intro: "Our experienced retail teams know pools, water care and equipment. Bring in a water sample for on-site testing and get practical advice on the next step.",
      image: cleanPhoto,
      imageAlt: "Outdoor swimming pool in summer",
      render: retailStoresPage
    },
    contact: {
      title: "Contact Paradise Pools | Pool Quotes & Service Inquiries",
      description: "Request a pool project quote or pool service from Paradise Pools. Call our Elkhart or Granger stores, or send us a message.",
      eyebrow: "Start a conversation · We'll take it from here",
      heading: "Tell us what\nyou have in mind.",
      intro: "Planning a pool, need a repair or have a water-care question? Send a note to the team and let us know how to reach you.",
      image: poolPhoto,
      imageAlt: "Blue backyard swimming pool",
      render: contactPage
    }
  };

  const elkhart = {
    name: "Elkhart",
    phone: "(574) 264-2488",
    tel: "+15742642488",
    address: "655 County Road 17, Suite 11",
    city: "Elkhart, IN 46516",
    directions: "https://www.google.com/maps?ll=41.684287,-85.890114&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=18209573714655241702",
    hours: ["In season · April–October", "Mon–Fri 9am–5:30pm", "Saturday 9am–1pm", "Sunday closed", "Off season · November–March", "Tue–Fri 10am–5pm", "Saturday 9am–1pm", "Sunday & Monday closed"]
  };
  const granger = {
    name: "Granger",
    phone: "(574) 277-6444",
    tel: "+15742776444",
    address: "15065 State Road 23",
    city: "Granger, IN 46530",
    directions: "https://www.google.com/maps/place/Paradise+Pools/@41.7327988,-86.1628588,17z/data=!4m13!1m7!3m6!1s0x8816d19c3b87f8d7:0x6ccdbf700d5aa7f3!2s15065+IN-23,+Granger,+IN+46530!3b1!8m2!3d41.7327948!4d-86.1606701!3m4!1s0x8816d19c1ba3f8af:0xb9c063f297fe1ea2!8m2!3d41.7327677!4d-86.1604204",
    hours: ["In season · April–July", "Mon–Fri 9am–5:30pm", "Saturday 9am–1pm", "Sunday closed", "Late season · August–October", "Tue–Fri 9am–5:30pm", "Saturday 9am–1pm", "Sunday & Monday closed", "Off season · November–March", "Closed"]
  };

  function link(href, text, className = "text-link") {
    return `<a class="${className}" href="${href}">${text}</a>`;
  }

  function hero(page, isHome = false) {
    if (isHome) {
      return `<section class="home-hero" style="--hero-image:url('${poolPhoto}')"><div class="hero-shade"></div><div class="home-hero-inner"><p class="eyebrow light">Pool construction, service & supply · Michiana</p><h1>Make room<br>for <em>summer.</em></h1><p class="hero-copy">Thoughtful pool construction and dependable local care. Paradise Pools has been part of Michiana summers since 1963.</p><div class="hero-actions"><a class="button button-coral" href="/pool-construction/">Explore new pools <span aria-hidden="true">&#8594;</span></a><a class="button button-ghost" href="/service/">Pool service</a></div><div class="hero-proof"><span class="proof-number">1,500+</span><span>in-ground pools built<br>right here in Michiana</span></div></div><div class="hero-side-note"><span>EST. 1963</span><span>Family time starts here</span></div></section>`;
    }
    return `<section class="page-hero${page === pages["pool-service"] ? " pool-service-hero" : ""}"><div class="page-hero-copy"><p class="eyebrow">${page.eyebrow}</p><h1>${page.heading.replace("\n", "<br>")}</h1><p class="hero-copy">${page.intro}</p><div class="hero-actions"><a class="button button-dark" href="/contact/">Let's talk <span aria-hidden="true">&#8594;</span></a><a class="phone-inline" href="tel:${elkhart.tel}">Call Elkhart ${elkhart.phone}</a></div></div><div class="page-hero-image" style="--hero-image:url('${page.image}')"><span class="image-caption">${page.imageAlt}</span><span class="image-index">PARADISE POOLS · Michiana</span></div></section>`;
  }

  function serviceCards(items) {
    return `<div class="service-grid">${items.map((item, index) => `<article class="service-card"><span class="card-index">0${index + 1}</span><h3>${item.title}</h3><p>${item.copy}</p>${link(item.href, item.link || "Learn more")}</article>`).join("")}</div>`;
  }

  function trustBand() {
    return `<section class="trust-band"><div><span class="trust-value">1963</span><span>Serving Michiana<br>for generations</span></div><div><span class="trust-value">1,500+</span><span>In-ground pools<br>built locally</span></div><div><span class="trust-value">2</span><span>Neighborhood stores<br>in Elkhart & Granger</span></div></section>`;
  }

  function reviewSection() {
    const elkhartReviews = "https://www.google.com/maps/search/?api=1&query=Paradise+Pools+Elkhart+Indiana";
    const grangerReviews = "https://www.google.com/maps/search/?api=1&query=Paradise+Pools+Granger+Indiana";
    return `<section class="review-section"><div class="review-copy"><p class="eyebrow">Michiana, in good company</p><h2>More than a pool.<br>A place to come together.</h2><p>For over six decades, local families have trusted Paradise Pools to help make the most of home. Read what your neighbors are saying.</p></div><div class="review-links"><a href="${elkhartReviews}" target="_blank" rel="noreferrer"><span>Elkhart customer reviews</span><b aria-hidden="true">&#8599;</b></a><a href="${grangerReviews}" target="_blank" rel="noreferrer"><span>Granger customer reviews</span><b aria-hidden="true">&#8599;</b></a></div></section>`;
  }

  function homePage() {
    return `${hero(null, true)}${trustBand()}<section class="section section-intro"><div class="section-heading"><p class="eyebrow">A pool for the way you live</p><h2>Good days start<br>in the <em>backyard.</em></h2></div><div class="section-intro-copy"><p>Whether you're dreaming up a new pool or looking after the one you love, our local team brings experience, thoughtful guidance and dependable care to every season.</p>${link("/pool-construction/", "Meet your pool possibilities", "text-link arrow-link")}</div></section><section class="home-offerings"><div class="offering-main" style="--offering-image:url('${couplePhoto}')"><div class="offering-overlay"><p class="eyebrow light">Made for your kind of summer</p><h2>Room to<br><em>unwind.</em></h2>${link("/pool-construction/", "Explore new pools", "button button-light")}</div></div><div class="offering-list"><p class="eyebrow">Here for the whole pool life</p><a href="/service/"><span>01</span><strong>Pool service</strong><small>Opening, closing, repairs & more</small><b>&#8594;</b></a><a href="/automatic-covers/"><span>02</span><strong>Automatic covers</strong><small>Installation & service</small><b>&#8594;</b></a><a href="/equipment/"><span>03</span><strong>Equipment</strong><small>Repair, replacement & advice</small><b>&#8594;</b></a><a href="/pool-chemicals/"><span>04</span><strong>Water care</strong><small>BioGuard & Mineral Springs</small><b>&#8594;</b></a></div></section>${reviewSection()}<section class="home-cta"><div><p class="eyebrow light">A real person is ready to help</p><h2>Let's get your<br>pool plans <em>moving.</em></h2></div><div><p>Visit us in Elkhart or Granger, or tell us a little about what you're looking for.</p><a class="button button-coral" href="/contact/">Start a conversation <span aria-hidden="true">&#8594;</span></a></div></section>`;
  }

  function modelGallery() {
    const cards = poolModels.map((model) => {
      const facets = poolModelFacets(model);
      const depthRanges = facets.depthRanges.map(([minimum, maximum]) => `${minimum},${maximum}`).join(";");
      return `<article class="pool-model-card${model.featuredOrder ? " pool-model-card-featured" : ""}" data-model-id="${model.id}" data-featured-order="${model.featuredOrder || ""}" data-shapes="${facets.shapes.join(",")}" data-lengths="${facets.lengths.join(",")}" data-depth-ranges="${depthRanges}" data-features="${facets.features.join(",")}"><a href="${model.url}" target="_blank" rel="noreferrer">${model.featuredOrder ? `<span class="model-featured-label">Most popular</span>` : ""}<img src="${model.image}" alt="Latham ${model.name} ${model.type} fiberglass pool" loading="lazy"><span class="model-name">${model.name}</span></a><div class="model-details"><p><strong>Type</strong><span>${model.type}</span></p><p><strong>Sizes</strong><span>${model.sizes}</span></p><p><strong>Dimensions</strong><span>${model.dimensions}</span></p><p><strong>Features</strong><span>${model.features}</span></p></div><label class="model-compare-toggle"><input type="checkbox" value="${model.id}" aria-label="Add ${model.name} to pool comparison"><span>Add to compare</span></label><a class="text-link" href="${model.url}" target="_blank" rel="noreferrer">View Latham specifications <span aria-hidden="true">&#8599;</span></a></article>`;
    }).join("");
    return `<div class="pool-catalog-intro"><div><p class="eyebrow">A good place to start</p><h3>Most popular pools</h3></div><p>Start with these customer favorites, then explore the full range to find a shape and size that suits your backyard.</p></div><div class="pool-catalog-toolbar" aria-label="Filter and sort pool models"><label class="pool-filter-search">Search<input type="search" data-pool-filter="search" placeholder="Model, size or feature"></label><label>Shape<select data-pool-filter="shape"><option value="">All shapes</option><option value="rectangular">Rectangular</option><option value="freeform">Freeform</option><option value="plunge">Plunge</option></select></label><label>Size<select data-pool-filter="size"><option value="">Any size</option><option value="small">Up to 25 ft</option><option value="medium">Over 25 to 35 ft</option><option value="large">Over 35 ft</option></select></label><label>Depth<select data-pool-filter="depth"><option value="">Any depth</option><option value="5">Maximum 5 ft</option><option value="6">Maximum 6 ft</option><option value="7">Maximum 7 ft</option><option value="over-7">Includes depth over 7 ft</option></select></label><label>Feature<select data-pool-filter="feature"><option value="">Any feature</option><option value="tanning-ledge">Tanning ledge</option><option value="spa">Built-in spa</option><option value="swim-up-seating">Swim-up seating</option><option value="auto-cover">Auto-cover ready</option><option value="swim-lane">Swim lane</option><option value="wading-area">Wading area</option></select></label><label>Sort by<select data-pool-filter="sort"><option value="recommended">Recommended</option><option value="name">Name A to Z</option><option value="smallest">Smallest option</option><option value="largest">Largest option</option><option value="shallowest">Shallowest maximum depth</option><option value="deepest">Deepest maximum depth</option></select></label><button class="pool-filter-reset" type="button" data-clear-pool-filters>Clear filters</button></div><div class="pool-catalog-status"><p data-pool-results aria-live="polite">Showing ${poolModels.length} models</p></div><div class="pool-model-grid">${cards}</div><p class="pool-no-results" data-pool-empty hidden>No pools match those filters. Try changing or clearing your selections.</p><p class="model-size-note">Size and depth filters match the same listed pool size within a collection. Feature availability varies by model and option; confirm your selected combination with our team. Collections without listed depths are excluded when filtering by depth. Latham dimensions and water volumes may vary by up to 3%; measurements refer to the outside edge of the pool. Confirm current specifications and backyard fit with Paradise Pools.</p>`;
  }

  function fiberglassPoolPage() {
    return `${hero(pages["new-pools"])}${trustBand()}<section class="section fiberglass-intro"><div><p class="eyebrow">Our focus: Latham fiberglass</p><h2>One-piece strength.<br>Made for your backyard.</h2><p>Paradise Pools specializes in installing Latham fiberglass pools, with a range of shapes from clean-lined rectangles to relaxed freeforms. Choose a model, then personalize the look and features with our team.</p></div><div class="fiberglass-aside"><strong>Since 1963</strong><p>Local pool construction experience, with more than 1,500 in-ground pools built across Michiana.</p></div></section><section class="section model-section"><p class="eyebrow">Explore Latham fiberglass models</p><h2>Different shapes.<br>Same Latham craftsmanship.</h2>${modelGallery()}<p class="model-disclaimer">Model availability, dimensions and features can vary. Ask Paradise Pools about current Latham options for your site.</p></section><section class="upgrade-section"><div class="upgrade-heading"><p class="eyebrow light">Personalize your pool</p><h2>Latham upgrades<br>& available options</h2><p>Build your pool around how you want to use it. Final selections depend on model, site conditions and project scope.</p></div><div class="upgrade-grid"><div><strong>Lighting</strong><span>Extend the swim and set the evening mood.</span></div><div><strong>Heaters & heat pumps</strong><span>Choose heating equipment for your comfort and season.</span></div><div><strong>Slides</strong><span>Add a playful feature where the layout allows.</span></div><div><strong>Automatic pool cleaners</strong><span>Explore cleaner options to simplify regular upkeep.</span></div><div><strong>Water features</strong><span>Consider a waterfall, fountain or other feature.</span></div><div><strong>Salt system options</strong><span>Discuss saltwater-compatible equipment and setup.</span></div><div><strong>Finishes & colors</strong><span>Compare Latham fiberglass finishes and color choices.</span></div><div><strong>Concrete deck</strong><span>Plan the deck area around access, seating and circulation.</span></div><div><strong>Additional concrete</strong><span>Extra concrete can be discussed and is an additional cost.</span></div></div><p class="upgrade-note">Options and compatibility vary by pool model, site and equipment package. We'll review what's available for your project.</p></section><section class="section vinyl-note"><div><p class="eyebrow">Already have a vinyl liner pool?</p><h2>Liner replacement is a service.</h2><p>We replace more than 50 vinyl liners each year. Learn about liner replacement and our other pool services.</p><a class="button button-dark" href="/service/">Explore pool service <span aria-hidden="true">&#8594;</span></a></div></section><section class="bottom-cta"><div><p class="eyebrow">Ready when you are</p><h2>Let's plan your Latham pool.</h2></div><a class="button button-dark" href="/contact/">Request a fiberglass pool quote <span aria-hidden="true">&#8594;</span></a></section>`;
  }

  function equipmentPage() {
    return `${hero(pages.equipment)}<section class="section split-section"><div><p class="eyebrow">Keep the water moving</p><h2>Equipment that<br>works for you.</h2><p>Pumps, filters and heaters are the behind-the-scenes essentials of a healthy pool. Paradise Pools can help you troubleshoot, repair or explore a replacement when your system needs attention.</p><a class="button button-dark" href="/contact/">Ask about equipment <span aria-hidden="true">&#8594;</span></a></div><div class="equipment-list"><h3>We repair</h3><p>Pumps & motors</p><p>Heaters</p><p>Filters</p><p>Automatic cleaners</p><p>Salt systems</p><p>Automatic pool covers</p><p>And more</p></div></section><section class="bottom-cta"><div><p class="eyebrow">Not sure what you need?</p><h2>Describe the issue. We'll help you sort it out.</h2></div><a class="button button-coral" href="/contact/">Request a repair <span aria-hidden="true">&#8594;</span></a></section>`;
  }

      function faqSection(eyebrow, title, introduction, questions) {
        return `<section class="section faq-section"><div class="faq-heading"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${introduction}</p></div><div class="faq-list">${questions.map((item) => `<details><summary>${item.question}<span aria-hidden="true">+</span></summary><div class="faq-answer"><p>${item.answer}</p>${item.image ? `<img class="faq-product-image" src="${item.image}" alt="${item.imageAlt}" loading="lazy">` : ""}${item.link ? `<a class="text-link" href="${item.link.href}">${item.link.label} <span aria-hidden="true">&#8594;</span></a>` : ""}</div></details>`).join("")}</div></section>`;
      }

      function waterCareFaq() {
        return faqSection("Water care questions", "Clear answers for clearer water.", "Water problems can have more than one cause. Test first, then match the next step to your pool and its equipment.", [
          { question: "How often should I test my pool water?", answer: "BioGuard recommends testing when you open and close your pool, then every two weeks in season or at least once a month. Test again after heavy use, storms or a noticeable change in the water. Bring a sample to an Elkhart or Granger retail location for on-site testing and help interpreting the results." },
          { question: "What should I do if my pool water turns cloudy?", answer: "Check sanitizer and water balance, and make sure the pump and filter are circulating properly. Organic contaminants can contribute to cloudy water; after testing, the team may recommend a BioGuard shock such as Smart Shock. Follow the product label for your pool and sanitation system.", image: "https://dpbvj4a9anukr.cloudfront.net/303ea2c8-8d4b-4eaa-916a-124b41d84728/ff73366c-3241-497a-ad7a-7dc8668c5ff2/24362d65c32110d487a5a879addfaae4/shock-product-feature.png", imageAlt: "BioGuard Smart Shock product visual" },
          { question: "The water looks dirty. Should I add chemicals?", answer: "Leaves, grit and visible debris need physical cleaning first: empty skimmer and pump baskets, brush surfaces, and vacuum as appropriate. If the water stays hazy after circulation and cleaning, bring in a sample so the water can be tested before selecting BioGuard treatment." },
          { question: "What if the pool is green or has algae?", answer: "Remove debris and test the water, then identify the type of algae before treating it. BioGuard Algae Complete is one product option for algae prevention and treatment; the appropriate choice depends on the test results, pool surface and sanitation system.", image: "https://dpbvj4a9anukr.cloudfront.net/303ea2c8-8d4b-4eaa-916a-124b41d84728/ff73366c-3241-497a-ad7a-7dc8668c5ff2/d75f57a6ac902f03dff37783bda41fab/algae-product-feature.png", imageAlt: "BioGuard algae-care product visual" },
          { question: "What if my pH or water balance is off?", answer: "Have the sample tested before adding a balancer. BioGuard offers products for adjusting pH and total alkalinity in either direction; the right one depends on the test results and the pool's sanitation system.", image: "https://dpbvj4a9anukr.cloudfront.net/303ea2c8-8d4b-4eaa-916a-124b41d84728/ff73366c-3241-497a-ad7a-7dc8668c5ff2/b82f3ccfea543e5bff307bfbf4fee33d/balancer-product-feature.png", imageAlt: "BioGuard water-balancing product visual" },
          { question: "Can I combine pool chemicals to clear water faster?", answer: "No. Never mix pool chemicals together or combine products in a container. Use one product at a time as directed on its label, and ask the retail team to review your test results if you're unsure what to add." },
          { question: "When should I ask for in-store help?", answer: "Bring a fresh water sample when you see a persistent color, clarity or comfort problem, or before making a major water adjustment. The Elkhart and Granger teams can test the sample on site and discuss BioGuard or Mineral Springs solutions." }
        ]);
      }

      function equipmentFaq() {
        return faqSection("Pool equipment help", "Common problems, safer next steps.", "A few observations can help our technicians narrow down a repair. Don't open electrical, gas or pressurized equipment; contact us when a problem persists or a safety device trips.", [
          { question: "The pump won't start. What can I check?", answer: "Check that the timer or controller is set to run and look for a tripped breaker or GFCI. If a breaker trips again, leave it off and call for service. Don't open the motor, wiring or control panel." },
          { question: "The pump runs, but water flow is weak or bubbles appear. What does that mean?", answer: "A low pool water level, full skimmer basket, clogged pump basket or restricted filter can reduce flow. Turn equipment off before opening a basket or filter, and never let a pump run dry. If flow doesn't return after safe basic checks, request a service visit." },
          { question: "Why is filter pressure rising or the return flow dropping?", answer: "The filter may need cleaning or backwashing according to its type and manufacturer instructions. A blocked basket, closed valve or circulation issue can also affect flow. If pressure stays abnormal after routine maintenance, stop and have the system inspected." },
          { question: "The heater won't heat the pool. Should I restart it?", answer: "Confirm the pool is circulating and check the thermostat or controller setting. Error codes, repeated shutdowns, gas odor or electrical issues need a qualified technician. Don't remove heater panels or attempt gas or electrical repairs." },
          { question: "My salt system shows a warning or low output. What should I do?", answer: "Check the display message and make sure the system has normal circulation. Test the water independently; a control reading does not replace a water test. Cell cleaning and maintenance must follow the equipment manual. Contact us for persistent warnings or compatibility questions." },
          { question: "My automatic cover stops or moves unevenly. Can I force it?", answer: "No. Stop operating it, keep people clear of the mechanism, and check only for an obvious obstruction without reaching into the tracks. Don't bypass switches or adjust the drive system. Paradise Pools services automatic covers, including Coverstar systems." }
        ]);
      }

      function poolCoversPage() {
    return `${hero(pages["automatic-covers"])}
      <section class="section split-section">
        <div>
          <p class="eyebrow">Our specialty: automatic pool covers</p>
          <h2>More time covered.<br>More time to swim.</h2>
          <p>A pool cover helps keep out leaves and debris, limit evaporation and reduce heat loss when the pool is closed. Automatic covers make everyday use easier, and a properly closed, secured cover adds a layer of protection when the pool is unattended.</p>
          <p>Paradise Pools installs and services automatic pool covers, including Coverstar systems. A pool cover is not a substitute for required fencing, alarms or adult supervision.</p>
          <button type="button" class="button button-dark" data-scroll-to="cover-options-title">Explore track, control &amp; fabric options <span aria-hidden="true">&#8595;</span></button>
        </div>
        <div class="cover-facts">
          <div><strong>Less upkeep</strong><span>Help keep leaves and debris out between swims.</span></div>
          <div><strong>Hold heat</strong><span>Reduce heat loss and evaporation when the cover is closed.</span></div>
          <div><strong>Easy routine</strong><span>Open and close with less hands-on effort than a manual cover.</span></div>
        </div>
      </section>
      ${coverstarOptions()}${coverStateGallery(pages["automatic-covers"], coverClosedPhoto)}
      ${coverstarBenefits()}
      <section class="section section-centered">
        <p class="eyebrow">Choose the cover that fits your pool</p>
        <h2>One pool. A few good options.</h2>
        ${serviceCards([
          { title: "Automatic covers", copy: "Our specialty. Push-button convenience for regular use, plus less debris and reduced evaporation when closed. Paradise Pools installs and services Coverstar systems.", href: "/contact/", link: "Ask about automatic covers" },
          { title: "Manual covers", copy: "A practical option when you prefer hands-on operation. We can help match a manual cover to your pool and how you plan to use it.", href: "/contact/", link: "Explore manual covers" },
          { title: "Mesh covers", copy: "Mesh lets rainwater pass through while helping keep leaves and larger debris out. Ask about fit, anchoring and the cover's intended seasonal use.", href: "/contact/", link: "Ask about mesh covers" }
        ])}
        <p class="form-privacy">Cover fit, anchoring and product rating matter. A cover is not a replacement for required pool barriers or active adult supervision.</p>
      </section>
      <section class="bottom-cta"><div><p class="eyebrow">Automatic, manual or mesh</p><h2>Let's find your cover solution.</h2></div><a class="button button-dark" href="/contact/">Ask about pool covers <span aria-hidden="true">&#8594;</span></a></section>`;
  }

  function waterCarePage() {
    return `${hero(pages.chemicals)}
      <section class="section split-section">
        <div>
          <p class="eyebrow">Water care you can feel good about</p>
          <h2>BioGuard is a<br>care system, not<br>just a chemical.</h2>
          <p>Consistent water care helps protect swimmers, keep water comfortable and clear, and avoid preventable wear on pool surfaces and equipment. BioGuard's three-step program starts with sanitizer, follows with shock to remove contaminants, and includes algae control and prevention.</p>
          <p>Paradise Pools carries BioGuard and Mineral Springs products. Visit one of our retail locations for regular on-site water testing and a product plan matched to your pool.</p>
          <a class="button button-dark" href="/locations/">Visit a retail location for more help <span aria-hidden="true">&#8594;</span></a>
        </div>
        <div class="chemical-note">
          <span class="chemical-wordmark">BioGuard</span>
          <p>Test first, then choose care for your pool's actual needs. BioGuard ALEX water analysis evaluates parameters together to help avoid guesswork and unnecessary treatments.</p>
          <a href="https://bioguard.com/pool-answers/troubleshooting" target="_blank" rel="noreferrer">BioGuard water problem guide <span aria-hidden="true">&#8599;</span></a>
          <a href="https://bioguard.com/bioguard-alex-professional-water-testing" target="_blank" rel="noreferrer">How ALEX water testing works <span aria-hidden="true">&#8599;</span></a>
        </div>
      </section>
      <section class="section section-centered">
        <p class="eyebrow">BioGuard's three-step approach</p><h2>Clear water is a routine.</h2>
        ${serviceCards([
          { title: "1 · Sanitize", copy: "A sanitizer helps control bacteria and algae and is the foundation of routine pool care. Match the sanitizer to your pool and equipment.", href: "https://bioguard.com/pool-products/sanitizers-to-clean-water", link: "Explore BioGuard sanitizers" },
          { title: "2 · Shock", copy: "Shock oxidizes organic contaminants from swimmers and the environment, and can help restore clarity. Use as part of routine care, not only after a problem appears.", href: "https://bioguard.com/pool-products/shock-to-remove-contaminants", link: "Explore BioGuard shock" },
          { title: "3 · Prevent algae", copy: "Algae control is its own step; sanitizer and shock alone may not prevent every type of growth. The right treatment depends on the algae and pool.", href: "https://bioguard.com/pool-products/algae-killing-and-prevention", link: "Explore BioGuard algae care" }
        ])}
      </section>
      <section class="section split-section">
        <div><p class="eyebrow">Start with what you see</p><h2>Common water problems.<br>A smarter next step.</h2><p>Color and cloudiness are clues, not a complete diagnosis. Test the water before choosing a treatment, and follow the product label for your pool type.</p></div>
        <div class="split-note">
          <h3>Green water or visible algae</h3><p>Check sanitizer and water balance, then use BioGuard algae care matched to the type of growth. BioGuard offers products for prevention as well as problem algae.</p>
          <h3>Cloudy or hazy water</h3><p>Check sanitizer, water balance and filtration. BioGuard shock helps oxidize swimmer and environmental contaminants that contribute to cloudy water.</p>
          <h3>Scale, staining or irritation</h3><p>These can have different causes. An on-site water analysis can look at pH, minerals and related factors before you add a corrective product.</p>
          <p>Bring a water sample to either retail location for frequent testing and a BioGuard product recommendation based on the results. Product selection depends on pool surface, sanitation system and test results.</p>
        </div>
      </section>
      <section class="feature-strip"><img src="${cleanPhoto}" alt="Clear water in a Latham fiberglass pool" loading="lazy"><div><p class="eyebrow light">Bring us your water questions</p><h2>Let's get the<br>water right.</h2><p>Ask about BioGuard, Mineral Springs, on-site water testing and the right supplies for your pool.</p><a class="button button-light" href="/locations/">Visit a retail location for more help <span aria-hidden="true">&#8594;</span></a></div></section>`;
  }

  function retailStoresPage() {
    return `${hero(pages.locations)}
      <section class="section retail-expertise">
        <p class="eyebrow">Experienced pool people, close to home</p>
        <h2>Bring your questions.<br>Leave with a plan.</h2>
        <p>Our Elkhart and Granger retail teams bring years of hands-on knowledge about pools, water care and equipment. Stop in for regular on-site water tests: test results can point to the right BioGuard chemicals and a clear next step for your pool.</p>
        <a class="button button-dark" href="/pool-chemicals/">Explore BioGuard water care <span aria-hidden="true">&#8594;</span></a>
      </section>
      <section class="locations-grid">${locationCard(elkhart)}${locationCard(granger)}</section>
      <section class="section visit-note"><p class="eyebrow">Two retail locations · One local team</p><h2>Pool, water and equipment<br>know-how since 1963.</h2><p>Bring a water sample when you visit. Our team can test it on site and help you understand what your water needs, including BioGuard and Mineral Springs options.</p></section>
      ${reviewSection()}`;
  }

  function aboutPage() {
    return `${hero(pages["about-us"])}${trustBand()}
      <section class="section split-section"><div><p class="eyebrow">Built in Michiana</p><h2>Six decades of<br>poolside know-how.</h2></div><div class="split-note"><p>Paradise Pools has built over 1,500 in-ground swimming pools in Michiana since 1963. Our history includes gunite, vinyl liner and fiberglass installations; today, we focus on Latham fiberglass pools, including Olympia and Apollo.</p><p>We take pride in listening to what each homeowner wants now and helping them think through what they'll need for the years ahead. Our team is here for construction, pool care, equipment and supplies.</p></div></section>
      <section class="section story-model-section"><p class="eyebrow">Latham fiberglass pools</p><h2>Olympia and Apollo.</h2><p class="story-model-intro">Two distinct Latham fiberglass models, chosen for the way families want to use their backyard.</p><div class="story-model-grid"><article class="story-model-card"><a href="https://www.lathampool.com/products/olympia-14/" target="_blank" rel="noreferrer"><img src="https://www.lathampool.com/wp-content/uploads/2020/01/majesty-fiberglass-pool-01.jpg" alt="Latham Olympia fiberglass pool" loading="lazy"><span class="model-name">Olympia</span></a><div class="model-details"><p><strong>Type</strong><span>Rectangular fiberglass pool</span></p><p><strong>Sizes</strong><span>Olympia 12, 14 and 16 options</span></p><p><strong>Details</strong><span>Compare the selected shell's dimensions and features in Latham's current specifications.</span></p></div><a class="text-link" href="https://www.lathampool.com/products/olympia-14/" target="_blank" rel="noreferrer">View Olympia specifications <span aria-hidden="true">&#8599;</span></a></article><article class="story-model-card"><a href="https://www.lathampool.com/products/apollo-14/" target="_blank" rel="noreferrer"><img src="https://www.lathampool.com/wp-content/uploads/2024/11/Apollo-video.jpg" alt="Latham Apollo fiberglass pool" loading="lazy"><span class="model-name">Apollo</span></a><div class="model-details"><p><strong>Type</strong><span>Rectangular fiberglass pool</span></p><p><strong>Sizes</strong><span>Apollo 14 and 16 options</span></p><p><strong>Apollo 14</strong><span>13 ft 10 in x 32 ft; depth 3 ft 6 in to 6 ft 1 in.</span></p><p><strong>Features</strong><span>Tanning ledge, swim-up seating and automatic-cover-ready option.</span></p></div><a class="text-link" href="https://www.lathampool.com/products/apollo-14/" target="_blank" rel="noreferrer">View Apollo specifications <span aria-hidden="true">&#8599;</span></a></article></div><p class="model-disclaimer">Pool imagery and finishes are illustrative; final dimensions, options and availability depend on the selected Latham model and site. We'll help you compare the fit for your backyard.</p></section>
      <section class="home-cta"><div><p class="eyebrow light">The right pool is personal</p><h2>Let's plan your<br>Latham pool.</h2></div><div><p>Tell us about your backyard and we'll help you explore Olympia, Apollo and the options that fit your home.</p><a class="button button-coral" href="/pool-construction/">Explore pool models <span aria-hidden="true">&#8594;</span></a></div></section>${reviewSection()}`;
  }

  function locationCard(location) {
    return `<article class="location-card"><div class="location-card-top"><p class="eyebrow">Paradise Pools · ${location.name}</p><h2>${location.name}</h2><a class="location-phone" href="tel:${location.tel}">${location.phone}</a></div><address>${location.address}<br>${location.city}</address><a class="text-link" href="${location.directions}" target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">&#8599;</span></a><div class="location-hours"><h3>Store hours</h3>${location.hours.map((hour) => `<p>${hour}</p>`).join("")}</div></article>`;
  }

  function contactPage() {
    return `${hero(pages.contact)}<section class="contact-layout">${quoteForm()}<aside class="contact-aside"><p class="eyebrow">Rather talk it through?</p><h2>We're right here.</h2><p>Reach the store that's closest to you. For seasonal hours or product availability, a quick call is always a good idea.</p><a class="contact-number" href="tel:${elkhart.tel}"><small>ELKHART</small>${elkhart.phone}</a><a class="contact-number" href="tel:${granger.tel}"><small>GRANGER</small>${granger.phone}</a><a class="contact-email" href="mailto:service@thinkparadisepools.com">service@thinkparadisepools.com</a><p class="contact-hours-note">Serving Michiana with pool construction, service and supplies since 1963.</p></aside></section>`;
  }


// Render at build time so page content is available before JavaScript runs.
export function renderPage(route) {
  let content = pages[route].render();
  if (route === 'chemicals') content += waterCareProductSection() + waterCareFaq() + waterCareVideoSection();
  if (route === 'equipment') content += equipmentFaq() + '<section class="faq-follow-up"><p>Still can’t get it to work?</p><a class="button button-coral" href="/contact/">Schedule a service call today <span aria-hidden="true">&#8594;</span></a></section>';
  if (route === 'new-pools') content += poolCompareControls() + poolReviewSection(poolModels);
  return content;
}

# Paradise Pools

Website source owned by Dan's GitHub account. The local `bryan/astro-local` branch begins the Astro conversion of his original design. It is a work in progress, not a production-ready release.

## Local preview

Use Node.js **22.23.4 or newer** (the version in `.nvmrc` is tested), then run:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/. Astro serves the pages and refreshes the preview when files change. VS Code's plain HTML Live Server does not build this Astro version.

If using nvm, run `nvm install` and `nvm use` first. If your existing Node version is too old and you don't want to change it globally, you can use a temporary runtime:

```sh
npm exec --yes --package=node@22.23.4 -- npm ci
npm exec --yes --package=node@22.23.4 -- npm run dev
```

To check the generated static website:

```sh
npm run build
npm run check:site
npm test
npm run preview
```

Stop the development process with Ctrl+C. Astro 7's preview server can run in the background; use `npx astro preview stop` to stop that server.

## Forms on Cloudflare Pages

The approved architecture is a static Astro site on **Cloudflare Pages**, with **Pages Functions** for `/api/contact` and `/api/feedback`, plus a homepage function for confirmed legacy WordPress shortcuts. These functions use the Workers runtime within the Pages project. A separate Workers-hosted website is not needed. Resend sends the form notification emails; it does not host the business mailboxes.

Astro's preview on port 4173 serves the website only. To include the local Pages Functions runtime:

```sh
npm run build
npm run preview:functions
```

Open http://127.0.0.1:4174/. Stop this local runtime with Ctrl+C. Rebuild after changing Astro content or browser scripts; Wrangler watches the built files and function source.

Configuration, when approved accounts are ready:

1. Copy `.env.example` to `.env`. Set `PUBLIC_TURNSTILE_SITE_KEY` to the public Turnstile site key and rebuild. Keep `PUBLIC_SITE_INDEXABLE=false` for previews.
2. Copy `.dev.vars.example` to `.dev.vars` for local function settings. Keep this file out of Git. Set the Resend API key, Turnstile secret key, and verified sender address. Neither secret belongs in a `PUBLIC_` variable.
3. Set `CONTACT_TO_EMAIL` and `FEEDBACK_TO_EMAIL`. The agreed destination for both is `service@thinkparadisepools.com`; forwarding remains the mailbox provider's responsibility.
4. Set `FORM_ALLOWED_ORIGINS` to explicit approved origins, including the port when testing locally. Use only a controlled test inbox for the first real delivery checks. Register the appropriate hostnames in Turnstile.
5. For the eventual Pages deployment, configure the public site key as a build variable and private function settings as runtime secrets/variables. Separate preview and production settings; previews must not silently send real customer inquiries.

Without the public site key, the page disables submission and offers phone/email contact. Without valid server settings, the endpoint returns an unavailable response. Tests mock Turnstile and Resend: passing tests do **not** establish real inbox delivery. Public dummy Turnstile secrets are refused outside loopback hosts, and real verification always checks the hostname and form action. Configure real keys and test both inbox delivery and Reply before launch.

The handlers validate fields and request size, verify Turnstile on the server, check the origin and honeypot, keep recipients server-controlled, and use Resend idempotency keys for retries. No form contents or credentials are logged by the handler. Error messages preserve the visitor's input. Additional hosting security and operational monitoring remain part of the launch review.

## Legacy URLs and local redirect checks

Keep the current page addresses whenever their content is retained. Redirects currently cover:

- Eight confirmed WordPress `/?p=...` shortcuts in `src/data/legacy-shortlinks.js`. `functions/index.js` redirects GET/HEAD requests to the retained page with status 301, removing only `p` and preserving other query values. Destinations stay on the current host, so local previews do not send visitors to production.
- `/sitemap_index.xml` and `/page-sitemap.xml` redirect to `/sitemap.xml` with 301 rules in `public/_redirects`. The sitemap still represents the prepared preview; the remaining legacy-page decisions must be resolved before launch.
- Cloudflare Pages already normalizes directory paths such as `/photo-gallery` to `/photo-gallery/` with permanent 308 redirects. Do not add redundant rules or redirect retained canonical pages.

Cloudflare's static redirect file cannot match query parameters. `public/_routes.json` therefore invokes Functions for `/` and `/api/*` only. Ordinary homepage requests pass through to the built HTML but do count as Function requests; the other pages/assets remain static. Review the final account's request allowance, failure behavior and caching before launch. Do not apply a query-ignoring cache rule to the homepage. [Pages routing documentation](https://developers.cloudflare.com/pages/functions/routing/) and [redirect documentation](https://developers.cloudflare.com/pages/configuration/redirects/).

After building, start or restart the local Pages runtime (especially when first adding `_redirects` or changing routing configuration), then run in another terminal:

```sh
npm run check:redirects
# If the test runtime uses a different port:
npm run check:redirects -- --base=http://127.0.0.1:4175 --report=output/redirect-review/http-checks.json
```

Astro preview on port 4173 does not implement the Pages redirect/function rules. The check command only accepts loopback hosts, follows each redirect one hop, verifies the actual final page/canonical, and never submits forms. The test expects a noindex preview build.

WordPress IDs `6141`, `6745` and `6173` still need content decisions for program terms, chemical orders and image-use information. They are intentionally unmapped and currently fall through to the homepage; this is an explicit unfinished migration item, not a correct replacement or retirement. Unknown/ambiguous IDs also have no guessed redirect. Unresolved page paths and genuinely missing URLs remain 404. Domain-level HTTPS/www rules and additional URLs/media discovered in the existing host's export still need production/access review. Do not add a catch-all homepage redirect.

## Where to edit

- `src/layouts/SiteLayout.astro`: shared document structure, metadata, fonts, and structured business information.
- `src/components/Header.astro` and `Footer.astro`: shared navigation, logo, and footer.
- `src/content/pages.js`: existing page copy and HTML templates rendered at build time. This preserves the supplied design during the first migration pass; further component extraction can be incremental.
- `src/content/forms.js`: contact and owner feedback form markup.
- `src/content/images.js` and `src/data/images.json`: build-time mapping from the supplied image URLs to local responsive assets.
- `src/data/pools.js`: supplied pool catalog and its filter attributes.
- `src/data/routes.js`: public page addresses. Existing core paths are retained where they clearly match. Review the full legacy URL map before launch.
- `src/scripts/`: menu, tabs, pool comparison/filter behavior, and form submission states.
- `functions/api/` and `src/server/submissions.js`: Pages Functions entrypoints and shared validation/email handling.
- `tests/`: pool-filter, legacy-shortlink and form-handler regression tests with mocked email providers.
- `src/styles/site.css`: existing design styles and scoped responsive/accessibility fixes.
- `public/assets/`: supplied logo and optimized website images. Original source URLs remain in the content and image manifest for provenance.
- `legacy/`: original four files retained unchanged for reference. The original version is also at commit `aacd93c` on `main`. These files are not deployed by Astro.

Astro currently generates 14 complete HTML pages: the nine supplied views plus retained store, gallery, seasonal-service and privacy pages. Small browser scripts add interactions; they no longer assemble the entire website after loading.

## Updating images

The existing 86 remote images have been checked and copied locally, with responsive versions up to 480, 960 and 1600 pixels (never upscaled). Most versions are WebP; an already smaller original is kept at its native size rather than increasing its download. The photographs, product art, colors and crop rules are unchanged. Image rights and manufacturer permissions still require the planned client review before publishing.

After changing an image URL in the content, run `npm run prepare:images`, then build and run `npm run check:site`. The preparation command downloads originals into ignored `tmp/image-originals/`, generates files under `public/assets/images/`, and updates `src/data/images.json`. Commit the generated assets and manifest together when sharing is authorized. Regular builds use those files and do not download remote images. To refresh an existing source URL, remove its matching file from the temporary cache before preparing images again; review any obsolete generated assets before removing them.

The build checks verify local image files, responsive sources, gallery alternatives and reserved dimensions. The private review record contains browser screenshots and measurements. These checks do not replace a real-device review or measure production Core Web Vitals.

## Preserving older images and downloads

`public/wp-content/uploads/` retains **385 original image files** at their exact existing paths, including the 16 gallery originals retained earlier. These cover 386 captured image URL references (including query variants), totaling 26,522,922 bytes. `src/data/legacy-media.json` records the public source URLs, dimensions, byte counts and SHA-256 hashes. The original files are not recompressed or renamed; old image links need no redirect. They do not replace the optimized images used by the new design or cause all originals to load with each page.

The bounded November 11 review covered 13 previously inventoried page destinations. No linked PDFs, brochures or other downloads were found there. One generated WordPress menu stylesheet was excluded because the Astro site does not use it. This capture is **not a complete WordPress export**: reconcile RGB's full media/download backup, unlinked files and attachment URLs, and confirm image rights before publication.

`npm run check:site` verifies that all recorded originals are copied unchanged into `dist`. To fully decode the images and check their actual responses in a running local Pages preview:

```sh
npm run check:media -- --base=http://127.0.0.1:4174
```

Omit `--base` for file integrity/decoding only. The command accepts loopback hosts only and never contacts production. It checks every recorded query variant, correct image types and bytes, and a genuine 404 for a missing image. Use `--report=output/media-preservation-review/local-verification.json` to save private results. Recheck any new files received from RGB before adding their manifest entries; do not redirect missing media wholesale to the homepage.

## Working together in GitHub and VS Code

1. Clone `https://github.com/ddeboer99/Paradise-Pools.git` into VS Code and edit that cloned folder. Keep any original local copy as a reference.
2. Pull the latest changes before starting. Save/commit unfinished changes before switching branches.
3. Use a branch such as `dan/update-content` or `bryan/navigation-fixes`.
4. Preview, review the diff, and commit with a short description.
5. When sharing is authorized, push the branch and open a pull request for review before merging into `main`.
6. After a merge, switch to `main` and pull. Resolve conflicts together; do not force-push or overwrite the other person's work.

Collaborator access alone does not enforce approval. Configure the review process separately. GitHub does not share unsaved edits or deploy this site automatically.

## Current stage and launch gates

The November 11 local head start is authorized. Hold the new branch off GitHub until Bryan confirms the deposit. Do not connect production hosting or change DNS as part of local preview work.

- The nine-page Astro foundation, supplied logo, ordinary page/section navigation, and scroll-stable mobile menu are implemented locally.
- Catalog parsing, combined size/depth filters, feature matching, and depth sorting are corrected and regression-tested against the supplied data. This is not a manufacturer specification audit: feature tags remain collection-level, and collections without known depths are excluded when filtering by depth.
- Both forms now use Pages Functions with server-side validation, Turnstile verification, and Resend handling. Real accounts/keys, sending-domain verification, and actual inbox delivery tests remain outstanding. Never put a Resend key in browser code.
- The original nine pages have local layout checks at 320, 390, 620, 768, 901, 1024, 1100 and 1440 pixels. Narrow-screen catalog controls, headings, navigation and About-page labels are corrected; forms use larger controls, and scrollable tables have keyboard access. Real iPhone/Android checks, a full accessibility audit, and content/metadata review remain open.
- The existing store, gallery, seasonal-service and privacy paths are retained locally, together with the core live routes and original construction/service section IDs. Nine of the twelve captured working live paths now exist; the privacy page remains a review draft. Eight WordPress shortcuts and the two old sitemap addresses have local redirect handling. The 385 captured legacy image files are preserved and verified locally. Three legacy page/shortcut decisions, RGB export/download completeness, media rights and human content approval remain open; the 14-page sitemap is not the final migration inventory.
- All builds default to `noindex, nofollow`. Only set `PUBLIC_SITE_INDEXABLE=true` for the approved production build after the launch checks pass. Leave it unset/false for previews; inspect the generated HTML and hosting headers before connecting the domain.
- Hosting/domain ownership, email handover, real form delivery, legacy redirects, backup/rollback, and post-launch Search Console checks remain open.
- The supplied images now load locally with responsive sizes, dimensions and lazy loading where appropriate. Their largest variants total about 26% fewer bytes than the downloaded originals; this is an asset-size comparison, not a measured page-speed score. Fonts still load from Google Fonts. Image rights, fonts, production caching and field performance remain part of launch review.

Private checklist, SEO evidence, proposals, and call notes live in the ignored `output/` folder. Keep credentials and client records outside this public repository. Use `.env.example` only for non-secret setup instructions.

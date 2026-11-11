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

The approved architecture is a static Astro site on **Cloudflare Pages**, with **Pages Functions** for `/api/contact` and `/api/feedback`. These functions use the Workers runtime within the Pages project. A separate Workers-hosted website is not needed. Resend sends the form notification emails; it does not host the business mailboxes.

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

## Where to edit

- `src/layouts/SiteLayout.astro`: shared document structure, metadata, fonts, and structured business information.
- `src/components/Header.astro` and `Footer.astro`: shared navigation, logo, and footer.
- `src/content/pages.js`: existing page copy and HTML templates rendered at build time. This preserves the supplied design during the first migration pass; further component extraction can be incremental.
- `src/content/forms.js`: contact and owner feedback form markup.
- `src/data/pools.js`: supplied pool catalog and its filter attributes.
- `src/data/routes.js`: public page addresses. Existing core paths are retained where they clearly match. Review the full legacy URL map before launch.
- `src/scripts/`: menu, tabs, pool comparison/filter behavior, and form submission states.
- `functions/api/` and `src/server/submissions.js`: Pages Functions entrypoints and shared validation/email handling.
- `tests/`: pool-filter regression cases and form-handler tests with mocked providers.
- `src/styles/site.css`: existing design styles and scoped responsive/accessibility fixes.
- `public/assets/`: local assets, including the supplied logo.
- `legacy/`: original four files retained unchanged for reference. The original version is also at commit `aacd93c` on `main`. These files are not deployed by Astro.

Astro generates the nine views as complete HTML pages. Small browser scripts add interactions; they no longer assemble the entire website after loading.

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
- The affected form/catalog layouts have local browser checks. Full responsive/accessibility review, image performance, and content/metadata review still need completion.
- Existing separate store pages and other legacy URLs must be reconciled before launch. The current sitemap only lists the nine converted views; it is not the final migration inventory.
- All builds default to `noindex, nofollow`. Only set `PUBLIC_SITE_INDEXABLE=true` for the approved production build after the launch checks pass. Leave it unset/false for previews; inspect the generated HTML and hosting headers before connecting the domain.
- Hosting/domain ownership, email handover, real form delivery, legacy redirects, backup/rollback, and post-launch Search Console checks remain open.
- Many images and fonts still load from external services. Their reliability, sizes, and licensing need the planned review.

Private checklist, SEO evidence, proposals, and call notes live in the ignored `output/` folder. Keep credentials and client records outside this public repository. Use `.env.example` only for non-secret setup instructions.

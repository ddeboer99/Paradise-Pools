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
npm run preview
```

Stop the development process with Ctrl+C. Astro 7's preview server can run in the background; use `npx astro preview stop` to stop that server.

## Where to edit

- `src/layouts/SiteLayout.astro`: shared document structure, metadata, fonts, and structured business information.
- `src/components/Header.astro` and `Footer.astro`: shared navigation, logo, and footer.
- `src/content/pages.js`: existing page copy and HTML templates rendered at build time. This preserves the supplied design during the first migration pass; further component extraction can be incremental.
- `src/data/pools.js`: supplied pool catalog and its filter attributes.
- `src/data/routes.js`: public page addresses. Existing core paths are retained where they clearly match. Review the full legacy URL map before launch.
- `src/scripts/`: menu, tabs, pool comparison/filter behavior, and temporary form behavior.
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
- Catalog filter correctness, full responsive/accessibility review, image performance, and content/metadata review still need completion.
- Forms retain their original email-app behavior. Resend, server-side validation/spam protection, and real delivery testing are not configured yet. Never put a Resend key in browser code.
- Review the server-side form approach before implementation: Cloudflare Pages Functions run on the Workers runtime. Pages static hosting alone cannot safely call Resend with a private key.
- Existing separate store pages and other legacy URLs must be reconciled before launch. The current sitemap only lists the nine converted views; it is not the final migration inventory.
- All builds default to `noindex, nofollow`. Only set `PUBLIC_SITE_INDEXABLE=true` for the approved production build after the launch checks pass. Leave it unset/false for previews; inspect the generated HTML and hosting headers before connecting the domain.
- Hosting/domain ownership, email handover, real form delivery, legacy redirects, backup/rollback, and post-launch Search Console checks remain open.
- Many images and fonts still load from external services. Their reliability, sizes, and licensing need the planned review.

Private checklist, SEO evidence, proposals, and call notes live in the ignored `output/` folder. Keep credentials and client records outside this public repository. Use `.env.example` only for non-secret setup instructions.

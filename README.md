# Paradise Pools

Shared source code for the Paradise Pools website, owned by Dan's GitHub account. This is the existing HTML, CSS, and JavaScript site; the planned improvements and Astro conversion have not been implemented here yet.

## Files

- `index.html`: page shell, navigation, and metadata.
- `styles.css`: site layout and styling.
- `app.js`: page content, pool catalog, navigation, and interactions.
- `integrations.js`: browser events and hooks for future integrations.

There is currently no package installation or build step.

## Get a local copy in Visual Studio Code

1. Install Git if it is not already installed and sign in to GitHub in VS Code with your own account.
2. Open the Command Palette and choose **Git: Clone**.
3. Paste `https://github.com/ddeboer99/Paradise-Pools.git`.
4. Choose a local folder and open the cloned project.
5. Make future edits in this cloned folder so Git can track and share them. Keep the original local files as a backup. If they contain newer work, compare it before copying changes into the shared project.

Bryan's existing project folder is already connected to this repository after the initial upload; he does not need to clone it again.

## Preview locally

With Python 3 installed, open a terminal in the project folder and run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

On Windows, use `py -m http.server 4173 --bind 127.0.0.1` if `python3` is unavailable.

Open <http://127.0.0.1:4173/#/home>. Press Ctrl+C in the terminal to stop the preview. VS Code's Live Server extension is another way to preview the site.

## Working together

- Before starting work, use **Source Control > ... > Pull** to get the latest committed changes. Start with a clean working folder; save and commit unfinished changes before switching branches or pulling.
- For ongoing changes, create a separate branch with a descriptive name (for example, `dan/update-content` or `bryan/navigation-fixes`). This lets both people work without changing each other's shared version immediately.
- Edit and preview locally, review the changed files in Source Control, and commit with a short description.
- Push or publish the branch, then open a pull request on GitHub so the other person can review it before merging into `main`.
- After a merge, switch back to `main` and pull before starting the next change. If Git reports a conflict, resolve it together rather than overwriting the other person's work or force-pushing.

GitHub shares committed code; it does not automatically share unsaved local edits. This repository setup does not deploy the site or change the current live website.

## Current limitations

- The supplied files reference `assets/paradise-pools-logo.png`, but the logo file has not been supplied in this project.
- Forms still need production delivery setup and testing; Resend and a secure submission handler are not configured.
- Navigation, pool filtering, and responsive behavior still need the planned fixes and verification before launch.
- Some images and fonts load from external services and require an internet connection.

Keep credentials out of the repository. Private proposals, call notes, local settings, and generated files are excluded through `.gitignore`.

# GitHub Setup

## Automated

- Public repository at `resistdesign/viuwu`.
- `main` as the default branch.
- Pull request branch for the bootstrap milestone.
- CI for formatting, linting, type checks, tests, and site build.
- GitHub Pages artifact deployment on pushes to `main`.
- GitHub Pages configured to use Actions at `https://resistdesign.github.io/viuwu/`.
- `main` protected with required pull requests, `Quality`, conversation resolution, and blocked
  force pushes/deletion.

## Repository Settings

Pages must use **GitHub Actions** as its source. The deployment workflow publishes the Vite output
at the project URL.

`main` is protected with:

- Require a pull request before merging.
- Dismiss stale approvals.
- Require the `Quality` status check.
- Require conversation resolution.
- Block force pushes and deletion.

The initial rule requires no approving reviews because the repository currently has one
maintainer. Increase the approval count when collaborators are added.

## Custom Domain

No domain was specified at bootstrap. When one is chosen:

1. Run `CUSTOM_DOMAIN=example.com npm run domain --workspace @viuwu/site`.
2. Point DNS at GitHub Pages according to GitHub's current documentation.
3. Update canonical and social metadata in `apps/site/index.html`.
4. Enable HTTPS enforcement after DNS verification.

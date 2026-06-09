# GitHub Setup

## Automated

- Public repository at `resistdesign/viuwu`.
- `main` as the default branch.
- Pull request branch for the bootstrap milestone.
- CI for formatting, linting, type checks, tests, and site build.
- GitHub Pages artifact deployment on pushes to `main`.
- GitHub Pages configured to use Actions at `https://viuwu.resist.design/`.
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

The production domain is `viuwu.resist.design`.

- Route 53 has a direct `CNAME` from `viuwu.resist.design` to `resistdesign.github.io`.
- Repository Pages settings use `viuwu.resist.design` as the custom domain.
- HTTPS is enforced in GitHub Pages.
- `apps/site/public/CNAME` is committed and copied into every Vite build.
- The Pages workflow fails before upload if the built `CNAME` is missing or incorrect.

GitHub currently ignores the `CNAME` file when deployment uses a custom Actions workflow, but the
file remains in the artifact as an explicit, portable record of the intended domain.

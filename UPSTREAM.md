# Quartz upstream provenance

Source: https://github.com/jackyzha0/quartz
Stable tag: v5.0.0
Tag object: 7284f12ebf6b24e69b6cc9417e71b7d26700dc17
Commit: ab346fa66a895e12d63a308e70ce330ba795822a
Source archive: https://codeload.github.com/jackyzha0/quartz/tar.gz/ab346fa66a895e12d63a308e70ce330ba795822a
Verified via git ls-remote on 2026-10-16.

Original Quartz license: LICENSE.txt (MIT), applies to upstream software, not original articles.
The upstream package-lock.json is retained; quartz.lock.json retains the selected upstream pinned plugin commits.
Upstream workflows and upstream GitHub community/funding configuration are omitted; .github/workflows/pages.yaml is project-specific.

## Workflow action refs verified on 2026-10-16

Resolved using `git ls-remote https://github.com/actions/NAME.git refs/tags/MAJOR`:

- actions/checkout v4: `11d5960a326750d5838078e36cf38b85af677262`
- actions/setup-node v4: `49933ea5288caeca8642d1e84afbd3f7d6820020`
- actions/upload-pages-artifact v3: `56afc609e74202658d3ffba0e8f6dda462b719fa`
- actions/deploy-pages v4: `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e`

These established majors support the configured hosted Ubuntu workflow. Newer major availability is not required for this initial pinned release. No GitHub Actions execution has been claimed by this local preparation.

The optional upstream docs/ reference website is omitted. Core Quartz source and its required templates remain intact. The upstream `npm run docs` helper therefore is not a project command; use `npx quartz build --serve` for this site.

Quartz 5 Head.tsx imports CustomOgImagesEmitterName even when OG image generation is disabled. The upstream-pinned og-image plugin is therefore retained in the lockfile and installed, with enabled:false in site configuration.

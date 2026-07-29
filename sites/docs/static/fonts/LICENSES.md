# Font licences

These files are fetched by `scripts/fetch-fonts.js` and self-hosted so the docs
make no third-party font requests at runtime. All three are free to redistribute
this way.

| Family | Files | Licence |
| --- | --- | --- |
| Bespoke Serif | `bespoke-serif-*.woff2` | [ITF Free Font Licence](https://www.fontshare.com/licenses/itf-ffl) — Indian Type Foundry |
| Geist | `geist-*.woff2` | SIL Open Font Licence 1.1 — full text in `OFL-geist.txt`, © 2023 Vercel |
| JetBrains Mono | `jetbrains-mono-*.woff2` | SIL Open Font Licence 1.1 — © 2020 The JetBrains Mono Project Authors |

The OFL 1.1 body is identical for Geist and JetBrains Mono; only the copyright
line differs, so it is stored once in `OFL-geist.txt`.

The `-ext` files carry the `latin-ext` subset and are selected by
`unicode-range`, so most visitors only download the base `latin` file.

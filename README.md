# Anna

An electronic literature piece in remembrance of political prisoners who died in prison and activists who were killed under Putin's rule of Russia — from the Second Chechen War and the murders of the 2000s to the deaths in prison after 2022.

Named after Anna Politkovskaya (1958–2006).

Also published on itch.io.

## How to view

No build step. Open `index.html` in a browser, or serve the folder with any static server.

## Structure

| Where | What |
| --- | --- |
| `index.html` + `scripts/script.js` | Intro: names of the victims (from `scripts/names.js`) appear for one minute, then Anna's quote and the Start button |
| `menu.html` | Chapter menu |
| `names.html` + `scripts/credits.js` | All names as rolling credits, each linking to their story |
| `prelude/` | Chapter "Prelude", starts at `story1.html` |
| `cult-of-victory/` | Chapter "The Cult of Victory", starts at `story2.html` |
| `my-homeland/` | Chapter "My Homeland": Chechen children's essays from Anna Politkovskaya's article "War Sees No One" (2000), starts at `homeland.html` |
| `adaptation/` | Chapter "Adaptation", starts at `adaptation.html` |
| `scripts/prelude.js`, `scripts/ascii.js` | Letter-by-letter text reveal; ASCII art pages load the art first |
| `styles/style.css` | All styling |

ASCII art made with https://www.ascii-art-generator.org/.

# Anna

An electronic literature piece in remembrance of political prisoners who died in prison and activists who were killed under Putin's rule of Russia — from the Second Chechen War and the murders of the 2000s to the deaths in prison after 2022.

Named after Anna Politkovskaya (1958–2006).

Also published on itch.io.

## How to view

No build step. Open `index.html` in a browser, or serve the folder with any static server.

## Structure

| File | Role |
| --- | --- |
| `index.html` + `scripts/script.js` | Names of victims appear at random positions, then Anna's quote and the Start button |
| `menu.html` + `scripts/menu.js` | Chapter menu |
| `story1.html`, `story2.html` and the pages they link to | Chapters. Text pages use `scripts/prelude.js`; ASCII art pages use `scripts/ascii.js` |
| `styles/style.css` | All styling |

ASCII art made with https://www.ascii-art-generator.org/.

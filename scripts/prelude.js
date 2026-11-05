document.addEventListener('DOMContentLoaded', () => {
  const lines = document.querySelectorAll('.story-line');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  lines.forEach(line => {
    const newLine = document.createElement('div');
    newLine.className = 'story-line';

    line.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const letters = node.textContent.split('');
        letters.forEach(letter => {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.dataset.final = letter;
          span.textContent = /\s/.test(letter) ? letter : '\u00A0'; // real space, or a non-breaking placeholder
          newLine.appendChild(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
        const link = document.createElement('a');
        link.href = node.href;
        link.className = 'animated-link';
        if (node.target) {            // keep "open in a new tab" for links to sources
          link.target = node.target;
          link.rel = 'noopener';
        }

        const letters = node.textContent.split('');
        letters.forEach(letter => {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.dataset.final = letter;
          span.textContent = /\s/.test(letter) ? letter : '\u00A0'; // real space, or a non-breaking placeholder
          link.appendChild(span);
        });

        newLine.appendChild(link);
      }
    });

    line.replaceWith(newLine);
  });

  const story = document.getElementById('story-content');
  fitTextToFrame(story);
  window.addEventListener('resize', () => fitTextToFrame(story));

  const allLetters = document.querySelectorAll('.letter');

  function revealLetter(span, delay) {
    if (/\s/.test(span.dataset.final)) return; // spaces are already in place
    const flicker = setInterval(() => {
      span.textContent = characters[Math.floor(Math.random() * characters.length)];
    }, 30);

    setTimeout(() => {
      clearInterval(flicker);
      span.textContent = span.dataset.final;
      span.classList.add('visible');
    }, 500 + delay);
  }

  allLetters.forEach((span, i) => {
    revealLetter(span, i * 30);
  });
});

// Shrink the text until everything fits inside the frame, so no scrolling is needed.
// Runs again whenever the window is resized.
function fitTextToFrame(box) {
  box.style.fontSize = '';                                  // start from the CSS size
  let size = parseFloat(getComputedStyle(box).fontSize);
  while (box.scrollHeight > box.clientHeight && size > 10) {
    size -= 0.5;
    box.style.fontSize = size + 'px';
  }
}

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
          span.textContent = ' ';
          newLine.appendChild(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
        const link = document.createElement('a');
        link.href = node.href;
        link.className = 'animated-link';

        const letters = node.textContent.split('');
        letters.forEach(letter => {
          const span = document.createElement('span');
          span.classList.add('letter');
          span.dataset.final = letter;
          span.textContent = ' ';
          link.appendChild(span);
        });

        newLine.appendChild(link);
      }
    });

    line.replaceWith(newLine);
  });

  const allLetters = document.querySelectorAll('.letter');

  function revealLetter(span, delay) {
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

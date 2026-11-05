document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('ascii-container');
  const pre = container.querySelector('pre');

  // Read only the art inside <pre>, without the empty lines and the HTML
  // indentation around it (that indentation used to shift the first line right).
  const art = pre.textContent.replace(/^\s*\n/, '').trimEnd();
  const lines = art.split('\n');
  pre.textContent = '';

  let i = 0;

  function showNextLine() {
    if (i < lines.length) {
      pre.textContent += lines[i] + '\n';
      i++;
      setTimeout(showNextLine, 30); // Speed of ASCII load-in
    } else {
      // Once done, start timer to hide ASCII and show story
      setTimeout(transitionToStory, 6000); // Show story after 6 sec
    }
  }

  showNextLine();

  function transitionToStory() {
    container.style.transition = 'none'; // Remove fade
    container.style.opacity = '0';

    setTimeout(() => {
      container.style.display = 'none';
      showStory(); // Start animated story
    }, 200); // Short timeout just for layout shift
  }

  function showStory() {
    const story = document.getElementById('story-content');
    story.style.display = 'block';

    const lines = story.querySelectorAll('.story-line');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    lines.forEach(line => {
      const originalHTML = line.innerHTML;
      line.innerHTML = ''; // Clear line

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = originalHTML;

      Array.from(tempDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('letter');
            span.dataset.final = char;
            span.textContent = /\s/.test(char) ? char : '\u00A0'; // real space, or a non-breaking placeholder
            line.appendChild(span);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          const link = document.createElement('a');
          link.href = node.getAttribute('href');
          link.className = node.className;
          node.textContent.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('letter');
            span.dataset.final = char;
            span.textContent = /\s/.test(char) ? char : '\u00A0'; // real space, or a non-breaking placeholder
            link.appendChild(span);
          });
          line.appendChild(link);
        }
      });
    });

    fitTextToFrame(story);
    window.addEventListener('resize', () => fitTextToFrame(story));

    const allLetters = story.querySelectorAll('.letter');

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
  }
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

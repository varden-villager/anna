function wrapLetters() {
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    const letters = word.textContent.split('');
    word.innerHTML = letters.map(letter =>
      `<span class="letter" data-final="${letter}"> </span>` // blank at first
    ).join('');
  });
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function revealLetter(span, finalChar, duration = 500, speed = 30) {
  const flicker = setInterval(() => {
    span.textContent = characters[Math.floor(Math.random() * characters.length)];
  }, speed);

  const timeout = setTimeout(() => {
    clearInterval(flicker);
    span.textContent = finalChar;
    span.classList.add('visible');
  }, duration);

  return { flicker, timeout };
}

let activeTimers = [];

function startLetterReveal(timerList = activeTimers, letterElements = null) {
  const groups = document.querySelectorAll('.quote-line');
  if (letterElements) {
    // For quote
    groups.forEach(group => {
      const letters = group.querySelectorAll('.letter');
      letters.forEach((span, i) => {
        const finalChar = span.dataset.final;
        const delay = i * 40;
        const timer = setTimeout(() => {
          const { flicker, timeout } = revealLetter(span, finalChar, 500, 30);
          timerList.push(flicker, timeout);
        }, delay);
        timerList.push(timer);
      });
    });
  } else {
    // For the names section
    const letters = document.querySelectorAll('.letter');
    letters.forEach((span, i) => {
      const finalChar = span.dataset.final;
      const delay = i * 60;
      const timer = setTimeout(() => {
        const { flicker, timeout } = revealLetter(span, finalChar, 800);
        timerList.push(flicker, timeout);
      }, delay);
      timerList.push(timer);
    });
  }
}

function randomizeWordLinePositions() {
  const lines = document.querySelectorAll('.word-line');
  const frame = document.getElementById('desktop-frame');
  const frameRect = frame.getBoundingClientRect();

  const padding = 20;
  const placed = [];

  lines.forEach(line => {
    const lineWidth = line.offsetWidth;
    const lineHeight = line.offsetHeight;

    let tries = 0;
    let placedSuccessfully = false;

    while (!placedSuccessfully && tries < 100) {
      const x = Math.random() * (frameRect.width - lineWidth - 2 * padding) + padding;
      const y = Math.random() * (frameRect.height - lineHeight - 2 * padding) + padding;

      const newRect = { x, y, width: lineWidth, height: lineHeight };

      const overlaps = placed.some(r =>
        !(r.x + r.width < newRect.x || r.x > newRect.x + newRect.width ||
          r.y + r.height < newRect.y || r.y > newRect.y + newRect.height)
      );

      if (!overlaps) {
        line.style.left = `${x}px`;
        line.style.top = `${y}px`;
        placed.push(newRect);
        placedSuccessfully = true;
      }

      tries++;
    }

    // Fallback in case we couldn't place it without overlap
    if (!placedSuccessfully) {
      line.style.left = `${padding}px`;
      line.style.top = `${padding + placed.length * (lineHeight + 5)}px`;
    }
  });
}

function wrapQuoteLetters() {
  if (document.querySelector('#quote .letter')) return;

  const quoteWords = document.querySelectorAll('#quote .word');
  quoteWords.forEach(word => {
    const letters = word.textContent.split('');
    const isRed = word.classList.contains('anna-name');

    word.innerHTML = letters.map(letter =>
      `<span class="letter" data-final="${letter}" ${isRed ? 'data-color="red"' : ''}></span>`
    ).join('');
  });
}

function showQuote() {
  const quote = document.getElementById('quote');

  // Wrap first (before making it visible)
  wrapQuoteLetters();

  // Then display the quote
  quote.style.display = 'block';

  // Then start the flickering reveal for quote only
  const quoteTimers = [];
  const quoteLetters = document.querySelectorAll('#quote .letter');
  startLetterReveal(quoteTimers, quoteLetters);

  const quoteWords = document.querySelectorAll('#quote .word');
  quoteWords.forEach((word, i) => {
    setTimeout(() => {
      word.style.visibility = 'visible';
    }, i * 60 * word.textContent.length + 800);
  });

  // ⏳ Remove everything but "Anna" after 40s
  setTimeout(() => {
    const quoteLines = document.querySelectorAll('#quote .quote-line');
    quoteLines.forEach((line, index) => {
      if (index === quoteLines.length - 1) {
        const words = line.querySelectorAll('.word');
        words.forEach(word => {
          if (!word.classList.contains('anna-name')) {
            word.remove();
          }
        });
      } else {
        line.remove();
      }
    });
  }, 40000);
  
  // Show "Start" button 5 seconds later
  setTimeout(() => {
    document.getElementById('start-button').style.display = 'block';
  }, 45000);
}


function endAndShowQuote() {
  // Fade to black
  const fade = document.getElementById('fade-overlay');
  fade.classList.add('active');

  // Remove word-lines from screen
  document.querySelectorAll('.word-line').forEach(line => line.remove());

  // Stop all flickering timers
  activeTimers.forEach(timer => {
    clearInterval(timer);
    clearTimeout(timer);
  });

  // After 2 seconds, show quote
  setTimeout(() => {
    showQuote();
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  wrapLetters();
  randomizeWordLinePositions();
  startLetterReveal();
  setTimeout(endAndShowQuote, 48000);
});



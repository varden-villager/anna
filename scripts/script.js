function wrapLetters() {
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    const letters = word.textContent.split('');
    word.innerHTML = letters.map(letter =>
      `<span class="letter" data-final="${letter}">&nbsp;</span>` // invisible placeholder, same width as a letter
    ).join('');
  });
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Timing of the intro (milliseconds)
const NAMES_DURATION = 60000;   // one minute, like a minute of silence: time to reveal all names
const QUOTE_START = 63000;      // when the names fade out and Anna's quote begins

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
    // For the names section: spread all letters evenly over NAMES_DURATION,
    // so the reveal reaches the last name in time, however many names there are.
    const letters = document.querySelectorAll('.word-line .letter');
    const step = NAMES_DURATION / letters.length;
    letters.forEach((span, i) => {
      const finalChar = span.dataset.final;
      const delay = i * step;
      const timer = setTimeout(() => {
        const { flicker, timeout } = revealLetter(span, finalChar, 800);
        timerList.push(flicker, timeout);
      }, delay);
      timerList.push(timer);
    });
  }
}

// Put every line at a random spot inside the frame.
// Lines are allowed to overlap: the crowding is intentional.
function randomizeWordLinePositions() {
  const frame = document.getElementById('desktop-frame');
  const padding = 20;

  document.querySelectorAll('.word-line').forEach(line => {
    const maxX = frame.clientWidth - line.offsetWidth - 2 * padding;
    const maxY = frame.clientHeight - line.offsetHeight - 2 * padding;
    line.style.left = `${padding + Math.random() * Math.max(maxX, 0)}px`;
    line.style.top = `${padding + Math.random() * Math.max(maxY, 0)}px`;
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

// Turn the name of every entry in NAMES (from names.js) into
// <div class="word-line"><span class="word">...</span> ...</div>
function buildNameLines() {
  const frame = document.getElementById('desktop-frame');
  const overlay = document.getElementById('fade-overlay');

  NAMES.forEach(entry => {
    const line = document.createElement('div');
    line.className = 'word-line';

    entry.name.split(' ').forEach(wordText => {
      const word = document.createElement('span');
      word.className = 'word';
      word.textContent = wordText;
      line.appendChild(word);
    });

    frame.insertBefore(line, overlay);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildNameLines();
  wrapLetters();
  randomizeWordLinePositions();
  startLetterReveal();
  setTimeout(endAndShowQuote, QUOTE_START);
});



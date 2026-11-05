// Names page: builds the list from NAMES (scripts/names.js)
// and rolls it slowly upwards, like the credits of a film.
// - mouse on a name: the list pauses, so the name can be clicked
// - mouse in the upper zone (the faint arrow): the list rolls back

const SCROLL_SPEED = 40;    // pixels per second, normal direction (up)
const REWIND_SPEED = 40;    // pixels per second when rolling back (same pace)

// Which period a year belongs to. The list is chronological,
// so a heading is added each time the period changes.
function periodOf(year) {
  if (year < 2010) return '2000s';
  if (year < 2022) return '2010 – 2021';
  return 'Since 2022';
}

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('credits-list');
  const box = document.getElementById('credits');
  const rewindZone = document.getElementById('credits-rewind');

  let currentPeriod = '';

  NAMES.forEach(entry => {
    // The year is the 4 digits in the date, e.g. '9 March 2000' -> 2000
    const year = Number(entry.date.match(/\d{4}/)[0]);
    const period = periodOf(year);
    if (period !== currentPeriod) {
      const heading = document.createElement('li');
      heading.className = 'credits-heading';
      heading.textContent = period;
      list.appendChild(heading);
      currentPeriod = period;
    }

    const item = document.createElement('li');

    // The name is a link when we have one. It opens in a new tab,
    // so the reader can close it and come back to the work.
    const name = document.createElement(entry.link ? 'a' : 'span');
    name.className = 'credits-name';
    name.textContent = entry.name;
    if (entry.link) {
      name.href = entry.link;
      name.target = '_blank';
      name.rel = 'noopener';
    }

    item.append(name);
    list.appendChild(item);
  });

  // What the mouse is doing
  let paused = false;     // on a name (headings don't pause)
  let rewinding = false;  // in the upper zone

  list.addEventListener('mouseover', event => {
    paused = event.target.closest('.credits-name') !== null;
  });
  list.addEventListener('mouseleave', () => { paused = false; });
  rewindZone.addEventListener('mouseenter', () => { rewinding = true; });
  rewindZone.addEventListener('mouseleave', () => { rewinding = false; });

  // position = how far the top of the list is from the top of the box.
  // It starts just below the visible area.
  let position = box.clientHeight;
  let lastTime = performance.now();

  // Runs once per screen refresh (about 60 times per second).
  function roll(now) {
    const seconds = (now - lastTime) / 1000;   // time since the last frame
    lastTime = now;

    if (rewinding) {
      position += REWIND_SPEED * seconds;
      position = Math.min(position, box.clientHeight);   // not further back than the start
    } else if (!paused) {
      position -= SCROLL_SPEED * seconds;
      if (position < -list.offsetHeight) {
        position = box.clientHeight;                     // the list has passed: start again
      }
    }

    list.style.transform = `translateY(${position}px)`;
    requestAnimationFrame(roll);
  }

  requestAnimationFrame(roll);
});

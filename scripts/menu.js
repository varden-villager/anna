document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('back-button').addEventListener('click', () => {
      window.location.href = 'index.html'; // or wherever your intro is
    });
  
    const buttons = document.querySelectorAll('.menu-button');
    buttons.forEach((btn, i) => {
      if (btn.id !== 'back-button') {
        btn.addEventListener('click', () => {
          window.location.href = `story${i + 1}.html`; // e.g., story1.html, story2.html, etc.
        });
      }
    });
  });
// script-simple.js - только для инъекции хедера и футера

const headerHTML = `
  <nav class="container">
    <a href="../index.html" class="logo">Fit-Treats</a>
    <div class="nav-links">
      <a href="../index.html">Главная</a>
      <a href="../catalog.html">Каталог</a>
      <a href="../blog.html">Блог</a>
      <a href="../delivery.html">Доставка и оплата</a>
    </div>
    <div class="nav-actions" style="display: flex; gap: 1rem; align-items: center;">
      <button class="mobile-menu-btn">☰</button>
    </div>
  </nav>
`;

const footerHTML = `
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="../index.html" class="footer-logo">Fit-Treats</a>
        <p>Полезные десерты без сахара, глютена и лактозы. Забота о вашем здоровье в каждом кусочке.</p>
      </div>
      <div>
        <h3 style="color: white; margin-bottom: 1rem;">Контакты</h3>
        <ul>
          <li>Телефон: +7 (999) 000-00-00</li>
          <li>Email: info@fit-treats.ru</li>
          <li>Адрес: г. Москва, ул. Примерная, д. 1</li>
        </ul>
      </div>
    </div>
    <div style="text-align: center; border-top: 1px solid #44403c; padding-top: 2rem;">
      © ${new Date().getFullYear()} Fit-Treats. Все права защищены.
    </div>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  // Inject Layout
  const header = document.querySelector('header');
  if (header) header.innerHTML = headerHTML;

  const footer = document.querySelector('footer');
  if (footer) footer.innerHTML = footerHTML;
  
  // Mobile Menu
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.toggle('mobile-active');
      }
    });
  }

});


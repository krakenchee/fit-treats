import { products, categories } from './data.js';

// Layout Injection
const headerHTML = `
  <nav class="container">
    <a href="index.html" class="logo">Fit-Treats</a>
    <div class="nav-links">
      <a href="index.html">Главная</a>
      <a href="catalog.html">Каталог</a>
      <a href="blog.html">Блог</a>
      <a href="delivery.html">Доставка и оплата</a>
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
        <a href="index.html" class="footer-logo">Fit-Treats</a>
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

const modalHTML = `
  <div class="modal" id="orderModal">
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2 class="section-title-z" style="font-size: 1.5rem; margin-bottom: 1.5rem;">Оформить заказ</h2>
      <form class="contact-form" style="margin: 0;">
        <input type="text" placeholder="Ваше имя" required>
        <input type="text" class="tel" placeholder="Ваш телефон" required>
        <button type="submit" class="btn" style="width: 100%;">Отправить</button>
      </form>
    </div>
  </div>
`;



document.addEventListener('DOMContentLoaded', () => {
  // Inject Layout
  const header = document.querySelector('header');
  if (header) header.innerHTML = headerHTML;

  const footer = document.querySelector('footer');
  if (footer) footer.innerHTML = footerHTML;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Mobile Menu Functionality
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  const isMobile = () => window.innerWidth <= 768;

  // Добавляем CSS для мобильного меню через JavaScript
  const mobileMenuStyles = `
    @media (max-width: 768px) {
      .nav-links.mobile-active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 4rem;
        left: 0;
        right: 0;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 101;
      }
    }
  `;

  // Вставляем стили в документ
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mobileMenuStyles;
  document.head.appendChild(styleSheet);
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (isMobile()) {
        navLinks.classList.toggle('mobile-active');
      }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (isMobile()) {
          navLinks.classList.remove('mobile-active');
        }
      });
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
      if (!isMobile()) {
        navLinks.classList.remove('mobile-active');
      }
    });
  }

  // Global Event Delegation
  document.addEventListener('click', (e) => {
    // Modal Open
    const openBtn = e.target.closest('[data-modal="open"]');
    if (openBtn) {
      e.preventDefault();
      const modal = document.getElementById('orderModal');
      if (modal) modal.classList.add('open');
    }

    // Modal Close (Button)
    const closeBtn = e.target.closest('.close-modal');
    if (closeBtn) {
      const modal = document.getElementById('orderModal');
      if (modal) modal.classList.remove('open');
    }

    // Modal Close (Overlay)
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('open');
    }

    // FAQ Toggle
    const faqQuestion = e.target.closest('.faq-question');
    if (faqQuestion) {
      const parent = faqQuestion.parentElement;
      parent.classList.toggle('active');
    }
  });

  // Render Popular Products (Home Page)
  const popularGrid = document.getElementById('popular-products');
  if (popularGrid) {
    const popular = products.filter(p => p.popular).slice(0, 3);
    popularGrid.innerHTML = popular.map(createProductCard).join('');
  }

  // Render Catalog (Catalog Page)
  const catalogGrid = document.getElementById('catalog-grid');
  if (catalogGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
  
    if (categoryId) {
      // Show products for category
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        document.getElementById('page-title').textContent = category.name;
        document.getElementById('category-desc').textContent = category.description;
        
        const categoryProducts = products.filter(p => p.category === categoryId);
        catalogGrid.innerHTML = categoryProducts.map(createProductCard).join('');
        
        // Update breadcrumbs
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (breadcrumbs) {
          breadcrumbs.innerHTML += `<span>/</span> <span>${category.name}</span>`;
        }
      }
    } else {
      // Show categories
      catalogGrid.innerHTML = categories.map(cat => `
        <a href="catalog.html?category=${cat.id}" class="product-card" style="position: relative; height: 300px; display: flex; align-items: flex-end; text-align: left;">
          <div style="position: absolute; inset: 0; z-index: 0;">
             ${getCategoryImage(cat.id)}
             <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4);"></div>
          </div>
          <div style="position: relative; z-index: 1; padding: 2rem; color: white;">
            <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">${cat.name}</h2>
            <p style="font-size: 0.9rem; opacity: 0.9;">${cat.description}</p>
          </div>
        </a>
      `).join('');
    }
  }

  // Render Product Detail
  const productDetail = document.getElementById('product-detail');
  if (productDetail) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id === productId);

    if (product) {
      updateProductMetaTags(product);
      document.title = `${product.name} | Fit-Treats`;
      
      // Update breadcrumbs
      const breadcrumbs = document.querySelector('.breadcrumbs');
      const category = categories.find(c => c.id === product.category);
      if (breadcrumbs && category) {
        breadcrumbs.innerHTML += `
          <span>/</span> <a href="catalog.html?category=${category.id}">${category.name}</a>
          <span>/</span> <span>${product.name}</span>
        `;
      }

      const imageBase = product.image.replace('assets/', '').replace('.webp', '');

      productDetail.innerHTML = `
        <div class="product-image" style="height: auto; border-radius: 1rem; overflow: hidden;">
          <picture>
          <source 
            srcset="assets/${imageBase}-mobile.webp"
            media="(max-width: 640px)"
            type="image/webp"
            width="300"
            height="200"
          >
          <source 
            srcset="assets/${imageBase}-tablet.webp"
            media="(max-width: 1024px)"
            type="image/webp"
            width="400"
            height="267"
          >
          <img 
            src="${product.image}" 
            alt="${product.alt || product.name}"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            width="600"
            height="400"
            style="aspect-ratio: 600 / 400; width: 100%; height: auto;"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 600px"
          >
        </picture>
        </div>
        <div>
          <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1rem;">${product.name}</h1>
          <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color); margin-bottom: 2rem;">${product.price} ₽</div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="font-weight: bold; margin-bottom: 0.5rem;">Описание</h3>
            <p style="color: var(--text-light); margin-bottom: 1.5rem;">${product.description}</p>
            
            <h3 style="font-weight: bold; margin-bottom: 0.5rem;">Состав</h3>
            <p style="color: var(--text-light);">${product.composition}</p>
          </div>

          <button class="btn" data-modal="open">Заказать</button>
        </div>
      `;
    }
  }
});

// Добавьте эту функцию в script.js
function updateProductMetaTags(product) {
  // Обновляем title
  document.title = `${product.name} без сахара | Купить ${product.category === 'cakes' ? 'торт' : 'десерт'} Fit-Treats Москва`;
  
  // Создаем или обновляем мета-тег description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `Купить ${product.name.toLowerCase()} без сахара. ${product.shortDescription} Состав: ${product.composition}. Доставка по Москве.`;
  
  // Создаем или обновляем мета-тег keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  const categoryNames = {
    'cakes': 'торт',
    'pastries': 'пирожное', 
    'candies': 'конфеты',
    'bars': 'батончик'
  };
  const productType = categoryNames[product.category] || 'десерт';
  metaKeywords.content = `купить ${product.name.toLowerCase()}, ${product.name.toLowerCase()} без сахара, ${productType} без сахара цена, заказать ${product.name.toLowerCase()} Москва`;
  
  // Обновляем Open Graph
  let ogTitle = document.querySelector('meta[property="og:title"]');
  let ogDesc = document.querySelector('meta[property="og:description"]');
  let ogUrl = document.querySelector('meta[property="og:url"]');
  let ogImage = document.querySelector('meta[property="og:image"]');
  
  if (ogTitle) ogTitle.content = `${product.name} без сахара | Fit-Treats`;
  if (ogDesc) ogDesc.content = `${product.shortDescription} Без сахара, глютена и молочных продуктов.`;
  if (ogUrl) ogUrl.content = `https://fit-treats-five.vercel.app/product.html?id=${product.id}`;
  if (ogImage) ogImage.content = `https://fit-treats-five.vercel.app/${product.image}`;
  
  // Добавляем canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `https://fit-treats-five.vercel.app/product.html?id=${product.id}`;
}

function createProductCard(product) {
  const imageBase = product.image.replace('assets/', '').replace('.webp', '');

  return `
    <a href="product.html?id=${product.id}" class="product-card">
      <div class="product-image">
        <picture>
          <!-- Mobile (до 640px) -->
          <source 
            srcset="assets/${imageBase}-mobile.webp"
            media="(max-width: 640px)"
            type="image/webp"
            width="300"
            height="200"
          >
          <!-- Tablet (до 1024px) -->
          <source 
            srcset="assets/${imageBase}-tablet.webp"
            media="(max-width: 1024px)"
            type="image/webp"
            width="400"
            height="267"
          >
          <!-- Desktop -->
          <img 
            src="${product.image}" 
            alt="${product.alt || product.name}"
            loading="lazy"
            decoding="async"
            width="600"
            height="400"
            style="aspect-ratio: 600 / 400"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          >
        </picture>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.shortDescription}</p>
        <div class="product-footer">
          <span class="product-price">${product.price} ₽</span>
          <span style="font-size: 0.8rem; text-transform: uppercase; color: #a8a29e; font-weight: bold;">Подробнее</span>
        </div>
      </div>
    </a>
  `;
}

// FAQ для страницы доставки
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.delivery-faq .faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      const answer = this.nextElementSibling;
      
      // Закрываем другие открытые FAQ
      document.querySelectorAll('.delivery-faq .faq-item.active').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      
      // Переключаем текущий FAQ
      faqItem.classList.toggle('active');
      
      if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
});


function getCategoryImage(id) {
  const images = {
    'cakes': {
      desktop: 'assets/cake-passion-fruit.webp',
      tablet: 'assets/cake-passion-fruit-tablet.webp',
      mobile: 'assets/cake-passion-fruit-mobile.webp'
    },
    'pastries': {
      desktop: 'assets/croissant.webp',
      tablet: 'assets/croissant-tablet.webp',
      mobile: 'assets/croissant-mobile.webp'
    },
    'candies': {
      desktop: 'assets/candies.webp',
      tablet: 'assets/candies-tablet.webp',
      mobile: 'assets/candies-mobile.webp'
    },
    'bars': {
      desktop: 'assets/bars.webp',
      tablet: 'assets/bars-tablet.webp',
      mobile: 'assets/bars-mobile.webp'
    }
  };

   const img = images[id] || images['pastries'];
  
  return `
    <picture>
      <source 
        srcset="${img.mobile}"
        media="(max-width: 640px)"
        type="image/webp"
        width="300"
        height="200"
      >
      <source 
        srcset="${img.tablet}"
        media="(max-width: 1024px)"
        type="image/webp"
        width="400"
        height="267"
      >
      <img 
        src="${img.desktop}" 
        alt="${id} категория"
        loading="lazy"
        decoding="async"
        width="600"
        height="400"
        style="width: 100%; height: 100%; object-fit: cover;"
      >
    </picture>
  `;
}






document.addEventListener("DOMContentLoaded", function () {
    var phoneInputs = document.querySelectorAll('input.tel');

    var getInputNumbersValue = function (input) {
        // Возвращаем только цифры из введенного значения
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // При вставке некорректного символа оставляем только цифры
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Если редактируем не в конце поля
            if (e.data && /\D/g.test(e.data)) {
                // Если вводим не числовой символ
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }

    var onPhoneKeyDown = function (e) {
        // Удаление последнего символа очищает поле
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }

    var onPhoneFocus = function (e) {
        var input = e.target;
        if (input.value === "") {
            input.value = "+7 "; // Устанавливаем начальное значение
            input.setSelectionRange(3, 3); // Устанавливаем курсор после +7
        }
    }

    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
        phoneInput.addEventListener('focus', onPhoneFocus); // Добавляем обработчик focus
    }
});

// Раскрывающаяся панель
document.addEventListener('DOMContentLoaded', function() {
  const expandBtn = document.querySelector('.expand-btn');
  
  if (expandBtn) {
    expandBtn.addEventListener('click', function() {
      const panel = this.closest('.expandable-panel');
      panel.classList.toggle('active');
      
      const content = this.nextElementSibling;
      if (panel.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  }
  
  // Анимация при скролле для ленты
  const ribbonItems = document.querySelectorAll('.ribbon-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1
  });
  
  ribbonItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease';
    observer.observe(item);
  });
});



document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.blog-filter .tag');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogGrid = document.querySelector('.blog-grid');
  
  // Создаем контейнер для центрирования карточек
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid-container-center';
  
  // Перемещаем все карточки в новый контейнер
  blogCards.forEach(card => {
    gridContainer.appendChild(card.cloneNode(true));
  });
  
  // Удаляем старые карточки и вставляем новый контейнер
  const oldCards = document.querySelectorAll('.blog-card');
  oldCards.forEach(card => card.remove());
  blogGrid.appendChild(gridContainer);
  
  // Обновляем ссылки на карточки
  const newBlogCards = gridContainer.querySelectorAll('.blog-card');
  
  // Функция для фильтрации статей
  function filterArticles(selectedTag) {
    let visibleCount = 0;
    
    newBlogCards.forEach(card => {
      const cardTags = card.getAttribute('data-tags').split(',');
      
      // Показываем все карточки если выбран тег "all" или тег совпадает
      if (selectedTag === 'all' || cardTags.includes(selectedTag)) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Обновляем класс контейнера в зависимости от количества видимых карточек
    if (visibleCount === 1) {
      gridContainer.classList.add('single-item');
    } else {
      gridContainer.classList.remove('single-item');
    }
  }
  
  // Обработчик кликов по тегам
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const selectedTag = this.getAttribute('data-tag');
      
      // Удаляем активный класс у всех кнопок
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Добавляем активный класс нажатой кнопке
      this.classList.add('active');
      
      // Фильтруем статьи
      filterArticles(selectedTag);
    });
  });
  
  // Добавляем CSS для анимации и фиксированного размера
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .blog-hero {
      padding: 2rem;
    }
    
    .blog-filter {
      padding: 2rem;
      text-align: center;
    }
    
    .blog-filter .tag {
      background: #f0f0f0;
      border: none;
      padding: 8px 16px;
      margin: 0 8px 8px 0;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.3s ease;
      display: inline-block;
    }
    
    .blog-filter .tag:hover {
      background: #e0e0e0;
      transform: translateY(-2px);
    }
    
    .blog-filter .tag.active {
      background: #2D4A3E;
      color: white;
      font-weight: 600;
    }
    
    .blog-grid {
      display: flex;
      justify-content: center;
    }

    .blog-list {
      padding: 0;
    }

    .grid-container-center {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 320px));
      gap: 24px;
      justify-content: center;
      width: 100%;
      max-width: var(--max-width);
    }
    
    /* Для одной карточки - центрируем и ограничиваем ширину */
    .grid-container-center.single-item {
      grid-template-columns: minmax(300px, 320px);
      justify-content: center;
    }
    
    .blog-card {
      border: 1px solid #eee;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      background: #f8f8f8;
    }
    
    .blog-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .blog-card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
    }
    
    .blog-card h2 {
      margin: 16px 16px 8px;
      font-size: 18px;
      color: #333;
      min-height: 54px;
    }
    
    .blog-card p {
      margin: 0 16px 12px;
      color: #666;
      line-height: 1.5;
      font-size: 14px;
      min-height: 42px;
    }
    
    .blog-card .tags {
      margin: 0 0 20px 25px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .blog-card .tags span {
      background: #e5dfdf;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
      .grid-container-center {
        grid-template-columns: repeat(auto-fit, minmax(280px, 300px));
        gap: 20px;
      }
      
      .grid-container-center.single-item {
        grid-template-columns: minmax(280px, 300px);
      }
      
      .blog-card {
        max-width: 300px;
      }
      
      .blog-filter .tag {
        margin: 0 4px 8px 0;
        padding: 6px 12px;
        font-size: 13px;
      }
    }
    
    @media (max-width: 480px) {
      .grid-container-center {
        grid-template-columns: 1fr;
        max-width: 100%;
      }
      
      .grid-container-center.single-item {
        grid-template-columns: 1fr;
      }
      
      .blog-card {
        max-width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Инициализация: показываем все статьи при загрузке
  filterArticles('all');
});
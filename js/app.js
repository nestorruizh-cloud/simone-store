// Simone Client-Side Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Global UI Components
  initTheme();
  initMobileMenu();
  initCart();
  initLightbox();
  initContactForm();
  initHeroCarousel();
  initPromoModal();
  initPdfGenerator();

  // 2. Initialize Catalog and Event Quote Calculator
  initCatalog();
  initEventCalculator();

  // 3. Sync Live Catalog & Settings from Cloud Database (/api/store)
  syncStoreFromCloud();
});

// Active Store Settings (synced from Cloud API or defaultSettings)
let storeSettings = (window.productsDatabase && window.productsDatabase.defaultSettings) || {};

function getPrimaryWhatsApp() {
  return (storeSettings.notifications && storeSettings.notifications.whatsappPrimary) || '573112547250';
}

async function syncStoreFromCloud() {
  try {
    const res = await fetch('/api/store');
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.products) && data.products.length > 0) {
      window.productsDatabase.products = data.products;
      localStorage.setItem('simone_products', JSON.stringify(data.products));
      if (typeof window.refreshStoreCatalog === 'function') {
        window.refreshStoreCatalog(data.products);
      }
    }
    if (data.settings) {
      storeSettings = data.settings;
      localStorage.setItem('simone_settings', JSON.stringify(data.settings));
      applyStoreSettingsToDOM(data.settings);
    } else {
      const cachedSettings = localStorage.getItem('simone_settings');
      if (cachedSettings) {
        storeSettings = JSON.parse(cachedSettings);
        applyStoreSettingsToDOM(storeSettings);
      }
    }
  } catch (err) {
    // Fallback to cached settings if offline
    try {
      const cachedSettings = localStorage.getItem('simone_settings');
      if (cachedSettings) {
        storeSettings = JSON.parse(cachedSettings);
        applyStoreSettingsToDOM(storeSettings);
      }
    } catch (e) {}
  }
}

function applyStoreSettingsToDOM(settings) {
  if (!settings) return;

  // 1. Update Hero Carousel Slides
  if (Array.isArray(settings.banners)) {
    const slides = document.querySelectorAll('.carousel-slide');
    settings.banners.forEach((b, idx) => {
      const slide = slides[idx];
      if (!slide) return;
      if (b.image) {
        slide.style.backgroundImage = `linear-gradient(rgba(43, 38, 37, 0.45), rgba(43, 38, 37, 0.6)), url('${b.image}')`;
      }
      const subEl = slide.querySelector('.slide-subtitle');
      const titleEl = slide.querySelector('h2');
      const descEl = slide.querySelector('p');
      const ctaEl = slide.querySelector('a.btn');
      if (subEl && b.subtitle) subEl.textContent = isEnglish ? (b.subtitle.en || b.subtitle.es) : b.subtitle.es;
      if (titleEl && b.title) titleEl.innerHTML = isEnglish ? (b.title.en || b.title.es) : b.title.es;
      if (descEl && b.description) descEl.textContent = isEnglish ? (b.description.en || b.description.es) : b.description.es;
      if (ctaEl && b.ctaText) ctaEl.textContent = isEnglish ? (b.ctaText.en || b.ctaText.es) : b.ctaText.es;
      if (ctaEl && b.ctaLink) ctaEl.setAttribute('href', b.ctaLink);
    });
  }

  // 2. Update Welcome Promo Modal
  if (settings.promoPopup) {
    const p = settings.promoPopup;
    const modal = document.getElementById('promo-modal');
    if (p.enabled === false && modal) {
      modal.classList.remove('active');
      modal.setAttribute('data-disabled', 'true');
    } else if (modal) {
      modal.removeAttribute('data-disabled');
      const imgSide = document.getElementById('promo-img-side') || modal.querySelector('.promo-img-side');
      const badgeEl = document.getElementById('promo-badge-text') || modal.querySelector('.promo-subtitle');
      const titleEl = document.getElementById('promo-title-text') || modal.querySelector('h2');
      const descEl = document.getElementById('promo-desc-text');
      const couponEl = document.getElementById('promo-coupon-code') || modal.querySelector('.promo-coupon');
      const couponDescEl = document.getElementById('promo-coupon-desc') || modal.querySelector('.promo-coupon-desc');
      const ctaBtn = document.getElementById('promo-cta-btn');

      if (imgSide && p.image) imgSide.style.backgroundImage = `url('${p.image}')`;
      if (badgeEl && p.badge) badgeEl.textContent = isEnglish ? (p.badge.en || p.badge.es) : p.badge.es;
      if (titleEl && p.title) titleEl.innerHTML = isEnglish ? (p.title.en || p.title.es) : p.title.es;
      if (descEl && p.description) descEl.textContent = isEnglish ? (p.description.en || p.description.es) : p.description.es;
      if (couponEl && p.couponCode) couponEl.textContent = p.couponCode;
      if (couponDescEl && p.couponDesc) couponDescEl.textContent = isEnglish ? (p.couponDesc.en || p.couponDesc.es) : p.couponDesc.es;
      if (ctaBtn && p.ctaText) ctaBtn.textContent = isEnglish ? (p.ctaText.en || p.ctaText.es) : p.ctaText.es;
    }
  }

  // 3. Update Sticky WhatsApp Link if Primary Number customized
  if (settings.notifications && settings.notifications.whatsappPrimary) {
    const stickyWa = document.getElementById('sticky-whatsapp');
    if (stickyWa) {
      const msg = isEnglish
        ? "Hello, I would like information about Simone's candles and favors."
        : "Hola, quisiera asesoría sobre las velas y decoraciones de Simone.";
      stickyWa.href = `https://wa.me/${settings.notifications.whatsappPrimary}?text=${encodeURIComponent(msg)}`;
    }
  }
}

async function registerOrderInCloud(orderPayload) {
  try {
    const localOrders = JSON.parse(localStorage.getItem('simone_orders') || '[]');
    const orderWithId = {
      id: 'SIM-' + Date.now().toString().slice(-6),
      status: 'nuevo',
      createdAt: new Date().toISOString(),
      ...orderPayload
    };
    localOrders.unshift(orderWithId);
    localStorage.setItem('simone_orders', JSON.stringify(localOrders.slice(0, 200)));

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderWithId)
    });
  } catch (e) {
    console.warn('Order saved locally; cloud sync pending:', e);
  }
}

// Detect current page language (based on filename)
const isEnglish = window.location.pathname.includes('index_en.html');

// Bilingual text dictionary
const dictionary = {
  aromaLabel: isEnglish ? "Scent" : "Aroma",
  customTextLabel: isEnglish ? "Custom Label Message" : "Texto de Etiqueta",
  photoAttached: isEnglish ? "Photo attached: " : "Foto adjuntada: ",
  uploadPhoto: isEnglish ? "Upload Pet Photo" : "Subir Foto Mascota",
  addedToCart: isEnglish ? "Added to cart!" : "¡Agregado al carrito!",
  qtyMinAlert: isEnglish ? "Minimum of 20 units required for events." : "El mínimo para recordatorios es de 20 unidades.",
  cartEmpty: isEnglish ? "Your cart is empty." : "Tu carrito está vacío.",
  unit: isEnglish ? "unit" : "unidad",
  units: isEnglish ? "units" : "unidades",
  contactSuccessTitle: isEnglish ? "Message Sent!" : "¡Mensaje Enviado!",
  contactSuccessMsg: isEnglish 
    ? "Thank you for contacting Simone. We will respond within 24 hours." 
    : "Gracias por escribir a Simone. Responderemos en las próximas 24 horas.",
  validationError: isEnglish ? "Please fill out all required fields." : "Por favor completa todos los campos requeridos.",
  itemTotal: isEnglish ? "Subtotal" : "Subtotal",
  waHello: isEnglish ? "Hello Simone, I would like to quote the following order:" : "Hola Simone, me gustaría cotizar el siguiente pedido:",
  photoReminder: isEnglish 
    ? "\n\n*⚠️ Please remember to attach the photo(s) in this chat after sending this message.*" 
    : "\n\n*⚠️ Por favor, recuerda adjuntar la foto o fotos en este chat después de enviar este mensaje.*"
};

// Global State
let cart = JSON.parse(localStorage.getItem('simone_cart')) || JSON.parse(localStorage.getItem('simon_store_cart')) || [];

// --- THEME & NAV INITIALIZATION ---
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

function initMobileMenu() {
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  
  if (!menuToggleBtn || !navMenu) return;

  menuToggleBtn.addEventListener('click', () => {
    menuToggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// --- CATALOG RENDERING & LOGIC ---
function initCatalog() {
  const productsGrid = document.getElementById('products-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (!productsGrid) return;
  
  let { products } = window.productsDatabase;

  // Render function
  function renderProducts(categoryFilter = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = categoryFilter === 'all' 
      ? products 
      : products.filter(p => p.category === categoryFilter);
      
    filteredProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-id', product.id);
      
      const productName = isEnglish ? product.name.en : product.name.es;
      const productDesc = isEnglish ? product.description.en : product.description.es;
      
      // Determine customization markup
      let customizerHTML = '';
      
      if (product.options.aromas && product.options.aromas.length > 0) {
        let aromaOptions = '';
        product.options.aromas.forEach(aroma => {
          aromaOptions += `<option value="${aroma}">${aroma}</option>`;
        });
        
        customizerHTML += `
          <div class="custom-field">
            <label>${dictionary.aromaLabel}</label>
            <select class="custom-select product-aroma-select">
              ${aromaOptions}
            </select>
          </div>
        `;
      }
      
      if (product.options.requiresMessage) {
        customizerHTML += `
          <div class="custom-field">
            <label>${dictionary.customTextLabel}</label>
            <input type="text" class="custom-input product-message-input" placeholder="${isEnglish ? 'Enter wish/phrase...' : 'Escribe tu frase/deseo...'}" maxlength="40">
          </div>
        `;
      }
      
      if (product.options.requiresPhoto) {
        customizerHTML += `
          <div class="custom-field">
            <label>${dictionary.uploadPhoto}</label>
            <label class="file-upload-mock" id="upload-label-${product.id}">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="file-status-text">${isEnglish ? 'Upload Photo (.jpg/.png)' : 'Subir Foto (.jpg/.png)'}</span>
              <input type="file" style="display:none;" class="product-photo-file-input" accept="image/*">
            </label>
          </div>
        `;
      }
      
      const hasDiscount = product.originalPrice && product.originalPrice > product.price;
      const priceDisplayHtml = hasDiscount
        ? `<div class="product-price-badge discount-active">
             <span class="price-strikethrough">$${product.originalPrice.toFixed(2)}</span>
             <span class="price-deal">$${product.price.toFixed(2)}</span>
           </div>`
        : `<div class="product-price-badge">$${product.price.toFixed(2)}</div>`;
        
      const cornerBadgeHtml = product.discountBadge
        ? `<div class="product-corner-badge">${product.discountBadge}</div>`
        : '';
        
      card.innerHTML = `
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${productName}">
          ${cornerBadgeHtml}
          ${priceDisplayHtml}
        </div>
        <div class="product-info">
          <h3>${productName}</h3>
          <p>${productDesc}</p>
          
          ${customizerHTML ? `<div class="product-customizer">${customizerHTML}</div>` : ''}
          
          <button class="btn btn-primary btn-sm add-to-cart-btn" style="width: 100%; margin-top: auto;">
            ${isEnglish ? 'Add to Cart' : 'Agregar al Carrito'}
          </button>
        </div>
      `;
      
      // Handle file input mock visual upload triggers
      const fileInput = card.querySelector('.product-photo-file-input');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const statusText = card.querySelector('.file-status-text');
          const mockLabel = card.querySelector('.file-upload-mock');
          if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            statusText.textContent = dictionary.photoAttached + fileName;
            mockLabel.style.borderColor = 'var(--accent-green)';
            mockLabel.style.color = 'var(--accent-green)';
          } else {
            statusText.textContent = isEnglish ? 'Upload Photo (.jpg/.png)' : 'Subir Foto (.jpg/.png)';
            mockLabel.style.borderColor = 'var(--border-color)';
            mockLabel.style.color = 'var(--text-muted)';
          }
        });
      }
      
      // Bind Add to Cart action
      card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCartHandler(product, card);
      });
      
      productsGrid.appendChild(card);
    });
  }

  // Expose store catalog refresh for dynamic repricing updates
  window.refreshStoreCatalog = () => {
    try {
      const stored = localStorage.getItem('simone_products');
      if (stored) {
        products = JSON.parse(stored);
      }
    } catch (e) {}
    const activeBtn = document.querySelector('.filter-btn.active');
    const cat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    renderProducts(cat);
  };

  // Bind filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-category'));
    });
  });

  // Initial render
  renderProducts();
}

function addToCartHandler(product, cardElement) {
  // Collect customizations
  const customizations = {};
  
  const aromaSelect = cardElement.querySelector('.product-aroma-select');
  if (aromaSelect) {
    customizations.aroma = aromaSelect.value;
  }
  
  const msgInput = cardElement.querySelector('.product-message-input');
  if (msgInput) {
    if (product.options.requiresMessage && !msgInput.value.trim()) {
      alert(dictionary.validationError);
      msgInput.focus();
      return;
    }
    customizations.message = msgInput.value.trim();
  }
  
  const fileInput = cardElement.querySelector('.product-photo-file-input');
  if (fileInput) {
    if (product.options.requiresPhoto && (!fileInput.files || fileInput.files.length === 0)) {
      alert(dictionary.validationError);
      return;
    }
    customizations.photoName = fileInput.files[0].name;
  }

  // Create unique item key for cart tracking
  const cartItemKey = `${product.id}-${customizations.aroma || ''}-${customizations.message || ''}-${customizations.photoName || ''}`;
  
  const existingItem = cart.find(item => item.key === cartItemKey);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      key: cartItemKey,
      id: product.id,
      name: isEnglish ? product.name.en : product.name.es,
      price: product.price,
      image: product.image,
      qty: 1,
      customizations: customizations
    });
  }
  
  // Persist & Update UI
  saveCart();
  updateCartBadge();
  openCartDrawer();
  
  // Feedback
  const originalText = cardElement.querySelector('.add-to-cart-btn').textContent;
  cardElement.querySelector('.add-to-cart-btn').textContent = dictionary.addedToCart;
  cardElement.querySelector('.add-to-cart-btn').style.backgroundColor = 'var(--accent-green)';
  
  setTimeout(() => {
    cardElement.querySelector('.add-to-cart-btn').textContent = originalText;
    cardElement.querySelector('.add-to-cart-btn').style.backgroundColor = '';
  }, 1200);
}

// --- RECORDATORIOS / BULK EVENTS CALCULATOR ---
function initEventCalculator() {
  const form = document.getElementById('event-quote-form');
  const eventTypeSelect = document.getElementById('event-type');
  const eventQtyInput = document.getElementById('event-qty');
  const eventAromaSelect = document.getElementById('event-aroma');
  const eventPkgSelect = document.getElementById('event-packaging');
  const eventTagText = document.getElementById('event-tag-text');
  
  // Summaries
  const unitPriceLabel = document.getElementById('summary-unit-price');
  const discountLabel = document.getElementById('summary-discount-pct');
  const totalPriceLabel = document.getElementById('summary-total-price');
  
  const addEventToCartBtn = document.getElementById('add-event-to-cart');
  const packagingShowcase = document.getElementById('packaging-showcase');

  if (!form || !eventTypeSelect) return;

  const { eventTypes, eventAromas, packagingOptions, getVolumeDiscount } = window.productsDatabase;

  // 1. Populate Dropdowns
  eventTypes.forEach(ev => {
    eventTypeSelect.innerHTML += `<option value="${ev.id}">${isEnglish ? ev.name.en : ev.name.es}</option>`;
  });
  
  eventAromas.forEach(ar => {
    eventAromaSelect.innerHTML += `<option value="${ar.id}">${isEnglish ? ar.name.en : ar.name.es}</option>`;
  });

  packagingOptions.forEach(pkg => {
    eventPkgSelect.innerHTML += `<option value="${pkg.id}">${isEnglish ? pkg.name.en : pkg.name.es} (+$${pkg.pricePerUnit.toFixed(2)})</option>`;
  });

  // 2. Populate Packaging Showcase cards on the sidebar
  packagingShowcase.innerHTML = '';
  packagingOptions.forEach(pkg => {
    packagingShowcase.innerHTML += `
      <div class="pkg-card">
        <img src="${pkg.image}" alt="${isEnglish ? pkg.name.en : pkg.name.es}" class="pkg-img">
        <div class="pkg-name">${isEnglish ? pkg.name.en : pkg.name.es}</div>
        <div class="pkg-price">+$${pkg.pricePerUnit.toFixed(2)}</div>
      </div>
    `;
  });

  // 3. Calculator Function
  function calculateTotal() {
    const selectedEvent = eventTypes.find(ev => ev.id === eventTypeSelect.value);
    const selectedPkg = packagingOptions.find(pkg => pkg.id === eventPkgSelect.value);
    const qty = parseInt(eventQtyInput.value) || 20;

    if (!selectedEvent || !selectedPkg) return;

    // Calculate prices
    const basePrice = selectedEvent.basePrice + selectedPkg.pricePerUnit;
    const discount = getVolumeDiscount(qty);
    const discountedUnitPrice = basePrice * (1 - discount);
    const subtotal = discountedUnitPrice * qty;

    // Render results
    unitPriceLabel.textContent = `$${discountedUnitPrice.toFixed(2)} / ${dictionary.unit}`;
    discountLabel.textContent = `${(discount * 100).toFixed(0)}% OFF`;
    totalPriceLabel.textContent = `$${subtotal.toFixed(2)}`;

    return {
      name: isEnglish ? selectedEvent.name.en : selectedEvent.name.es,
      unitPrice: discountedUnitPrice,
      subtotal: subtotal,
      qty: qty,
      eventTypeName: isEnglish ? selectedEvent.name.en : selectedEvent.name.es,
      aromaName: eventAromaSelect.options[eventAromaSelect.selectedIndex].text,
      pkgName: isEnglish ? selectedPkg.name.en : selectedPkg.name.es,
      pkgImage: selectedPkg.image
    };
  }

  // Bind change listeners
  [eventTypeSelect, eventQtyInput, eventAromaSelect, eventPkgSelect].forEach(input => {
    input.addEventListener('change', calculateTotal);
    input.addEventListener('input', calculateTotal);
  });

  // Initial Calculation
  calculateTotal();

  // 4. Add Event Favor to Cart Drawer
  addEventToCartBtn.addEventListener('click', () => {
    const qty = parseInt(eventQtyInput.value) || 0;
    if (qty < 20) {
      alert(dictionary.qtyMinAlert);
      return;
    }

    const calcResult = calculateTotal();
    const tagText = eventTagText.value.trim();

    // Unique key for events favor
    const eventCartKey = `event-${eventTypeSelect.value}-${eventAromaSelect.value}-${eventPkgSelect.value}-${tagText || ''}`;
    
    // Check if same quote is in cart
    const existingItem = cart.find(item => item.key === eventCartKey);
    if (existingItem) {
      existingItem.qty += calcResult.qty;
    } else {
      cart.push({
        key: eventCartKey,
        id: eventCartKey,
        name: `${isEnglish ? 'Special Event favor' : 'Recordatorio Especial'} (${calcResult.name})`,
        price: calcResult.unitPrice,
        image: calcResult.pkgImage,
        qty: calcResult.qty,
        isEvent: true,
        customizations: {
          aroma: calcResult.aromaName,
          packaging: calcResult.pkgName,
          message: tagText || (isEnglish ? 'None' : 'Ninguno')
        }
      });
    }

    saveCart();
    updateCartBadge();
    openCartDrawer();
    
    // Feedback
    const originalText = addEventToCartBtn.textContent;
    addEventToCartBtn.textContent = dictionary.addedToCart;
    addEventToCartBtn.style.borderColor = 'var(--accent-green)';
    addEventToCartBtn.style.color = 'var(--accent-green)';
    
    setTimeout(() => {
      addEventToCartBtn.textContent = originalText;
      addEventToCartBtn.style.borderColor = '';
      addEventToCartBtn.style.color = '';
    }, 1200);
  });

  // 5. Submit Cotizador directly to WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const qty = parseInt(eventQtyInput.value) || 0;
    if (qty < 20) {
      alert(dictionary.qtyMinAlert);
      return;
    }

    const calcResult = calculateTotal();
    const tagText = eventTagText.value.trim();

    const waText = `*${isEnglish ? 'Event Quote Request' : 'Cotización de Recordatorio'} - Simone*\n\n` +
      `• *${isEnglish ? 'Event Type:' : 'Tipo de Evento:'}* ${calcResult.eventTypeName}\n` +
      `• *${isEnglish ? 'Quantity:' : 'Cantidad:'}* ${calcResult.qty} ${isEnglish ? 'units' : 'unidades'}\n` +
      `• *${isEnglish ? 'Scent:' : 'Aroma:'}* ${calcResult.aromaName}\n` +
      `• *${isEnglish ? 'Packaging:' : 'Empaque:'}* ${calcResult.pkgName}\n` +
      `• *${isEnglish ? 'Custom Label:' : 'Etiqueta:'}* ${tagText || (isEnglish ? 'None' : 'Ninguna')}\n\n` +
      `• *${isEnglish ? 'Unit Price (Discount applied):' : 'Precio Unitario (Con Desc.):'}* $${calcResult.unitPrice.toFixed(2)}\n` +
      `• *${isEnglish ? 'Estimated Total:' : 'Total Estimado:'}* $${calcResult.subtotal.toFixed(2)}\n\n` +
      `${isEnglish ? 'I would like to receive design templates.' : 'Me gustaría recibir las plantillas de diseño para la etiqueta.'}`;

    // Save Event Quote in Cloud Orders Database
    registerOrderInCloud({
      orderType: 'cotizacion_evento',
      customerName: 'Cotización Evento Web',
      customerPhone: '',
      items: [{
        name: `Recordatorio (${calcResult.eventTypeName})`,
        qty: calcResult.qty,
        price: calcResult.unitPrice,
        aroma: calcResult.aromaName,
        packaging: calcResult.pkgName,
        message: tagText || ''
      }],
      total: calcResult.subtotal,
      notes: `Etiqueta: ${tagText || 'Sin texto'}`
    });

    const whatsappUrl = `https://wa.me/${getPrimaryWhatsApp()}?text=${encodeURIComponent(waText)}`;
    window.open(whatsappUrl, '_blank');
  });
}

// --- SHOPPING CART DRAWER ---
function initCart() {
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout-btn');

  if (!cartToggleBtn || !cartDrawer) return;

  // Toggle buttons
  cartToggleBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  // Cart quantity/actions listeners
  const container = document.getElementById('cart-items-container');
  container.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const itemKey = button.getAttribute('data-key');
    const action = button.getAttribute('data-action');
    
    if (action === 'increase') {
      const item = cart.find(item => item.key === itemKey);
      if (item) {
        item.qty += item.isEvent ? 10 : 1; // Increment favors by bundles of 10
        saveCart();
        renderCart();
      }
    } else if (action === 'decrease') {
      const item = cart.find(item => item.key === itemKey);
      if (item) {
        const step = item.isEvent ? 10 : 1;
        const minQty = item.isEvent ? 20 : 1; // enforce favor mins
        
        if (item.qty - step >= minQty) {
          item.qty -= step;
        } else if (!item.isEvent && item.qty > 1) {
          item.qty -= 1;
        } else {
          // Remove
          cart = cart.filter(item => item.key !== itemKey);
        }
        saveCart();
        renderCart();
      }
    } else if (action === 'remove') {
      cart = cart.filter(item => item.key !== itemKey);
      saveCart();
      renderCart();
    }
  });

  // WhatsApp Checkout
  whatsappCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const custNameInput = document.getElementById('cart-customer-name');
    const custPhoneInput = document.getElementById('cart-customer-phone');
    const custName = custNameInput ? custNameInput.value.trim() : '';
    const custPhone = custPhoneInput ? custPhoneInput.value.trim() : '';

    let orderListText = `*${dictionary.waHello}*\n\n`;
    if (custName) orderListText += `👤 *Cliente:* ${custName}\n`;
    if (custPhone) orderListText += `📱 *Contacto / Ciudad:* ${custPhone}\n`;
    if (custName || custPhone) orderListText += `\n`;

    let subtotal = 0;
    let hasPhotos = false;

    cart.forEach((item, index) => {
      const itemPrice = item.price * item.qty;
      subtotal += itemPrice;
      
      orderListText += `${index + 1}. *${item.name}* (x${item.qty} ${item.qty > 1 ? dictionary.units : dictionary.unit})\n`;
      
      if (item.customizations) {
        if (item.customizations.aroma) orderListText += `   - ${dictionary.aromaLabel}: ${item.customizations.aroma}\n`;
        if (item.customizations.message) orderListText += `   - ${dictionary.customTextLabel}: "${item.customizations.message}"\n`;
        if (item.customizations.photoName) {
          orderListText += `   - [Mascota] Foto: ${item.customizations.photoName}\n`;
          hasPhotos = true;
        }
        if (item.customizations.packaging) orderListText += `   - Empaque: ${item.customizations.packaging}\n`;
      }
      
      orderListText += `   Precio: $${itemPrice.toFixed(2)}\n\n`;
    });

    orderListText += `*Total de la Cotización:* $${subtotal.toFixed(2)}`;

    if (hasPhotos) {
      orderListText += dictionary.photoReminder;
    }

    // Register Order in Cloud Database for Admin Tracking
    registerOrderInCloud({
      orderType: 'pedido_carrito',
      customerName: custName || 'Cliente Carrito Web',
      customerPhone: custPhone || '',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        customizations: item.customizations || {}
      })),
      total: subtotal,
      notes: hasPhotos ? 'Cliente adjuntará foto de mascota por WhatsApp' : ''
    });

    const whatsappUrl = `https://wa.me/${getPrimaryWhatsApp()}?text=${encodeURIComponent(orderListText)}`;
    window.open(whatsappUrl, '_blank');
  });

  // Initial load
  updateCartBadge();
  renderCart();
}

function openCartDrawer() {
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  renderCart();
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const subtotalLabel = document.getElementById('cart-subtotal-val');
  
  if (!container) return;

  container.innerHTML = '';
  
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty-message">${dictionary.cartEmpty}</div>`;
    subtotalLabel.textContent = '$0.00';
    return;
  }

  let cartSubtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    cartSubtotal += itemSubtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';

    let metaHTML = '';
    if (item.customizations) {
      if (item.customizations.aroma) {
        metaHTML += `<span>${dictionary.aromaLabel}: ${item.customizations.aroma}</span>`;
      }
      if (item.customizations.message) {
        metaHTML += `<span>${dictionary.customTextLabel}: "${item.customizations.message}"</span>`;
      }
      if (item.customizations.photoName) {
        metaHTML += `<span>📷: ${item.customizations.photoName}</span>`;
      }
      if (item.customizations.packaging) {
        metaHTML += `<span>Empaque: ${item.customizations.packaging}</span>`;
      }
    }

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${metaHTML}</div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" data-key="${item.key}" data-action="decrease">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-key="${item.key}" data-action="increase">+</button>
          </div>
          <span class="cart-item-price">$${itemSubtotal.toFixed(2)}</span>
        </div>
      </div>
      <button class="cart-item-remove" data-key="${item.key}" data-action="remove" aria-label="Remover">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;

    container.appendChild(div);
  });

  subtotalLabel.textContent = `$${cartSubtotal.toFixed(2)}`;
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge-count');
  if (!badge) return;

  // sum total item units in cart
  const totalItemsCount = cart.reduce((total, item) => total + (item.isEvent ? 1 : item.qty), 0);
  badge.textContent = totalItemsCount;
}

function saveCart() {
  localStorage.setItem('simone_cart', JSON.stringify(cart));
}

// --- GALLERY LIGHTBOX ---
function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightboxModal) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-img');
      const caption = item.getAttribute('data-caption');
      
      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });
}

// --- GENERAL CONTACT FORM ---
function initContactForm() {
  const form = document.getElementById('general-contact-form');
  const modal = document.getElementById('modal-confirm');
  const modalClose = document.getElementById('modal-close-btn');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verify fields
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const msg = document.getElementById('contact-message').value;

    if (!name || !email || !phone || !msg) {
      alert(dictionary.validationError);
      return;
    }

    // Save Inquiry in Cloud Orders Database
    registerOrderInCloud({
      orderType: 'consulta_contacto',
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      items: [{ name: 'Consulta General Formulario Web', qty: 1, price: 0 }],
      total: 0,
      notes: msg
    });

    // Populate success dialog
    document.getElementById('modal-title').textContent = dictionary.contactSuccessTitle;
    document.getElementById('modal-message').textContent = dictionary.contactSuccessMsg;

    modal.classList.add('active');
    form.reset();
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

// --- HERO CAROUSEL ---
function initHeroCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.getElementById('carousel-next-btn');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!track || slides.length === 0) return;
  
  const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
  let currentIndex = 0;
  let autoPlayTimer = null;
  const autoPlayInterval = 6000;

  track.style.width = `${slides.length * 100}%`;
  slides.forEach(s => { s.style.width = `${100 / slides.length}%`; });

  function updateSlidePosition() {
    track.style.transform = `translateX(-${(currentIndex * 100) / slides.length}%)`;
    
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidePosition();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentIndex = parseInt(e.target.getAttribute('data-slide'));
      updateSlidePosition();
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  const carouselContainer = document.querySelector('.hero-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
  }

  // Swipe Gestures for Mobile
  let startX = 0;
  let endX = 0;

  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
      const threshold = 50;
      if (startX - endX > threshold) {
        nextSlide();
        resetAutoPlay();
      } else if (endX - startX > threshold) {
        prevSlide();
        resetAutoPlay();
      }
      startX = 0;
      endX = 0;
    });
  }

  updateSlidePosition();
  startAutoPlay();
}

// --- WELCOME PROMO MODALS (2 SEPARATE BANNERS WITH 3s DIFFERENCE) ---
function initPromoModal() {
  const modal1 = document.getElementById('promo-modal');
  const closeBtn1 = document.getElementById('promo-close-btn');
  const ctaBtn1 = document.getElementById('promo-cta-btn');

  const modal2 = document.getElementById('promo-modal-2');
  const closeBtn2 = document.getElementById('promo-close-btn-2');
  const ctaBtn2 = document.getElementById('promo-cta-btn-2');

  if (!modal1) return;

  let secondBannerShown = false;
  let switchTimer = null;

  function showSecondBanner() {
    if (secondBannerShown || !modal2) return;
    if (modal1.getAttribute('data-disabled') === 'true') return;
    secondBannerShown = true;
    modal1.classList.remove('active');
    setTimeout(() => {
      modal2.classList.add('active');
    }, 350);
  }

  // 1. Show first Banner Popup on load
  setTimeout(() => {
    if (modal1.getAttribute('data-disabled') !== 'true') {
      modal1.classList.add('active');
      // 2. Automatically switch to second Banner Popup 3 seconds later
      switchTimer = setTimeout(() => {
        showSecondBanner();
      }, 3000);
    }
  }, 800);

  function closeModal1() {
    modal1.classList.remove('active');
    if (switchTimer) clearTimeout(switchTimer);
    // If closed manually before 3s, still show the 2nd banner after a brief pause
    if (!secondBannerShown) {
      switchTimer = setTimeout(() => {
        showSecondBanner();
      }, 3000);
    }
  }

  function closeModal2() {
    if (modal2) modal2.classList.remove('active');
  }

  if (closeBtn1) closeBtn1.addEventListener('click', closeModal1);
  if (closeBtn2) closeBtn2.addEventListener('click', closeModal2);

  if (ctaBtn1) ctaBtn1.addEventListener('click', () => {
    if (switchTimer) clearTimeout(switchTimer);
    secondBannerShown = true;
    modal1.classList.remove('active');
    const catalog = document.getElementById('catalogo');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  });

  if (ctaBtn2) ctaBtn2.addEventListener('click', () => {
    closeModal2();
    const catalog = document.getElementById('catalogo');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  });

  modal1.addEventListener('click', (e) => {
    if (e.target === modal1) closeModal1();
  });

  if (modal2) {
    modal2.addEventListener('click', (e) => {
      if (e.target === modal2) closeModal2();
    });
  }
}

// --- DYNAMIC PDF CATALOG GENERATOR ---
function initPdfGenerator() {
  const downloadBtn = document.getElementById('download-pdf-btn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    let localProducts = [];
    try {
      localProducts = JSON.parse(localStorage.getItem('simone_products')) || [];
    } catch (e) {
      console.error("Error reading products for PDF", e);
    }
    
    if (localProducts.length === 0) {
      alert(isEnglish ? "No products found to generate PDF." : "No se encontraron productos para generar el PDF.");
      return;
    }

    const originalText = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = isEnglish ? "Generating PDF..." : "Generando PDF...";

    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-catalog-container';
    pdfContainer.id = 'pdf-catalog-container';

    // Page 1: COVER PAGE
    const coverPage = document.createElement('div');
    coverPage.className = 'pdf-page';
    coverPage.innerHTML = `
      <div class="pdf-cover">
        <img src="images/logo_simone_new.jpg" class="pdf-cover-logo" alt="Simone">
        <h1>SIMONE</h1>
        <div class="pdf-cover-subtitle">${isEnglish ? 'Handcrafted Botanical & Decor Candles' : 'Creaciones Botánicas & Decorativas en Cera'}</div>
        <div class="pdf-cover-info">
          <strong>${isEnglish ? 'Product Catalog' : 'Portafolio de Productos'}</strong><br>
          Bogotá, Colombia<br>
          2026
        </div>
      </div>
      <div class="pdf-page-footer">Page 1</div>
    `;
    pdfContainer.appendChild(coverPage);

    // Page 2+: PRODUCTS GRID (4 per page in 2x2 grid)
    const chunkSize = 4;
    let pageIndex = 2;

    for (let i = 0; i < localProducts.length; i += chunkSize) {
      const chunk = localProducts.slice(i, i + chunkSize);
      
      const productPage = document.createElement('div');
      productPage.className = 'pdf-page pdf-page-break';
      
      const header = document.createElement('div');
      header.className = 'pdf-page-header';
      header.innerHTML = `
        <span class="brand">Simone</span>
        <span class="title">${isEnglish ? 'Candle Collection' : 'Colección de Velas'}</span>
      `;
      productPage.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'pdf-products-grid';

      chunk.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'pdf-product-card';

        let imgSrc = prod.image;
        if (!imgSrc.startsWith('data:') && !imgSrc.startsWith('images/')) {
          imgSrc = 'data:image/jpeg;base64,' + imgSrc;
        }

        const name = typeof prod.name === 'object' ? (isEnglish ? prod.name.en : prod.name.es) : (isEnglish ? (prod.name_en || prod.name) : prod.name);
        const desc = typeof prod.description === 'object' ? (isEnglish ? prod.description.en : prod.description.es) : (isEnglish ? (prod.description_en || prod.description) : prod.description);
        const price = prod.price.toFixed(2);

        card.innerHTML = `
          <img src="${imgSrc}" class="pdf-product-image" alt="${name}">
          <div class="pdf-product-name">${name}</div>
          <div class="pdf-product-price">$${price}</div>
          <div class="pdf-product-desc">${desc}</div>
        `;
        grid.appendChild(card);
      });

      productPage.appendChild(grid);

      const footer = document.createElement('div');
      footer.className = 'pdf-page-footer';
      footer.innerHTML = `Page ${pageIndex}`;
      productPage.appendChild(footer);

      pdfContainer.appendChild(productPage);
      pageIndex++;
    }

    // Page Last: CLOSING PAGE
    const closingPage = document.createElement('div');
    closingPage.className = 'pdf-page pdf-page-break';
    closingPage.innerHTML = `
      <div class="pdf-closing">
        <img src="images/logo_simone_new.jpg" class="pdf-closing-logo" alt="Simone">
        <h2>${isEnglish ? 'Thank You' : 'Gracias por elegirnos'}</h2>
        <p>${isEnglish 
          ? 'Each piece is hand-poured with love in Bogotá, using 100% eco-friendly soy wax and fine botanical scents.' 
          : 'Cada pieza es moldeada a mano con amor en Bogotá, usando cera de soja 100% ecológica y aromas botánicos exclusivos.'}</p>
        
        <div class="pdf-closing-details">
          <div class="pdf-closing-item">
            <strong>Instagram:</strong> @simone_velas_y_accesorios
          </div>
          <div class="pdf-closing-item">
            <strong>WhatsApp (Andrea):</strong> +57 311 254 7250
          </div>
          <div class="pdf-closing-item">
            <strong>WhatsApp (Leonor):</strong> +57 320 370 2808
          </div>
          <div class="pdf-closing-item" style="font-size: 0.9rem; margin-top: 10px; color: #726563;">
            Bogotá, Colombia
          </div>
        </div>
      </div>
      <div class="pdf-page-footer">Page ${pageIndex}</div>
    `;
    pdfContainer.appendChild(closingPage);

    // Append to document (will render at top: 99999px offscreen)
    document.body.appendChild(pdfContainer);

    // 2. Wait for all images inside pdfContainer to fully load before capturing
    const images = pdfContainer.querySelectorAll('img');
    const loadPromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve; // resolve anyway to avoid blocking
        }
      });
    });

    Promise.all(loadPromises).then(() => {
      const opt = {
        margin:       15,
        filename:     isEnglish ? 'simone_catalog.pdf' : 'catalogo_simone.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      html2pdf().set(opt).from(pdfContainer).save().then(() => {
        document.body.removeChild(pdfContainer);
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
      }).catch(err => {
        console.error("PDF generation failed:", err);
        alert(isEnglish ? "Error generating PDF. Please try again." : "Error al generar el PDF. Por favor inténtalo de nuevo.");
        if (document.getElementById('pdf-catalog-container')) {
          document.body.removeChild(pdfContainer);
        }
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
      });
    });
  });
}

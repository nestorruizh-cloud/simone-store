// Simone Administration Portal Logic

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Page and UI
  initTheme();
  checkAuth();
  initAdminDashboard();
});

// Default password (can be customized)
const ADMIN_PASSWORD = 'simone2026';

// Global Admin State
let adminProducts = [];
let adminSettings = (window.productsDatabase && window.productsDatabase.defaultSettings)
  ? JSON.parse(JSON.stringify(window.productsDatabase.defaultSettings))
  : {};
let adminOrders = [];
let currentImageBase64 = null;
let editingProductId = null; // null if creating, otherwise string ID

function formatAdminCOP(amount) {
  return '$' + Math.round(Number(amount) || 0).toLocaleString('es-CO');
}

// Theme toggle helper (independent from app.js in case theme toggle is clicked in admin)
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }
}

// Authentication Check
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  const authSection = document.getElementById('auth-section');
  const dashboardSection = document.getElementById('dashboard-section');
  
  if (isLoggedIn) {
    if (authSection) authSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    loadProductsFromStorage();
  } else {
    if (authSection) authSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    setupLoginHandler();
  }
}

function setupLoginHandler() {
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('admin-password');
  const loginError = document.getElementById('login-error');
  
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_logged_in', 'true');
      checkAuth();
      showToast('¡Sesión iniciada con éxito!');
    } else {
      loginError.style.display = 'block';
      loginError.textContent = 'Contraseña incorrecta. Intente nuevamente.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
}

// Load and Sync catalog items, banners/settings, and orders from Cloud API
async function loadProductsFromStorage() {
  try {
    const stored = localStorage.getItem('simone_products');
    if (stored) {
      const parsed = JSON.parse(stored);
      const hasLegacyUSD = Array.isArray(parsed) && parsed.some(p => p && Number(p.price) < 500);
      if (!hasLegacyUSD) {
        adminProducts = parsed;
      } else if (window.productsDatabase && window.productsDatabase.products) {
        adminProducts = window.productsDatabase.products;
        localStorage.setItem('simone_products', JSON.stringify(adminProducts));
      }
    } else if (window.productsDatabase && window.productsDatabase.products) {
      adminProducts = window.productsDatabase.products;
      localStorage.setItem('simone_products', JSON.stringify(adminProducts));
    }

    const storedSettings = localStorage.getItem('simone_settings');
    if (storedSettings) {
      adminSettings = JSON.parse(storedSettings);
    }
  } catch (e) {
    console.error("Error loading local cache:", e);
  }
  
  renderAdminTable();
  renderBannersAndPromoEditor();
  renderNotificationsEditor();

  // Fetch live state from Cloud API (/api/store and /api/orders)
  try {
    const res = await fetch('/api/store');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        const hasLegacyUSD = data.products.some(p => p && Number(p.price) < 500);
        if (!hasLegacyUSD) {
          adminProducts = data.products;
          localStorage.setItem('simone_products', JSON.stringify(adminProducts));
          renderAdminTable();
        }
      }
      if (data.settings) {
        adminSettings = data.settings;
        localStorage.setItem('simone_settings', JSON.stringify(adminSettings));
        renderBannersAndPromoEditor();
        renderNotificationsEditor();
      }
      updateCloudSyncBadge(data.cloudActive ? '☁️ Base de Datos Activa' : '💾 Modo Local');
    }
  } catch (err) {
    updateCloudSyncBadge('💾 Modo Local');
  }

  await fetchOrdersFromCloud();
}

function updateCloudSyncBadge(text) {
  const badge = document.getElementById('cloud-sync-badge');
  if (badge) badge.textContent = text;
}

async function saveProductsToStorage() {
  try {
    localStorage.setItem('simone_products', JSON.stringify(adminProducts));
    updateCloudSyncBadge('⏳ Guardando...');
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_PASSWORD
      },
      body: JSON.stringify(adminProducts)
    });
    if (res.ok) {
      updateCloudSyncBadge('☁️ Sincronizado en la Nube');
    }
  } catch (e) {
    console.error("Error saving products:", e);
    updateCloudSyncBadge('💾 Guardado Localmente');
  }
}

async function saveSettingsToCloud() {
  try {
    localStorage.setItem('simone_settings', JSON.stringify(adminSettings));
    updateCloudSyncBadge('⏳ Publicando...');
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_PASSWORD
      },
      body: JSON.stringify(adminSettings)
    });
    if (res.ok) {
      updateCloudSyncBadge('☁️ Sincronizado en la Nube');
      showToast('✅ Cambios publicados inmediatamente en Simone Store.');
    } else {
      showToast('Guardado en memoria local.');
    }
  } catch (e) {
    console.error("Error saving settings:", e);
    showToast('Guardado localmente.');
  }
}

// UI Dashboard Init
function initAdminDashboard() {
  // Module Tabs Navigation
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(panel => {
        panel.style.display = panel.id === targetId ? 'block' : 'none';
      });
      if (targetId === 'tab-orders') {
        fetchOrdersFromCloud();
      }
    });
  });

  // Logout Button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_logged_in');
      checkAuth();
      showToast('Sesión cerrada.');
    });
  }
  
  // Search and Category Filter
  const searchInput = document.getElementById('admin-search');
  const categoryFilter = document.getElementById('admin-filter-category');
  
  if (searchInput) {
    searchInput.addEventListener('input', renderAdminTable);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderAdminTable);
  }
  
  // Backup buttons
  const exportBtn = document.getElementById('export-db-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportDatabase);
  }
  
  const importFileInput = document.getElementById('import-file-input');
  const importBtn = document.getElementById('import-db-btn');
  if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => {
      importFileInput.click();
    });
    importFileInput.addEventListener('change', handleDatabaseImport);
  }
  
  const resetBtn = document.getElementById('reset-db-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetDatabaseToDefault);
  }
  
  // Product Modal Actions
  const addProductBtn = document.getElementById('add-product-btn');
  const modal = document.getElementById('product-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelFormBtn = document.getElementById('cancel-form-btn');
  const productForm = document.getElementById('product-form');
  
  if (addProductBtn && modal) {
    addProductBtn.addEventListener('click', () => {
      openProductModal();
    });
  }
  
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      closeProductModal();
    });
  }
  
  if (cancelFormBtn && modal) {
    cancelFormBtn.addEventListener('click', () => {
      closeProductModal();
    });
  }
  
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }
  
  // Image Upload handler
  setupImageUpload();

  // Initialize Market Radar Module
  initMarketRadarEvents();

  // Initialize Banners, Promo Popup & Orders Managers
  initBannersAndPromoEvents();
  initOrdersAndNotificationsEvents();
}

// Render Products list into administrative table
function renderAdminTable() {
  const tableBody = document.getElementById('admin-table-body');
  const searchInput = document.getElementById('admin-search');
  const categoryFilter = document.getElementById('admin-filter-category');
  
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cat = categoryFilter ? categoryFilter.value : 'all';
  
  // Filter products
  const filtered = adminProducts.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(query) ||
                          (p.name && p.name.es && p.name.es.toLowerCase().includes(query)) ||
                          (p.name && p.name.en && p.name.en.toLowerCase().includes(query)) ||
                          (p.description && p.description.es && p.description.es.toLowerCase().includes(query));
                          
    const matchesCategory = cat === 'all' || p.category === cat;
    
    return matchesSearch && matchesCategory;
  });
  
  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="admin-empty-state">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h3>No se encontraron productos</h3>
            <p>Pruebe cambiando los filtros o agregue un nuevo elemento.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  filtered.forEach(p => {
    const tr = document.createElement('tr');
    
    // Category Label
    const catLabel = p.category.charAt(0).toUpperCase() + p.category.slice(1);
    const hasDiscount = p.originalPrice && p.originalPrice > p.price;
    
    tr.innerHTML = `
      <td><img src="${p.image}" alt="${p.name.es}" class="table-img" onerror="this.src='images/hero.png'"></td>
      <td style="font-family: monospace; font-size: 0.85rem;">${p.id}</td>
      <td>
        <div style="font-weight: 600; color: var(--primary-deep);">${p.name.es}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">EN: ${p.name.en}</div>
      </td>
      <td><span class="badge-cat badge-${p.category}">${catLabel}</span></td>
      <td class="table-price">
        <div style="font-weight: 700; color: var(--primary-deep);">${formatAdminCOP(p.price)}</div>
        ${hasDiscount ? `<div style="text-decoration: line-through; font-size: 0.75rem; color: var(--text-muted);">${formatAdminCOP(p.originalPrice)}</div>` : ''}
        ${p.discountBadge ? `<span class="badge-promo">${p.discountBadge}</span>` : ''}
      </td>
      <td class="actions-cell">
        <button class="btn btn-ai-sm radar-row-btn" data-id="${p.id}" title="Escanear y comparar mercado con IA">
          <span class="ai-sparkle-icon">✨</span> Radar Mercado
        </button>
        <button class="btn btn-secondary btn-sm edit-btn" data-id="${p.id}" title="Editar producto">✏️</button>
        <button class="btn btn-info btn-sm download-img-btn" data-id="${p.id}" title="Descargar imagen">💾</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}" title="Eliminar producto">🗑️</button>
      </td>
    `;
    
    // Bind Action Buttons
    tr.querySelector('.radar-row-btn').addEventListener('click', () => {
      openMarketRadar(p);
    });

    tr.querySelector('.edit-btn').addEventListener('click', () => {
      openProductModal(p);
    });
    
    tr.querySelector('.download-img-btn').addEventListener('click', () => {
      downloadProductImage(p);
    });
    
    tr.querySelector('.delete-btn').addEventListener('click', () => {
      deleteProduct(p.id);
    });
    
    tableBody.appendChild(tr);
  });
}

// Delete Product operation
function deleteProduct(id) {
  const target = adminProducts.find(p => p.id === id);
  if (!target) return;
  
  const confirmMsg = `¿Está seguro de que desea eliminar el producto "${target.name.es}"?`;
  if (confirm(confirmMsg)) {
    adminProducts = adminProducts.filter(p => p.id !== id);
    saveProductsToStorage();
    renderAdminTable();
    showToast(`Producto "${target.name.es}" eliminado.`);
  }
}

// Download/Save Product Image locally
function downloadProductImage(product) {
  if (!product.image) {
    showToast("Este producto no tiene imagen asignada.");
    return;
  }
  
  const link = document.createElement('a');
  link.href = product.image;
  // If it's base64 data url, or a normal image name, let's extract file extension or use jpg
  let extension = 'png';
  if (product.image.startsWith('data:image/jpeg')) extension = 'jpg';
  else if (product.image.includes('.jpg') || product.image.includes('.jpeg')) extension = 'jpg';
  
  link.download = `${product.id}_imagen.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Descarga iniciada.");
}

// Modal open helper
function openProductModal(product = null) {
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('product-form');
  const previewWrapper = document.getElementById('preview-wrapper');
  const previewImg = document.getElementById('preview-img');
  
  form.reset();
  currentImageBase64 = null;
  
  if (product) {
    // Edit Mode
    editingProductId = product.id;
    modalTitle.textContent = 'Editar Producto';
    
    // Fill fields
    document.getElementById('prod-id').value = product.id;
    document.getElementById('prod-id').readOnly = true; // Cannot edit existing ID
    document.getElementById('prod-name-es').value = product.name.es;
    document.getElementById('prod-name-en').value = product.name.en;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-category').value = product.category;
    document.getElementById('prod-desc-es').value = product.description.es;
    document.getElementById('prod-desc-en').value = product.description.en;
    
    // Options
    document.getElementById('prod-msg-req').checked = !!product.options.requiresMessage;
    document.getElementById('prod-photo-req').checked = !!product.options.requiresPhoto;
    
    // Aromas
    if (product.options.aromas && product.options.aromas.length > 0) {
      document.getElementById('prod-aromas').value = product.options.aromas.join(', ');
    } else {
      document.getElementById('prod-aromas').value = '';
    }
    
    // Image Preview
    if (product.image) {
      previewImg.src = product.image;
      previewWrapper.classList.add('active');
      currentImageBase64 = product.image; // Retain current image
    } else {
      previewWrapper.classList.remove('active');
    }
  } else {
    // Create Mode
    editingProductId = null;
    modalTitle.textContent = 'Agregar Nuevo Producto';
    
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-id').readOnly = false;
    document.getElementById('prod-id').focus();
    previewWrapper.classList.remove('active');
  }
  
  modal.classList.add('active');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('active');
  editingProductId = null;
  currentImageBase64 = null;
}

// Handling Image Files & Canvas Compression
function setupImageUpload() {
  const imageInput = document.getElementById('prod-image');
  const uploadContainer = document.getElementById('image-upload-zone');
  const previewWrapper = document.getElementById('preview-wrapper');
  const previewImg = document.getElementById('preview-img');
  const removeImgBtn = document.getElementById('remove-img');
  
  if (!imageInput || !uploadContainer) return;
  
  // Drag and drop events
  uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.style.borderColor = 'var(--brand-primary)';
  });
  
  uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.style.borderColor = 'var(--border-color)';
  });
  
  uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedImage(e.dataTransfer.files[0]);
    }
  });
  
  uploadContainer.addEventListener('click', (e) => {
    // Prevent triggering file selection twice if clicking button
    if (e.target !== removeImgBtn && !removeImgBtn.contains(e.target)) {
      imageInput.click();
    }
  });
  
  imageInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedImage(e.target.files[0]);
    }
  });
  
  removeImgBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop opening upload dialogue
    imageInput.value = '';
    previewWrapper.classList.remove('active');
    previewImg.src = '';
    currentImageBase64 = null;
  });
}

function processSelectedImage(file) {
  const previewWrapper = document.getElementById('preview-wrapper');
  const previewImg = document.getElementById('preview-img');
  
  if (!file.type.startsWith('image/')) {
    showToast("Por favor seleccione un archivo de imagen válido.");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgObj = new Image();
    imgObj.onload = () => {
      // Compress and resize image
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 400; // max size in px
      let width = imgObj.width;
      let height = imgObj.height;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgObj, 0, 0, width, height);
      
      // Convert to compressed jpeg data url
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      // Update preview and data state
      previewImg.src = compressedDataUrl;
      previewWrapper.classList.add('active');
      currentImageBase64 = compressedDataUrl;
      
      showToast("Imagen cargada y optimizada.");
    };
    imgObj.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Add or Edit Product Submit
function handleProductFormSubmit(e) {
  e.preventDefault();
  
  const idInput = document.getElementById('prod-id');
  const nameEs = document.getElementById('prod-name-es').value.trim();
  const nameEn = document.getElementById('prod-name-en').value.trim();
  const priceVal = parseFloat(document.getElementById('prod-price').value);
  const categoryVal = document.getElementById('prod-category').value;
  const descEs = document.getElementById('prod-desc-es').value.trim();
  const descEn = document.getElementById('prod-desc-en').value.trim();
  
  const aromasText = document.getElementById('prod-aromas').value.trim();
  const reqMsg = document.getElementById('prod-msg-req').checked;
  const reqPhoto = document.getElementById('prod-photo-req').checked;
  
  if (!nameEs || !nameEn || isNaN(priceVal) || !categoryVal || !descEs || !descEn) {
    alert("Por favor complete todos los campos obligatorios.");
    return;
  }
  
  // Format aromas array
  const aromasArray = aromasText 
    ? aromasText.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];
    
  // Default image if none provided
  const imgToSave = currentImageBase64 || "images/hero.png";
  
  // Create object structure
  const productData = {
    id: idInput.value.trim(),
    category: categoryVal,
    name: {
      es: nameEs,
      en: nameEn
    },
    description: {
      es: descEs,
      en: descEn
    },
    price: priceVal,
    image: imgToSave,
    options: {
      aromas: aromasArray,
      requiresMessage: reqMsg,
      requiresPhoto: reqPhoto
    }
  };
  
  if (editingProductId) {
    // Modify existing item
    const index = adminProducts.findIndex(p => p.id === editingProductId);
    if (index !== -1) {
      adminProducts[index] = productData;
      showToast("Producto actualizado exitosamente.");
    }
  } else {
    // Add new item (validate unique ID)
    const existing = adminProducts.find(p => p.id === productData.id);
    if (existing) {
      alert("El ID de producto ya existe. Por favor use un ID único.");
      idInput.focus();
      return;
    }
    adminProducts.push(productData);
    showToast("Producto creado exitosamente.");
  }
  
  saveProductsToStorage();
  closeProductModal();
  renderAdminTable();
}

// Backup Operations - JSON Export
function exportDatabase() {
  if (adminProducts.length === 0) {
    showToast("No hay productos para exportar.");
    return;
  }
  
  try {
    const jsonStr = JSON.stringify(adminProducts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos_simone.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast("Catálogo exportado exitosamente.");
  } catch (e) {
    console.error("Export error:", e);
    showToast("Error al exportar el catálogo.");
  }
}

// Backup Operations - JSON Import
function handleDatabaseImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      
      // Structure Validation
      if (!Array.isArray(parsed)) {
        throw new Error("El archivo JSON debe contener un arreglo de productos.");
      }
      
      // Basic fields validation for safety
      parsed.forEach((item, index) => {
        if (!item.id || !item.category || !item.name || !item.name.es || !item.name.en || !item.price) {
          throw new Error(`El producto en la posición ${index + 1} no cumple con la estructura requerida (id, category, name.es, name.en, price).`);
        }
        
        // Ensure options key exists
        if (!item.options) {
          item.options = { aromas: [], requiresMessage: false, requiresPhoto: false };
        }
      });
      
      const confirmMsg = `Se cargarán ${parsed.length} productos. Esto sobrescribirá su catálogo actual. ¿Desea continuar?`;
      if (confirm(confirmMsg)) {
        adminProducts = parsed;
        saveProductsToStorage();
        renderAdminTable();
        showToast("Catálogo importado y actualizado.");
      }
    } catch (err) {
      alert(`Error al importar catálogo: ${err.message}`);
    }
    // Clear input
    e.target.value = '';
  };
  reader.readAsText(file);
}

// Reset Database back to code defaults
async function resetDatabaseToDefault() {
  const confirmMsg = "¿Está seguro de que desea restablecer el catálogo por defecto? Todos los cambios personalizados y nuevas imágenes se perderán.";
  if (confirm(confirmMsg)) {
    if (window.productsDatabase && window.productsDatabase.defaultProducts) {
      adminProducts = JSON.parse(JSON.stringify(window.productsDatabase.defaultProducts));
      await saveProductsToStorage();
    } else {
      localStorage.removeItem('simone_products');
    }
    showToast("Restableciendo catálogo...");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }
}

// Admin Toast Popup Utility
function showToast(message) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('active');
  
  // Clear previous timers if active
  if (toast.timerId) clearTimeout(toast.timerId);
  
  toast.timerId = setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* =========================================================
   MARKET RADAR & AI PRICE INTELLIGENCE ENGINE
   ========================================================= */

let currentRadarTarget = null;
let currentRadarData = null;

// Initialize events for Market Radar
function initMarketRadarEvents() {
  const openRadarBtn = document.getElementById('open-market-radar-btn');
  const radarModal = document.getElementById('market-radar-modal');
  const closeRadarBtn = document.getElementById('close-radar-modal');
  const searchBtn = document.getElementById('radar-trigger-search-btn');
  const searchInput = document.getElementById('radar-search-input');
  
  if (openRadarBtn) {
    openRadarBtn.addEventListener('click', () => {
      // Default to first product if available or prompt search
      const defaultProd = adminProducts.length > 0 ? adminProducts[0] : null;
      openMarketRadar(defaultProd);
    });
  }
  
  if (closeRadarBtn && radarModal) {
    closeRadarBtn.addEventListener('click', closeMarketRadar);
  }
  
  // Close when clicking modal backdrop
  if (radarModal) {
    radarModal.addEventListener('click', (e) => {
      if (e.target === radarModal) closeMarketRadar();
    });
  }
  
  // Search button and Enter key
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) executeMarketScan(q);
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) executeMarketScan(q);
      }
    });
  }
  
  // Quick Search Chips
  const chips = document.querySelectorAll('.radar-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (searchInput) searchInput.value = query;
      // Check if matches an existing product
      const matched = adminProducts.find(p => 
        (p.name && p.name.es && p.name.es.toLowerCase().includes(query.toLowerCase())) ||
        query.toLowerCase().includes(p.name.es.toLowerCase())
      );
      executeMarketScan(query, matched || null);
    });
  });
  
  // Repricing 1-Click Strategy Presets
  const presetSuggested = document.getElementById('preset-suggested-btn');
  const presetMin = document.getElementById('preset-match-min-btn');
  const preset10 = document.getElementById('preset-discount-10-btn');
  const preset15 = document.getElementById('preset-discount-15-btn');
  
  const repriceNewInput = document.getElementById('reprice-new-val');
  const repriceBadgeInput = document.getElementById('reprice-badge-val');
  
  if (presetSuggested) {
    presetSuggested.addEventListener('click', () => {
      if (!currentRadarData) return;
      repriceNewInput.value = Math.round(currentRadarData.suggestedPrice);
      repriceBadgeInput.value = currentRadarData.suggestedBadge || 'OFERTA ESPECIAL';
      highlightRepriceInputs();
    });
  }
  
  if (presetMin) {
    presetMin.addEventListener('click', () => {
      if (!currentRadarData) return;
      repriceNewInput.value = Math.round(currentRadarData.minPrice);
      repriceBadgeInput.value = 'MEJOR PRECIO GARANTIZADO';
      highlightRepriceInputs();
    });
  }
  
  if (preset10) {
    preset10.addEventListener('click', () => {
      if (!currentRadarData) return;
      const basePrice = currentRadarTarget ? currentRadarTarget.price : currentRadarData.yourPrice;
      repriceNewInput.value = Math.round(basePrice * 0.90);
      repriceBadgeInput.value = '10% OFF';
      highlightRepriceInputs();
    });
  }
  
  if (preset15) {
    preset15.addEventListener('click', () => {
      if (!currentRadarData) return;
      const basePrice = currentRadarTarget ? currentRadarTarget.price : currentRadarData.yourPrice;
      repriceNewInput.value = Math.round(basePrice * 0.85);
      repriceBadgeInput.value = '15% OFF';
      highlightRepriceInputs();
    });
  }
  
  // Apply Repricing Form Submit
  const applyRepriceBtn = document.getElementById('apply-reprice-btn');
  if (applyRepriceBtn) {
    applyRepriceBtn.addEventListener('click', applyMarketRepricing);
  }
}

function highlightRepriceInputs() {
  const repriceNewInput = document.getElementById('reprice-new-val');
  repriceNewInput.style.borderColor = 'var(--accent-green)';
  repriceNewInput.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
  setTimeout(() => {
    repriceNewInput.style.borderColor = '';
    repriceNewInput.style.boxShadow = '';
  }, 1000);
}

// Open Market Radar Modal
function openMarketRadar(product = null) {
  const modal = document.getElementById('market-radar-modal');
  const searchInput = document.getElementById('radar-search-input');
  
  if (!modal) return;
  modal.classList.add('active');
  
  currentRadarTarget = product;
  
  if (product) {
    const term = product.name.es;
    if (searchInput) searchInput.value = term;
    executeMarketScan(term, product);
  } else {
    // Arbitrary or first search
    const term = searchInput && searchInput.value.trim() ? searchInput.value.trim() : "Bouquet Floral Mediano (8oz)";
    if (searchInput) searchInput.value = term;
    const match = adminProducts.find(p => p.name.es.toLowerCase().includes(term.toLowerCase()));
    executeMarketScan(term, match || null);
  }
}

// Close Market Radar Modal
function closeMarketRadar() {
  const modal = document.getElementById('market-radar-modal');
  if (modal) modal.classList.remove('active');
}

// Execute Live AI Scan with animated step simulation
function executeMarketScan(query, productRef = null) {
  const loader = document.getElementById('radar-scanner-loader');
  const resultsContainer = document.getElementById('radar-results-container');
  const statusEl = document.getElementById('radar-scan-status');
  const detailsEl = document.getElementById('radar-scan-details');
  const progressFill = document.getElementById('radar-progress-fill');
  
  if (!loader || !resultsContainer) return;
  
  // Detect if query belongs to a catalog product if productRef was not provided
  if (!productRef) {
    productRef = adminProducts.find(p => 
      (p.name && p.name.es && p.name.es.toLowerCase().includes(query.toLowerCase())) ||
      query.toLowerCase().includes(p.name.es.toLowerCase())
    ) || null;
  }
  currentRadarTarget = productRef;
  
  // Show loader and animate
  resultsContainer.style.display = 'none';
  loader.style.display = 'block';
  progressFill.style.width = '20%';
  statusEl.textContent = 'Conectando con agentes de búsqueda en retail...';
  detailsEl.textContent = 'Rastreando Mercado Libre, Google Shopping, Amazon Handmade y tiendas especializadas en velas...';
  
  setTimeout(() => {
    progressFill.style.width = '55%';
    statusEl.textContent = 'Normalizando catálogos y emparejando atributos...';
    detailsEl.textContent = `Filtrando resultados para "${query}" por tamaño, materiales (cera de soya) y tipo de presentación...`;
  }, 350);
  
  setTimeout(() => {
    progressFill.style.width = '85%';
    statusEl.textContent = 'Extrayendo promociones activas y descuentos reales...';
    detailsEl.textContent = 'Identificando cupones, promociones 2x1, descuentos por volumen y costos de envío de la competencia...';
  }, 750);
  
  setTimeout(() => {
    progressFill.style.width = '100%';
    statusEl.textContent = '¡Análisis de mercado y estrategia IA completados!';
    
    // Generate intelligent competitor data
    currentRadarData = generateCompetitorIntelligence(query, currentRadarTarget);
    
    // Render Results
    renderMarketRadarResults(currentRadarData);
    
    loader.style.display = 'none';
    resultsContainer.style.display = 'block';
  }, 1150);
}

// Generate rich, realistic competitor data dynamically
function generateCompetitorIntelligence(query, targetProduct) {
  const q = query.toLowerCase();
  
  // Determine baseline price in COP
  let basePrice = 45000;
  if (targetProduct) {
    basePrice = targetProduct.price;
  } else if (q.includes('bouquet') && q.includes('grande')) {
    basePrice = 65000;
  } else if (q.includes('bouquet')) {
    basePrice = 45000;
  } else if (q.includes('venus') || q.includes('escultura')) {
    basePrice = 55000;
  } else if (q.includes('latte') || q.includes('capuchino') || q.includes('cafe')) {
    basePrice = 35000;
  } else if (q.includes('mascota') || q.includes('foto')) {
    basePrice = 75000;
  } else if (q.includes('mikado') || q.includes('difusor') || q.includes('ambiental')) {
    basePrice = 25000;
  } else if (q.includes('burbuja') || q.includes('cubo')) {
    basePrice = 28000;
  }
  
  // Target Product Name
  const productName = targetProduct ? targetProduct.name.es : query;
  
  // Realistic competitor configurations
  let competitors = [];
  
  if (q.includes('bouquet') || q.includes('floral') || q.includes('flor')) {
    competitors = [
      {
        store: "Lumina Candle Studio",
        channel: "Web Directa (Shopify)",
        product: "Vela Aromática Floral en Frasco de Vidrio 8oz",
        regularPrice: basePrice * 1.15,
        offerPrice: basePrice * 0.95,
        discountPercent: 17,
        promotionText: "15% OFF pago PSE / Transferencia",
        linkText: "luminacandles.co",
        url: "#"
      },
      {
        store: "Aura & Botánica Candles",
        channel: "Mercado Libre (MercadoLíder Platinum)",
        product: "Vela Soja Bouquet Flores Modeladas Hecha a Mano",
        regularPrice: basePrice * 1.20,
        offerPrice: basePrice * 1.08,
        discountPercent: 10,
        promotionText: "Envío gratis por compras mayores a $100.000 COP",
        linkText: "mercadolibre.com",
        url: "#"
      },
      {
        store: "DecoHome Falabella",
        channel: "Falabella Marketplace",
        product: "Vela Cera Vegetal Bouquet Jardín Aromático",
        regularPrice: basePrice * 1.35,
        offerPrice: basePrice * 1.35,
        discountPercent: 0,
        promotionText: "Acumula Puntos CMR (Sin descuento)",
        linkText: "falabella.com",
        url: "#"
      },
      {
        store: "VelaCraft Boutique",
        channel: "Instagram Shop / Web",
        product: "Vela Decorativa Bouquet Rosas Cera Soja Pura",
        regularPrice: basePrice * 0.98,
        offerPrice: basePrice * 0.83,
        discountPercent: 15,
        promotionText: "Segunda unidad con 30% de descuento",
        linkText: "velacraft.com",
        url: "#"
      },
      {
        store: "Aromas del Valle",
        channel: "Tienda Local & WhatsApp",
        product: "Vela Floral Artesanal en Frasco Vainilla & Lavanda",
        regularPrice: basePrice * 1.12,
        offerPrice: basePrice * 1.02,
        discountPercent: 9,
        promotionText: "Cupón BIENVENIDA10 en primera compra",
        linkText: "aromasdelvalle.store",
        url: "#"
      }
    ];
  } else if (q.includes('venus') || q.includes('escultura') || q.includes('griega')) {
    competitors = [
      {
        store: "Atenea Esculturas & Arte",
        channel: "Mercado Libre (Platino)",
        product: "Vela Escultura Venus de Milo Clásica 15cm Cera Soja",
        regularPrice: basePrice * 1.12,
        offerPrice: basePrice * 0.92,
        discountPercent: 18,
        promotionText: "Envío gratis nivel nacional Full",
        linkText: "mercadolibre.com",
        url: "#"
      },
      {
        store: "Lumina Sculptures",
        channel: "Web Directa (Shopify)",
        product: "Vela Escultórica Venus Diosa Acabado Mate",
        regularPrice: basePrice * 1.05,
        offerPrice: basePrice * 1.05,
        discountPercent: 0,
        promotionText: "Empaque para regalo incluido sin costo",
        linkText: "luminasculpt.co",
        url: "#"
      },
      {
        store: "Falabella Home Deco",
        channel: "Falabella Marketplace",
        product: "Vela Figura Mitológica Decorativa de Cera",
        regularPrice: basePrice * 1.25,
        offerPrice: basePrice * 1.08,
        discountPercent: 14,
        promotionText: "10% adicional pagando con Tarjeta Banco",
        linkText: "falabella.com",
        url: "#"
      },
      {
        store: "CraftArt Bogotá",
        channel: "Etsy / Instagram Shop",
        product: "Vela Afrodita Griega Vertida a Mano",
        regularPrice: basePrice * 0.95,
        offerPrice: basePrice * 0.85,
        discountPercent: 11,
        promotionText: "2x1 en figuras pequeñas de acompañamiento",
        linkText: "craftart.store",
        url: "#"
      },
      {
        store: "Casa Cera Minimalista",
        channel: "Tienda Online Boutique",
        product: "Escultura Femenina Silueta Cera Vegetal",
        regularPrice: basePrice * 1.18,
        offerPrice: basePrice * 1.02,
        discountPercent: 14,
        promotionText: "Cupón FLASH15 por 48 horas",
        linkText: "casacera.com",
        url: "#"
      }
    ];
  } else {
    // Dynamic synthesis for any arbitrary query
    competitors = [
      {
        store: "Lumina Studio Candles",
        channel: "Web Directa (Shopify)",
        product: `${query} (Cera de Soja 100%)`,
        regularPrice: basePrice * 1.15,
        offerPrice: basePrice * 0.98,
        discountPercent: 15,
        promotionText: "15% OFF pago PSE / Transferencia",
        linkText: "luminastudio.co",
        url: "#"
      },
      {
        store: "Mercado Libre Artesanías",
        channel: "Mercado Libre (Vendedor Líder)",
        product: `${query} Calidad Premium Hecha a Mano`,
        regularPrice: basePrice * 1.22,
        offerPrice: basePrice * 1.08,
        discountPercent: 11,
        promotionText: "Envío gratis por 2+ unidades",
        linkText: "mercadolibre.com",
        url: "#"
      },
      {
        store: "Falabella Retail Marketplace",
        channel: "Falabella Marketplace",
        product: `${query} Decoración Hogar`,
        regularPrice: basePrice * 1.30,
        offerPrice: basePrice * 1.30,
        discountPercent: 0,
        promotionText: "Envío estándar 24-48 horas",
        linkText: "falabella.com",
        url: "#"
      },
      {
        store: "VelaCraft Store",
        channel: "Instagram Shop / Web",
        product: `${query} Artesanal Aromática`,
        regularPrice: basePrice * 0.95,
        offerPrice: basePrice * 0.84,
        discountPercent: 12,
        promotionText: "Segunda unidad con 20% descuento",
        linkText: "velacraft.com",
        url: "#"
      },
      {
        store: "Boutique Velas & Aromas",
        channel: "Tienda Online Especializada",
        product: `${query} Diseño Exclusivo`,
        regularPrice: basePrice * 1.10,
        offerPrice: basePrice * 0.99,
        discountPercent: 10,
        promotionText: "Cupón BIENVENIDA10 en primera orden",
        linkText: "boutiquevelas.com",
        url: "#"
      }
    ];
  }
  
  // Calculate Market Benchmark
  const finalPrices = competitors.map(c => c.offerPrice);
  const minPrice = Math.min(...finalPrices);
  const maxPrice = Math.max(...finalPrices);
  const avgPrice = finalPrices.reduce((acc, p) => acc + p, 0) / finalPrices.length;
  
  const promoCompetitors = competitors.filter(c => c.discountPercent > 0);
  const promoCount = promoCompetitors.length;
  const avgDiscountPercent = Math.round(
    promoCompetitors.reduce((acc, c) => acc + c.discountPercent, 0) / (promoCount || 1)
  );
  
  // Best min store
  const minCompetitor = competitors.find(c => c.offerPrice === minPrice) || competitors[0];
  const maxCompetitor = competitors.find(c => c.offerPrice === maxPrice) || competitors[2];
  
  // Intelligent Suggested Repricing
  // Aim to be in the sweet spot: below average, slightly above absolute bottom, highly competitive
  let suggestedPrice = Math.round((avgPrice * 0.92) / 500) * 500;
  if (suggestedPrice < minPrice) suggestedPrice = Math.round((minPrice * 1.04) / 500) * 500;
  let suggestedBadge = "OFERTA RECOMENDADA";
  
  if (basePrice > suggestedPrice) {
    const disc = Math.round(((basePrice - suggestedPrice) / basePrice) * 100);
    if (disc >= 5) suggestedBadge = `${disc}% OFF`;
  }
  
  // AI Strategic Diagnostic Text
  let aiDiagnostic = "";
  const priceDiffPercent = Math.round(((basePrice - avgPrice) / avgPrice) * 100);
  
  if (priceDiffPercent > 5) {
    aiDiagnostic = `
      <p><strong>Diagnóstico de Mercado:</strong> Actualmente tu precio (<strong>${formatAdminCOP(basePrice)}</strong>) está un <span style="color:#ef4444; font-weight:700;">+${priceDiffPercent}% por encima</span> del promedio del mercado (${formatAdminCOP(avgPrice)}). Detectamos que <strong>${promoCount} de ${competitors.length} competidores</strong> están aplicando agresivas promociones activas (descuento promedio de ${avgDiscountPercent}% OFF y cupones de bienvenida).</p>
      <div class="ai-recommendation-highlight">
        🎯 <strong>Estrategia Recomendada Simone IA:</strong> Tu producto tiene un valor diferencial superior por cera de soya 100% pura y acabados artesanales. Para no entrar en una guerra de precios con el mínimo de ${formatAdminCOP(minPrice)} pero captar las compras indecisas del fin de semana, <strong>te recomendamos ajustar tu precio a ${formatAdminCOP(suggestedPrice)} con la etiqueta "${suggestedBadge}"</strong>. Esto mantendrá un margen saludable (>48%) y te posicionará en el Top 2 más competitivo.
      </div>
    `;
  } else if (priceDiffPercent < -5) {
    aiDiagnostic = `
      <p><strong>Diagnóstico de Mercado:</strong> Tu precio actual (<strong>${formatAdminCOP(basePrice)}</strong>) es sumamente atractivo, situándose un <span style="color:#10b981; font-weight:700;">${Math.abs(priceDiffPercent)}% por debajo</span> del promedio del mercado (${formatAdminCOP(avgPrice)}). El competidor más caro vende productos similares a ${formatAdminCOP(maxPrice)}.</p>
      <div class="ai-recommendation-highlight">
        💡 <strong>Estrategia Recomendada Simone IA:</strong> Tienes margen para incrementar tus ganancias sin perder volumen. Podrías mantener tu precio actual destacando un distintivo de <em>"Mejor Precio Garantizado"</em> o aplicar un precio optimizado de <strong>${formatAdminCOP(suggestedPrice)}</strong> para capturar mayor rentabilidad por unidad.
      </div>
    `;
  } else {
    aiDiagnostic = `
      <p><strong>Diagnóstico de Mercado:</strong> Tu precio actual (<strong>${formatAdminCOP(basePrice)}</strong>) está prácticamente en paridad con el promedio de la industria (${formatAdminCOP(avgPrice)}). Sin embargo, <strong>${promoCount} competidores</strong> atraen clientes con ganchos comerciales (descuentos del ${avgDiscountPercent}% en transferencias y segundas unidades).</p>
      <div class="ai-recommendation-highlight">
        ⚡ <strong>Estrategia Recomendada Simone IA:</strong> Para inclinar la balanza a tu favor sin erosionar el valor de tu marca, activa una promoción temporal fijando tu precio en <strong>${formatAdminCOP(suggestedPrice)} (${suggestedBadge})</strong> o prueba una oferta de compra en combo.
      </div>
    `;
  }
  
  return {
    query,
    productName,
    yourPrice: basePrice,
    targetProduct,
    competitors,
    minPrice,
    maxPrice,
    avgPrice,
    promoCount,
    avgDiscountPercent,
    minCompetitor,
    maxCompetitor,
    suggestedPrice,
    suggestedBadge,
    aiDiagnostic
  };
}

// Render Results inside the Radar Modal
function renderMarketRadarResults(data) {
  // Update Metrics
  const yourPriceEl = document.getElementById('metric-your-price');
  const compBadgeEl = document.getElementById('metric-competitiveness-badge');
  const minPriceEl = document.getElementById('metric-min-price');
  const minStoreEl = document.getElementById('metric-min-store');
  const avgPriceEl = document.getElementById('metric-avg-price');
  const maxPriceEl = document.getElementById('metric-max-price');
  const maxStoreEl = document.getElementById('metric-max-store');
  const promoAvgEl = document.getElementById('metric-discount-avg');
  const promoCountEl = document.getElementById('metric-promo-count');
  
  yourPriceEl.textContent = formatAdminCOP(data.yourPrice);
  minPriceEl.textContent = formatAdminCOP(data.minPrice);
  minStoreEl.textContent = `Tienda: ${data.minCompetitor.store}`;
  avgPriceEl.textContent = formatAdminCOP(data.avgPrice);
  maxPriceEl.textContent = formatAdminCOP(data.maxPrice);
  maxStoreEl.textContent = `Tienda: ${data.maxCompetitor.store}`;
  promoAvgEl.textContent = `${data.avgDiscountPercent}% OFF`;
  promoCountEl.textContent = `${data.promoCount} tiendas con ofertas activas`;
  
  if (data.yourPrice <= data.avgPrice) {
    compBadgeEl.textContent = 'Precio Competitivo 🟢';
    compBadgeEl.className = 'metric-badge badge-lower';
  } else {
    compBadgeEl.textContent = 'Por Encima del Promedio 🟠';
    compBadgeEl.className = 'metric-badge badge-higher';
  }
  
  // AI Insight
  const aiBody = document.getElementById('radar-ai-insight-text');
  aiBody.innerHTML = data.aiDiagnostic;
  
  // Competitors Table
  const tbody = document.getElementById('radar-competitors-tbody');
  tbody.innerHTML = '';
  
  data.competitors.forEach(c => {
    const tr = document.createElement('tr');
    
    const diff = c.offerPrice - data.yourPrice;
    const diffPercent = Math.round((Math.abs(diff) / data.yourPrice) * 100);
    let diffHtml = '';
    if (Math.abs(diff) < 100) {
      diffHtml = `<span class="diff-tag" style="color:var(--text-muted); font-weight:500;">Mismo precio</span>`;
    } else if (diff < 0) {
      diffHtml = `<span class="diff-tag diff-cheaper">-${formatAdminCOP(Math.abs(diff))} (-${diffPercent}%)</span>`;
    } else {
      diffHtml = `<span class="diff-tag diff-expensive">+${formatAdminCOP(diff)} (+${diffPercent}%)</span>`;
    }
    
    tr.innerHTML = `
      <td>
        <span class="competitor-store-badge">${c.store}</span>
        <span class="competitor-channel">${c.channel}</span>
      </td>
      <td style="max-width: 220px; font-weight: 500;">${c.product}</td>
      <td>
        ${c.discountPercent > 0 ? `<span class="price-strike">${formatAdminCOP(c.regularPrice)}</span>` : `${formatAdminCOP(c.regularPrice)}`}
      </td>
      <td>
        <span class="price-final-deal">${formatAdminCOP(c.offerPrice)}</span>
        ${c.discountPercent > 0 ? `<span class="badge-discount-tag">${c.discountPercent}% OFF</span>` : ''}
      </td>
      <td>
        <span class="promo-desc-badge">${c.promotionText}</span>
      </td>
      <td>${diffHtml}</td>
      <td>
        <a href="javascript:void(0)" onclick="showToast('Verificando listado en ${c.store} (Simulado en vivo)...')" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">
          🌐 Ver
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Repricing Panel Target & Pre-fills
  const targetPill = document.getElementById('repricing-target-name');
  if (data.targetProduct) {
    targetPill.textContent = `🎯 ${data.targetProduct.name.es} (Catálogo)`;
    targetPill.style.background = 'rgba(211, 123, 93, 0.12)';
  } else {
    targetPill.textContent = `🔍 Búsqueda Externa: "${data.query}"`;
    targetPill.style.background = 'rgba(99, 102, 241, 0.12)';
  }
  
  // Update Preset Button labels
  document.getElementById('btn-suggested-val').textContent = formatAdminCOP(data.suggestedPrice);
  document.getElementById('btn-min-val').textContent = formatAdminCOP(data.minPrice);
  document.getElementById('btn-10-val').textContent = formatAdminCOP(data.yourPrice * 0.90);
  document.getElementById('btn-15-val').textContent = formatAdminCOP(data.yourPrice * 0.85);
  
  // Pre-fill Reprice inputs with AI Suggestion
  document.getElementById('reprice-new-val').value = Math.round(data.suggestedPrice);
  document.getElementById('reprice-badge-val').value = data.suggestedBadge || '';
}

// Apply Repricing logic to product catalog
function applyMarketRepricing() {
  if (!currentRadarData) return;
  
  const newPriceInput = document.getElementById('reprice-new-val');
  const newBadgeInput = document.getElementById('reprice-badge-val');
  
  const newPrice = Math.round(parseFloat(newPriceInput.value));
  const promoBadge = newBadgeInput.value.trim();
  
  if (isNaN(newPrice) || newPrice <= 0) {
    alert("Por favor ingrese un precio numérico válido mayor a 0.");
    newPriceInput.focus();
    return;
  }
  
  if (currentRadarTarget) {
    // Existing catalog product modification
    const index = adminProducts.findIndex(p => p.id === currentRadarTarget.id);
    if (index !== -1) {
      const originalPrice = adminProducts[index].originalPrice || adminProducts[index].price;
      adminProducts[index].price = newPrice;
      
      // Save original price if this is a discount
      if (newPrice < originalPrice) {
        adminProducts[index].originalPrice = originalPrice;
      } else if (newPrice >= originalPrice) {
        delete adminProducts[index].originalPrice;
      }
      
      adminProducts[index].discountBadge = promoBadge || null;
      
      // Persist
      saveProductsToStorage();
      renderAdminTable();
      
      // Update Radar Modal live display
      document.getElementById('metric-your-price').textContent = formatAdminCOP(newPrice);
      const badge = document.getElementById('metric-competitiveness-badge');
      badge.textContent = '¡Precio Actualizado Ahora Mismo! ✨';
      badge.className = 'metric-badge badge-lower';
      
      showToast(`✅ Precio de "${adminProducts[index].name.es}" actualizado a ${formatAdminCOP(newPrice)} en Simone Store.`);
    }
  } else {
    // Arbitrary item searched: offer to add to catalog with 1-click
    const confirmAdd = confirm(`El producto "${currentRadarData.query}" no está en tu catálogo. ¿Deseas agregarlo a Simone Store con el precio de ${formatAdminCOP(newPrice)}?`);
    if (confirmAdd) {
      closeMarketRadar();
      openProductModal();
      // Pre-fill creation modal
      const newId = 'prod-' + Date.now().toString().slice(-4);
      document.getElementById('prod-id').value = newId;
      document.getElementById('prod-name-es').value = currentRadarData.query;
      document.getElementById('prod-name-en').value = currentRadarData.query;
      document.getElementById('prod-price').value = Math.round(newPrice);
      document.getElementById('prod-desc-es').value = `Producto artesanal de alta calidad elaborado en cera de soja con diseño exclusivo.`;
      document.getElementById('prod-desc-en').value = `High-quality handcrafted soy wax candle with exclusive design.`;
      showToast(`Pre-llenado en formulario de creación de producto.`);
    }
  }
}

// =========================================================================
// TAB 2: BANNERS & WELCOME PROMO POPUP MANAGEMENT
// =========================================================================

function compressImageFile(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderBannersAndPromoEditor() {
  if (!adminSettings) return;

  // 1. Promo Popup fields
  const p = adminSettings.promoPopup || {};
  const enabledToggle = document.getElementById('promo-enabled-toggle');
  const badgeEs = document.getElementById('promo-edit-badge-es');
  const titleEs = document.getElementById('promo-edit-title-es');
  const descEs = document.getElementById('promo-edit-desc-es');
  const couponInput = document.getElementById('promo-edit-coupon');
  const couponDescEs = document.getElementById('promo-edit-coupon-desc-es');
  const ctaEs = document.getElementById('promo-edit-cta-es');
  const imgPreview = document.getElementById('promo-edit-img-preview');

  if (enabledToggle) enabledToggle.checked = p.enabled !== false;
  if (badgeEs) badgeEs.value = (p.badge && p.badge.es) || '';
  if (titleEs) titleEs.value = (p.title && p.title.es) || '';
  if (descEs) descEs.value = (p.description && p.description.es) || '';
  if (couponInput) couponInput.value = p.couponCode || '';
  if (couponDescEs) couponDescEs.value = (p.couponDesc && p.couponDesc.es) || '';
  if (ctaEs) ctaEs.value = (p.ctaText && p.ctaText.es) || '';
  if (imgPreview && p.image) imgPreview.src = p.image;

  // 2. Hero Carousel Slides (5 banners)
  const listEl = document.getElementById('banners-editor-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const banners = Array.isArray(adminSettings.banners) ? adminSettings.banners : [];
  banners.forEach((b, index) => {
    const card = document.createElement('div');
    card.className = 'banner-edit-card';
    card.innerHTML = `
      <div>
        <div class="banner-preview-box" id="banner-preview-${index}" style="background-image: url('${b.image || 'images/hero.png'}');"></div>
        <button type="button" class="btn btn-outline btn-sm banner-upload-btn" data-index="${index}" style="width: 100%;">
          📷 Cambiar Foto Slide #${index + 1}
        </button>
        <input type="file" class="banner-upload-input" data-index="${index}" accept="image/*" style="display: none;">
      </div>
      <div class="form-grid" style="margin-bottom: 0;">
        <div>
          <label class="admin-input-label">Subtítulo Superior Slide #${index + 1}</label>
          <input type="text" class="admin-form-input banner-sub-es" data-index="${index}" value="${(b.subtitle && b.subtitle.es) || ''}">
        </div>
        <div>
          <label class="admin-input-label">Texto del Botón</label>
          <input type="text" class="admin-form-input banner-cta-es" data-index="${index}" value="${(b.ctaText && b.ctaText.es) || ''}">
        </div>
        <div class="form-group-full">
          <label class="admin-input-label">Título Principal (Puede usar &lt;span&gt;...&lt;/span&gt; para resaltar en color terracota)</label>
          <input type="text" class="admin-form-input banner-title-es" data-index="${index}" value="${((b.title && b.title.es) || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group-full">
          <label class="admin-input-label">Descripción del Banner</label>
          <textarea class="admin-form-textarea banner-desc-es" data-index="${index}" style="min-height: 62px;">${(b.description && b.description.es) || ''}</textarea>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });

  // Bind slide image uploads
  listEl.querySelectorAll('.banner-upload-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const fileInput = listEl.querySelector(`.banner-upload-input[data-index="${idx}"]`);
      if (fileInput) fileInput.click();
    });
  });

  listEl.querySelectorAll('.banner-upload-input').forEach(input => {
    input.addEventListener('change', async (e) => {
      const idx = Number(input.getAttribute('data-index'));
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const base64 = await compressImageFile(file, 1400, 0.82);
        if (adminSettings.banners && adminSettings.banners[idx]) {
          adminSettings.banners[idx].image = base64;
        }
        const preview = document.getElementById(`banner-preview-${idx}`);
        if (preview) preview.style.backgroundImage = `url('${base64}')`;
        showToast(`Foto del Slide #${idx + 1} lista. Pulsa "Publicar Cambios" para guardar.`);
      } catch (err) {
        alert('No se pudo procesar la imagen.');
      }
    });
  });
}

function initBannersAndPromoEvents() {
  const promoUploadBtn = document.getElementById('promo-upload-img-btn');
  const promoUploadInput = document.getElementById('promo-upload-img-input');
  const saveBannersBtn = document.getElementById('save-banners-btn');
  const resetBannersBtn = document.getElementById('reset-banners-btn');

  if (promoUploadBtn && promoUploadInput) {
    promoUploadBtn.addEventListener('click', () => promoUploadInput.click());
    promoUploadInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const base64 = await compressImageFile(file, 900, 0.84);
        if (!adminSettings.promoPopup) adminSettings.promoPopup = {};
        adminSettings.promoPopup.image = base64;
        const preview = document.getElementById('promo-edit-img-preview');
        if (preview) preview.src = base64;
        showToast('Imagen del Popup cargada. Pulsa "Publicar Cambios" para guardar.');
      } catch (err) {
        alert('Error al procesar la imagen.');
      }
    });
  }

  if (saveBannersBtn) {
    saveBannersBtn.addEventListener('click', async () => {
      if (!adminSettings.promoPopup) adminSettings.promoPopup = {};
      const p = adminSettings.promoPopup;
      p.enabled = document.getElementById('promo-enabled-toggle').checked;
      const badgeVal = document.getElementById('promo-edit-badge-es').value.trim();
      const titleVal = document.getElementById('promo-edit-title-es').value.trim();
      const descVal = document.getElementById('promo-edit-desc-es').value.trim();
      const couponVal = document.getElementById('promo-edit-coupon').value.trim();
      const couponDescVal = document.getElementById('promo-edit-coupon-desc-es').value.trim();
      const ctaVal = document.getElementById('promo-edit-cta-es').value.trim();

      p.badge = { es: badgeVal, en: (p.badge && p.badge.en) || badgeVal };
      p.title = { es: titleVal, en: (p.title && p.title.en) || titleVal };
      p.description = { es: descVal, en: (p.description && p.description.en) || descVal };
      p.couponCode = couponVal;
      p.couponDesc = { es: couponDescVal, en: (p.couponDesc && p.couponDesc.en) || couponDescVal };
      p.ctaText = { es: ctaVal, en: (p.ctaText && p.ctaText.en) || ctaVal };

      // Collect 5 banners fields
      if (Array.isArray(adminSettings.banners)) {
        adminSettings.banners.forEach((b, idx) => {
          const subInput = document.querySelector(`.banner-sub-es[data-index="${idx}"]`);
          const titleInput = document.querySelector(`.banner-title-es[data-index="${idx}"]`);
          const descInput = document.querySelector(`.banner-desc-es[data-index="${idx}"]`);
          const ctaInput = document.querySelector(`.banner-cta-es[data-index="${idx}"]`);
          if (subInput) b.subtitle = { es: subInput.value.trim(), en: (b.subtitle && b.subtitle.en) || subInput.value.trim() };
          if (titleInput) b.title = { es: titleInput.value.trim(), en: (b.title && b.title.en) || titleInput.value.trim() };
          if (descInput) b.description = { es: descInput.value.trim(), en: (b.description && b.description.en) || descInput.value.trim() };
          if (ctaInput) b.ctaText = { es: ctaInput.value.trim(), en: (b.ctaText && b.ctaText.en) || ctaInput.value.trim() };
        });
      }

      await saveSettingsToCloud();
    });
  }

  if (resetBannersBtn) {
    resetBannersBtn.addEventListener('click', async () => {
      if (!confirm('¿Restaurar los banners y el popup a los valores originales?')) return;
      if (window.productsDatabase && window.productsDatabase.defaultSettings) {
        adminSettings.promoPopup = JSON.parse(JSON.stringify(window.productsDatabase.defaultSettings.promoPopup));
        adminSettings.banners = JSON.parse(JSON.stringify(window.productsDatabase.defaultSettings.banners));
        renderBannersAndPromoEditor();
        await saveSettingsToCloud();
      }
    });
  }
}

// =========================================================================
// TAB 3: ORDERS, QUOTES & NOTIFICATIONS MANAGEMENT
// =========================================================================

async function fetchOrdersFromCloud() {
  try {
    const res = await fetch('/api/orders', {
      headers: { 'X-Admin-Key': ADMIN_PASSWORD }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.orders)) {
        adminOrders = data.orders;
      }
    }
  } catch (e) {
    try {
      adminOrders = JSON.parse(localStorage.getItem('simone_orders') || '[]');
    } catch (err) {}
  }
  renderOrdersTable();
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  const searchVal = (document.getElementById('orders-search-input')?.value || '').toLowerCase().trim();
  const statusVal = document.getElementById('orders-status-filter')?.value || 'all';

  // Update KPIs
  const totalCount = adminOrders.length;
  const newCount = adminOrders.filter(o => o.status === 'nuevo').length;
  const activeCount = adminOrders.filter(o => o.status === 'preparacion' || o.status === 'enviado').length;
  const totalRevenue = adminOrders
    .filter(o => o.status !== 'cancelado')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const kpiTotal = document.getElementById('kpi-orders-total');
  const kpiNew = document.getElementById('kpi-orders-new');
  const kpiActive = document.getElementById('kpi-orders-active');
  const kpiRev = document.getElementById('kpi-orders-revenue');
  const tabBadge = document.getElementById('orders-new-badge');

  if (kpiTotal) kpiTotal.textContent = totalCount;
  if (kpiNew) kpiNew.textContent = newCount;
  if (kpiActive) kpiActive.textContent = activeCount;
  if (kpiRev) kpiRev.textContent = formatAdminCOP(totalRevenue);
  if (tabBadge) {
    tabBadge.textContent = newCount;
    tabBadge.style.display = newCount > 0 ? 'inline-block' : 'none';
  }

  const filtered = adminOrders.filter(o => {
    const matchesStatus = statusVal === 'all' || o.status === statusVal;
    const textBlob = `${o.id} ${o.customerName} ${o.customerPhone} ${o.customerEmail} ${JSON.stringify(o.items || [])} ${o.notes || ''}`.toLowerCase();
    const matchesSearch = !searchVal || textBlob.includes(searchVal);
    return matchesStatus && matchesSearch;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
          No hay pedidos ni cotizaciones registradas con este filtro todavía. Cuando un cliente envíe un pedido desde el carrito o el cotizador, aparecerá aquí automáticamente.
        </td>
      </tr>
    `;
    return;
  }

  const typeLabels = {
    pedido_carrito: '🛒 Carrito',
    cotizacion_evento: '🌟 Evento',
    consulta_contacto: '✉️ Consulta'
  };

  filtered.forEach(order => {
    const tr = document.createElement('tr');
    const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '';
    const itemsHtml = (order.items || []).map(it => {
      const cust = it.customizations || {};
      const details = [
        cust.aroma || it.aroma ? `Aroma: ${cust.aroma || it.aroma}` : '',
        cust.packaging || it.packaging ? `Empaque: ${cust.packaging || it.packaging}` : '',
        cust.message || it.message ? `Etiqueta: "${cust.message || it.message}"` : ''
      ].filter(Boolean).join(' · ');
      return `<div style="margin-bottom: 4px;"><strong>${it.qty || 1}x ${it.name}</strong>${details ? `<br><span style="font-size:0.78rem; color:var(--text-muted);">${details}</span>` : ''}</div>`;
    }).join('');

    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
    const waFollowUpText = `Hola ${order.customerName || ''}, te escribimos de Simone Velas respecto a tu solicitud *${order.id}* por valor de *${formatAdminCOP(order.total || 0)}*.`;
    const waHref = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.startsWith('57') ? cleanPhone : '57' + cleanPhone}?text=${encodeURIComponent(waFollowUpText)}`
      : `https://wa.me/?text=${encodeURIComponent(waFollowUpText)}`;

    tr.innerHTML = `
      <td>
        <strong>${order.id}</strong><br>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${dateStr}</span>
      </td>
      <td>
        <span class="category-badge">${typeLabels[order.orderType] || '🛍️ Pedido'}</span>
      </td>
      <td>
        <strong>${order.customerName || 'Cliente Web'}</strong><br>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${order.customerPhone || 'Sin teléfono'}</span>
        ${order.customerEmail ? `<br><span style="font-size: 0.75rem; color: var(--text-muted);">${order.customerEmail}</span>` : ''}
      </td>
      <td>
        ${itemsHtml}
        ${order.notes ? `<div style="font-size: 0.78rem; color: var(--brand-primary); margin-top: 4px;">📝 ${order.notes}</div>` : ''}
      </td>
      <td style="font-weight: 700;">${formatAdminCOP(order.total || 0)}</td>
      <td>
        <select class="order-status-select" data-order-id="${order.id}">
          <option value="nuevo" ${order.status === 'nuevo' ? 'selected' : ''}>🟢 Nuevo</option>
          <option value="preparacion" ${order.status === 'preparacion' ? 'selected' : ''}>🟡 En Preparación</option>
          <option value="enviado" ${order.status === 'enviado' ? 'selected' : ''}>🔵 Enviado</option>
          <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>✅ Entregado</option>
          <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>⚪ Cancelado</option>
        </select>
      </td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <a href="${waHref}" target="_blank" class="btn btn-outline btn-sm" style="padding: 5px 10px; font-size: 0.78rem;" title="Contactar cliente por WhatsApp">
            💬 WhatsApp
          </a>
          <button type="button" class="btn btn-secondary btn-sm delete-order-btn" data-order-id="${order.id}" style="padding: 5px 10px; font-size: 0.78rem;" title="Eliminar registro">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Bind status changes
  tbody.querySelectorAll('.order-status-select').forEach(select => {
    select.addEventListener('change', async () => {
      const orderId = select.getAttribute('data-order-id');
      const newStatus = select.value;
      const found = adminOrders.find(o => o.id === orderId);
      if (found) found.status = newStatus;
      renderOrdersTable();
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Key': ADMIN_PASSWORD
          },
          body: JSON.stringify({ status: newStatus })
        });
        showToast(`Estado del pedido ${orderId} actualizado a "${newStatus}".`);
      } catch (e) {}
    });
  });

  // Bind order delete
  tbody.querySelectorAll('.delete-order-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const orderId = btn.getAttribute('data-order-id');
      if (!confirm(`¿Eliminar el registro del pedido ${orderId}?`)) return;
      adminOrders = adminOrders.filter(o => o.id !== orderId);
      renderOrdersTable();
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: { 'X-Admin-Key': ADMIN_PASSWORD }
        });
        showToast(`Pedido ${orderId} eliminado.`);
      } catch (e) {}
    });
  });
}

function renderNotificationsEditor() {
  if (!adminSettings || !adminSettings.notifications) return;
  const n = adminSettings.notifications;
  const waPrimary = document.getElementById('notif-wa-primary');
  const waPrimaryName = document.getElementById('notif-wa-primary-name');
  const waSecondary = document.getElementById('notif-wa-secondary');
  const emailInput = document.getElementById('notif-email');

  if (waPrimary) waPrimary.value = n.whatsappPrimary || '573112547250';
  if (waPrimaryName) waPrimaryName.value = n.whatsappPrimaryName || 'Andrea Ruiz';
  if (waSecondary) waSecondary.value = n.whatsappSecondary || '573203702808';
  if (emailInput) emailInput.value = n.email || 'contacto@simonestore.co';
}

function initOrdersAndNotificationsEvents() {
  const refreshBtn = document.getElementById('refresh-orders-btn');
  const searchInput = document.getElementById('orders-search-input');
  const statusFilter = document.getElementById('orders-status-filter');
  const saveNotifBtn = document.getElementById('save-notifications-btn');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchOrdersFromCloud();
      showToast('Lista de pedidos actualizada.');
    });
  }
  if (searchInput) searchInput.addEventListener('input', renderOrdersTable);
  if (statusFilter) statusFilter.addEventListener('change', renderOrdersTable);

  if (saveNotifBtn) {
    saveNotifBtn.addEventListener('click', async () => {
      if (!adminSettings.notifications) adminSettings.notifications = {};
      adminSettings.notifications.whatsappPrimary = document.getElementById('notif-wa-primary').value.replace(/\D/g, '') || '573112547250';
      adminSettings.notifications.whatsappPrimaryName = document.getElementById('notif-wa-primary-name').value.trim() || 'Andrea Ruiz';
      adminSettings.notifications.whatsappSecondary = document.getElementById('notif-wa-secondary').value.replace(/\D/g, '') || '573203702808';
      adminSettings.notifications.email = document.getElementById('notif-email').value.trim() || 'contacto@simonestore.co';
      await saveSettingsToCloud();
    });
  }
}



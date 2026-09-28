/* =========================================================
   Vitesse Fits – script.js
   Everything the page does lives here.

   Sections:
    1. Product data  (EDIT PRODUCTS AND PRICES HERE)
    2. Garment drawings (SVG placeholders used instead of photos)
    3. Helpers
    4. Page references (DOM elements)
    5. Product grid: filtering + search
    6. Shopping cart
    7. Mobile menu + scroll highlighting
    8. Store open/closed status
    9. Contact form validation
   10. Scroll-reveal animation
   11. Start-up
   ========================================================= */
'use strict';


/* =========================================================
   1. PRODUCT DATA
   Each product is one object in this list. To change a name,
   description or price, edit it here. To add a product, copy an
   object, give it a new unique "id", and add it to the list.

   Fields:
     id          unique text, no spaces (used by the cart)
     name        product name
     description short line shown on the card
     price       number in Kenyan Shillings (no commas, no "KSh")
     category    label shown on the card, e.g. "Men's Tops"
     filters     which filter buttons this product appears under.
                 Allowed: 'men', 'women', 'tops', 'bottoms', 'outerwear'
     garment     which drawing to use (see GARMENTS in section 2)
     color       colour of the drawn garment (any hex colour)
     badge       optional small purple label, e.g. 'New' (or '' for none)
     image       optional photo URL or file path, e.g. 'images/hoodie.jpg'.
                 Leave '' to use the drawn garment instead.
   ========================================================= */
const PRODUCTS = [
  {
    id: 'oversized-street-tee',
    name: 'Oversized Street Tee',
    description: 'Dropped shoulders and soft heavyweight cotton for a relaxed, easy fit.',
    price: 1000,
    category: "Men's Tops",
    filters: ['men', 'tops'],
    garment: 'tee-oversized',
    color: '#1f5eea',
    badge: 'New',
    image: ''
  },
  {
    id: 'graphic-bolt-tee',
    name: 'Graphic Bolt Tee',
    description: 'A clean white tee with a bold bolt print on the chest.',
    price: 800,
    category: "Men's Tops",
    filters: ['men', 'tops'],
    garment: 'tee-graphic',
    color: '#e8efff',
    badge: '',
    image: ''
  },
  {
    id: 'everyday-hoodie',
    name: 'Everyday Hoodie',
    description: 'Fleece-lined pullover hoodie with a roomy front pocket.',
    price: 1500,
    category: "Men's Outerwear",
    filters: ['men', 'outerwear'],
    garment: 'hoodie',
    color: '#0a2a6b',
    badge: 'Popular',
    image: ''
  },
  {
    id: 'utility-cargo-pants',
    name: 'Utility Cargo Pants',
    description: 'Relaxed cargo pants with roomy side pockets and a tapered leg.',
    price: 1400,
    category: "Men's Bottoms",
    filters: ['men', 'bottoms'],
    garment: 'cargo',
    color: '#5b7db1',
    badge: '',
    image: ''
  },
  {
    id: 'classic-straight-jeans',
    name: 'Classic Straight Jeans',
    description: 'Mid-rise straight-fit denim that goes with everything.',
    price: 1300,
    category: "Men's Bottoms",
    filters: ['men', 'bottoms'],
    garment: 'jeans',
    color: '#2d4f9e',
    badge: '',
    image: ''
  },
  {
    id: 'casual-button-shirt',
    name: 'Casual Button Shirt',
    description: 'Light, breathable shirt for the office, weekends and in between.',
    price: 900,
    category: "Men's Tops",
    filters: ['men', 'tops'],
    garment: 'shirt',
    color: '#a9c4fb',
    badge: '',
    image: ''
  },
  {
    id: 'crewneck-sweatshirt',
    name: 'Crewneck Sweatshirt',
    description: 'Soft brushed-back sweatshirt in a unisex fit with ribbed cuffs.',
    price: 1100,
    category: 'Unisex Tops',
    filters: ['men', 'women', 'tops'],
    garment: 'sweatshirt',
    color: '#cbbcff',
    badge: '',
    image: ''
  },
  {
    id: 'ribbed-crop-top',
    name: 'Ribbed Crop Top',
    description: 'Stretchy ribbed knit that sits neatly at the waist.',
    price: 700,
    category: "Women's Tops",
    filters: ['women', 'tops'],
    garment: 'croptop',
    color: '#7fa8fa',
    badge: '',
    image: ''
  },
  {
    id: 'wrap-midi-dress',
    name: 'Wrap Midi Dress',
    description: 'Flowy midi dress with a defined waist. Easy to dress up or down.',
    price: 1200,
    category: "Women's Dresses",
    filters: ['women'],
    garment: 'dress',
    color: '#8aa4ff',
    badge: 'New',
    image: ''
  },
  {
    id: 'denim-trucker-jacket',
    name: 'Denim Trucker Jacket',
    description: 'A classic denim jacket with chest pockets. Layer it over anything.',
    price: 1450,
    category: 'Unisex Outerwear',
    filters: ['men', 'women', 'outerwear'],
    garment: 'jacket',
    color: '#3457b5',
    badge: '',
    image: ''
  },
  {
    id: 'relaxed-everyday-shorts',
    name: 'Relaxed Everyday Shorts',
    description: 'Lightweight drawstring shorts made for warm Nairobi days.',
    price: 600,
    category: "Men's Bottoms",
    filters: ['men', 'bottoms'],
    garment: 'shorts',
    color: '#2a3a66',
    badge: '',
    image: ''
  },
  {
    id: 'two-piece-tracksuit',
    name: 'Two-Piece Tracksuit',
    description: 'Matching zip jacket and joggers with side stripes. Sold as a set.',
    price: 1500,
    category: 'Unisex Outerwear',
    filters: ['men', 'women', 'outerwear'],
    garment: 'tracksuit',
    color: '#1746b5',
    badge: 'Popular',
    image: ''
  }
];

/* Friendly names for each filter (used in the "Showing ..." line and empty messages) */
const FILTER_LABELS = {
  all: 'All',
  men: 'Men',
  women: 'Women',
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear'
};

/* Cart rules */
const MAX_QTY = 10;                     // most of one item a customer can add
const CART_STORAGE_KEY = 'vitesseFitsCart';

/* Developer safety check: warn in the browser console if a price breaks the KSh 400 - 1,500 range */
PRODUCTS.forEach(function (p) {
  if (p.price < 400 || p.price > 1500) {
    console.warn('Price out of range (KSh 400 - 1,500): ' + p.name + ' = ' + p.price);
  }
});


/* =========================================================
   2. GARMENT DRAWINGS
   Small SVG drawings of each clothing type, so the demo has
   "product images" without needing photo files.
   ========================================================= */
const G_LINE  = 'rgba(7,26,69,.3)';       // outline colour
const G_SHADE = 'rgba(7,26,69,.13)';      // soft shadow areas
const G_LIGHT = 'rgba(255,255,255,.4)';   // highlight lines

/* Small helpers that return SVG pieces */
function gShape(d, fill) {
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + G_LINE + '" stroke-width="2" stroke-linejoin="round"/>';
}
function gShade(d) {
  return '<path d="' + d + '" fill="' + G_SHADE + '"/>';
}
function gLine(d, width) {
  return '<path d="' + d + '" fill="none" stroke="' + G_LINE + '" stroke-width="' + (width || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>';
}
function gLight(d, width) {
  return '<path d="' + d + '" fill="none" stroke="' + G_LIGHT + '" stroke-width="' + (width || 2) + '" stroke-linecap="round"/>';
}
function gButton(x, y) {
  return '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="rgba(255,255,255,.85)" stroke="' + G_LINE + '" stroke-width="1.2"/>';
}

/* One function per garment type. Each receives the colour and returns SVG shapes. */
const GARMENTS = {
  'tee': function (c) {
    return gShape('M70 30 L40 45 L18 85 L45 98 L60 80 L60 190 L140 190 L140 80 L155 98 L182 85 L160 45 L130 30 Q100 52 70 30 Z', c) +
      gShade('M118 190 L140 190 L140 80 L128 62 Z') +
      gLine('M70 30 Q100 52 130 30', 4) +
      gLine('M60 178 H140');
  },
  'tee-oversized': function (c) {
    return gShape('M62 30 L28 42 L6 100 L38 112 L52 92 L52 190 L148 190 L148 92 L162 112 L194 100 L172 42 L138 30 Q100 54 62 30 Z', c) +
      gShade('M122 190 L148 190 L148 92 L134 66 Z') +
      gLine('M62 30 Q100 54 138 30', 4) +
      gLine('M52 178 H148');
  },
  'tee-graphic': function (c) {
    return GARMENTS['tee'](c) +
      '<path d="M106 92 L88 118 H100 L95 138 L116 108 H103 Z" fill="#7c4dff"/>';
  },
  'hoodie': function (c) {
    return gShape('M66 40 Q100 -2 134 40 Q100 66 66 40 Z', c) +
      gShade('M66 40 Q100 -2 134 40 Q100 66 66 40 Z') +
      gShape('M64 40 L30 58 L14 130 L40 138 L54 100 L54 192 L146 192 L146 100 L160 138 L186 130 L170 58 L136 40 Q100 62 64 40 Z', c) +
      gShade('M124 192 L146 192 L146 100 L136 60 Z') +
      '<path d="M76 41 Q100 60 124 41 Q100 30 76 41 Z" fill="' + G_SHADE + '"/>' +
      gLine('M92 60 V88') + gLine('M108 60 V88') +
      gLine('M72 142 H128 L136 172 H64 Z') +
      gLine('M54 180 H146');
  },
  'sweatshirt': function (c) {
    return gShape('M72 32 L38 48 L16 140 L44 148 L60 96 L60 190 L140 190 L140 96 L156 148 L184 140 L162 48 L128 32 Q100 56 72 32 Z', c) +
      gShade('M60 176 H140 V190 H60 Z') +
      gShade('M120 176 L140 176 L140 96 L130 64 Z') +
      gLine('M72 32 Q100 56 128 32', 5) +
      gLine('M60 176 H140');
  },
  'cargo': function (c) {
    return gShape('M60 20 H140 L150 204 H108 L100 84 L92 204 H50 Z', c) +
      gShade('M60 20 H140 V34 H60 Z') +
      gLine('M60 34 H140') +
      gLine('M100 34 V84') +
      gLine('M58 108 H82 V144 H58 Z') +
      gLine('M118 108 H142 V144 H118 Z') +
      gLine('M51 190 H92') + gLine('M108 190 H149');
  },
  'jeans': function (c) {
    return gShape('M60 20 H140 L148 204 H108 L100 84 L92 204 H52 Z', c) +
      gShade('M60 20 H140 V34 H60 Z') +
      gLine('M60 34 H140') +
      gLine('M100 34 V66') +
      gLine('M64 40 Q78 64 92 42') +
      gLine('M108 42 Q122 64 136 40') +
      gLight('M70 90 L64 196') + gLight('M130 90 L136 196');
  },
  'shorts': function (c) {
    return gShape('M58 30 H142 L154 128 H108 L100 80 L92 128 H46 Z', c) +
      gShade('M58 30 H142 V44 H58 Z') +
      gLine('M58 44 H142') +
      gLine('M92 44 V66') + gLine('M108 44 V66') +
      gLine('M47 116 H91') + gLine('M109 116 H153');
  },
  'shirt': function (c) {
    return gShape('M72 30 L38 46 L18 142 L46 148 L60 92 L60 192 L140 192 L140 92 L154 148 L182 142 L162 46 L128 30 L100 44 Z', c) +
      gShade('M118 192 L140 192 L140 92 L128 62 Z') +
      gShape('M72 30 L100 62 L128 30 L114 24 L100 40 L86 24 Z', c) +
      '<path d="M72 30 L100 62 L128 30 L114 24 L100 40 L86 24 Z" fill="rgba(255,255,255,.35)"/>' +
      gLine('M100 62 V192') +
      gButton(100, 82) + gButton(100, 108) + gButton(100, 134) + gButton(100, 160) +
      gLine('M112 90 H132 V110 H112 Z');
  },
  'croptop': function (c) {
    return '<g transform="translate(0 24)">' +
      gShape('M74 40 L44 54 L30 92 L54 100 L64 84 L64 132 L136 132 L136 84 L146 100 L170 92 L156 54 L126 40 Q100 62 74 40 Z', c) +
      gShade('M118 132 L136 132 L136 84 L126 62 Z') +
      gLight('M80 68 V128', 2) + gLight('M92 68 V128', 2) + gLight('M104 68 V128', 2) + gLight('M116 68 V128', 2) +
      gLine('M74 40 Q100 62 126 40', 4) +
      gLine('M64 120 H136') +
      '</g>';
  },
  'dress': function (c) {
    return gShape('M78 20 Q100 46 122 20 L136 30 L130 84 L170 202 H30 L70 84 L64 30 Z', c) +
      gShade('M70 84 H130 L134 96 H66 Z') +
      gLine('M78 20 Q100 46 122 20', 3) +
      gLine('M70 84 H130') + gLine('M66 96 H134') +
      gLight('M100 98 L100 200') + gLight('M84 98 L64 200') + gLight('M116 98 L136 200');
  },
  'jacket': function (c) {
    return gShape('M68 34 L32 50 L14 152 L44 158 L58 102 L58 186 L142 186 L142 102 L156 158 L186 152 L168 50 L132 34 L100 52 Z', c) +
      gShade('M120 186 L142 186 L142 102 L130 70 Z') +
      gShape('M68 34 L100 68 L132 34 L118 26 L100 44 L82 26 Z', c) +
      '<path d="M68 34 L100 68 L132 34 L118 26 L100 44 L82 26 Z" fill="rgba(255,255,255,.3)"/>' +
      gLine('M100 68 V186') +
      gLine('M70 84 H92 V106 H70 Z') + gLine('M108 84 H130 V106 H108 Z') +
      gLine('M58 170 H142') +
      gButton(100, 122) + gButton(100, 144) + gButton(100, 164);
  },
  'tracksuit': function (c) {
    return gShape('M60 106 H140 L148 208 H108 L100 152 L92 208 H52 Z', c) +
      gLight('M66 128 L59 206', 4) + gLight('M134 128 L141 206', 4) +
      gShape('M66 18 L36 32 L20 96 L44 102 L56 70 L56 112 L144 112 L144 70 L156 102 L180 96 L164 32 L134 18 L100 34 Z', c) +
      gShade('M56 100 H144 V112 H56 Z') +
      gLine('M66 18 L100 34 L134 18', 4) +
      gLine('M100 34 V112') +
      gLight('M40 40 L27 94', 4) + gLight('M160 40 L173 94', 4);
  }
};

/* Build a complete <svg> for a garment type and colour */
function garmentSVG(type, color) {
  const draw = GARMENTS[type] || GARMENTS['tee'];
  return '<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    draw(color || '#1f5eea') + '</svg>';
}


/* =========================================================
   3. HELPERS
   ========================================================= */

/* 1500 -> "KSh 1,500" */
function formatPrice(amount) {
  return 'KSh ' + Number(amount).toLocaleString('en-US');
}

/* Stops product text from being read as HTML (good habit, keeps the page safe) */
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function findProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

/* Returns the picture for a product: a photo if "image" is set, otherwise the drawn garment */
function productMediaHTML(product) {
  if (product.image) {
    return '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" loading="lazy" data-id="' + escapeHTML(product.id) + '">';
  }
  return garmentSVG(product.garment, product.color);
}

/* Small pop-up message at the bottom of the screen */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
}


/* =========================================================
   4. PAGE REFERENCES
   ========================================================= */
const productGrid   = document.getElementById('productGrid');
const resultsInfo   = document.getElementById('resultsInfo');
const emptyState    = document.getElementById('emptyState');
const emptyMessage  = document.getElementById('emptyMessage');
const emptyReset    = document.getElementById('emptyReset');
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const filterChips   = document.getElementById('filterChips');

const cartToggle    = document.getElementById('cartToggle');
const cartCount     = document.getElementById('cartCount');
const cartDrawer    = document.getElementById('cartDrawer');
const cartOverlay   = document.getElementById('cartOverlay');
const cartClose     = document.getElementById('cartClose');
const cartItemsList = document.getElementById('cartItems');
const cartEmpty     = document.getElementById('cartEmpty');
const cartFooter    = document.getElementById('cartFooter');
const cartSubtotal  = document.getElementById('cartSubtotal');
const checkoutBtn   = document.getElementById('checkoutBtn');
const checkoutNotice = document.getElementById('checkoutNotice');
const clearCartBtn  = document.getElementById('clearCartBtn');
const cartStartShopping = document.getElementById('cartStartShopping');

const menuToggle    = document.getElementById('menuToggle');
const primaryNav    = document.getElementById('primaryNav');


/* =========================================================
   5. PRODUCT GRID: FILTERING + SEARCH
   Two pieces of state decide what is shown:
     activeFilter  which category button is selected ('all', 'men', ...)
     searchTerm    what the customer typed (lower-case)
   A product is shown only if it matches BOTH.
   ========================================================= */
let activeFilter = 'all';
let searchTerm = '';        // lower-case, trimmed (used for matching)
let searchRaw = '';         // as typed (used in messages)

/* Does one product match the current filter + search? */
function productMatches(product) {
  const inCategory = activeFilter === 'all' || product.filters.indexOf(activeFilter) !== -1;
  if (!inCategory) return false;
  if (!searchTerm) return true;
  // Search the name, description and category label
  const haystack = (product.name + ' ' + product.description + ' ' + product.category).toLowerCase();
  return haystack.indexOf(searchTerm) !== -1;
}

/* Draw the product cards. Pass animate = true to fade them in one after another. */
function renderProducts(animate) {
  const visible = PRODUCTS.filter(productMatches);

  // Cards
  productGrid.classList.toggle('animate', !!animate);
  productGrid.innerHTML = visible.map(function (p, index) {
    const badge = p.badge ? '<span class="product-badge">' + escapeHTML(p.badge) + '</span>' : '';
    return (
      '<article class="product-card" style="--i:' + index + '">' +
        '<div class="product-media">' +
          '<span class="product-tag">' + escapeHTML(p.category) + '</span>' +
          badge +
          productMediaHTML(p) +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-name">' + escapeHTML(p.name) + '</h3>' +
          '<p class="product-desc">' + escapeHTML(p.description) + '</p>' +
          '<div class="product-foot">' +
            '<span class="product-price">' + formatPrice(p.price) + '</span>' +
            '<button type="button" class="btn btn-primary btn-sm" data-add="' + escapeHTML(p.id) + '" aria-label="Add ' + escapeHTML(p.name) + ' to cart">Add to Cart</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }).join('');

  // "Showing ..." line
  let info = visible.length + (visible.length === 1 ? ' product' : ' products');
  if (activeFilter !== 'all') info += ' in ' + FILTER_LABELS[activeFilter];
  if (searchTerm) info += ' matching \u201C' + searchRaw.trim() + '\u201D';
  resultsInfo.textContent = visible.length ? info : '';

  // Friendly message when nothing matches (built with textContent so typed text stays safe)
  const nothingFound = visible.length === 0;
  emptyState.hidden = !nothingFound;
  if (nothingFound) {
    if (searchTerm) {
      emptyMessage.textContent = 'We couldn\u2019t find anything matching \u201C' + searchRaw.trim() + '\u201D' +
        (activeFilter !== 'all' ? ' in ' + FILTER_LABELS[activeFilter] : '') +
        '. Try a different word, like \u201Ctee\u201D or \u201Cdress\u201D, or browse everything.';
    } else {
      emptyMessage.textContent = 'There are no products in this category yet. Check back soon for new arrivals.';
    }
  }
}

/* Change the selected category */
function setFilter(key, options) {
  options = options || {};
  if (!FILTER_LABELS[key]) key = 'all';
  activeFilter = key;

  // Optionally clear the search box (used when a category link is clicked outside the shop controls)
  if (options.clearSearch) {
    searchInput.value = '';
    searchTerm = '';
    searchRaw = '';
    searchClear.hidden = true;
  }

  // Update the highlighted filter button
  filterChips.querySelectorAll('.chip').forEach(function (chip) {
    const isActive = chip.dataset.filter === key;
    chip.classList.toggle('is-active', isActive);
    chip.setAttribute('aria-pressed', String(isActive));
  });

  renderProducts(true);
}

/* Update the search term as the customer types */
function handleSearch() {
  searchRaw = searchInput.value;
  searchTerm = searchRaw.trim().toLowerCase();
  searchClear.hidden = searchRaw === '';
  renderProducts(false);   // no fade-in while typing, so results don't flicker
}

/* Fill in the "8 items" counts on the category tiles */
function renderCategoryCounts() {
  document.querySelectorAll('[data-count-for]').forEach(function (el) {
    const key = el.dataset.countFor;
    const total = PRODUCTS.filter(function (p) { return p.filters.indexOf(key) !== -1; }).length;
    el.textContent = total + (total === 1 ? ' item' : ' items');
  });
}

/* Draw the SVG garments into the hero, category tiles and About section */
function renderGarmentSlots() {
  document.querySelectorAll('.garment-slot[data-garment]').forEach(function (slot) {
    slot.innerHTML = garmentSVG(slot.dataset.garment, slot.dataset.color);
  });
}

function initShop() {
  // Filter buttons, category tiles and "Shop" call-to-action links all use data-filter
  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-filter]');
    if (!trigger) return;
    const insideShopControls = filterChips.contains(trigger);
    setFilter(trigger.dataset.filter, { clearSearch: !insideShopControls });
  });

  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && searchInput.value) {
      searchInput.value = '';
      handleSearch();
    }
  });
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    handleSearch();
    searchInput.focus();
  });

  // "Show all products" button in the empty message
  emptyReset.addEventListener('click', function () {
    setFilter('all', { clearSearch: true });
  });

  // "Add to Cart" buttons (one listener for the whole grid)
  productGrid.addEventListener('click', function (event) {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    addToCart(button.dataset.add, button);
  });

  // If a product photo fails to load, fall back to the drawn garment
  productGrid.addEventListener('error', function (event) {
    const img = event.target;
    if (!img || img.tagName !== 'IMG') return;
    const product = findProduct(img.dataset.id);
    if (product) img.outerHTML = garmentSVG(product.garment, product.color);
  }, true);

  renderProducts(true);
}


/* =========================================================
   6. SHOPPING CART
   The cart is a list of small objects: [{ id: 'everyday-hoodie', qty: 2 }, ...]
   It stores only the id and quantity. Names and prices are always looked up
   from PRODUCTS, so the totals can never get out of sync.
   The cart is also saved in the browser (localStorage) so it survives a refresh.
   ========================================================= */
let cart = [];
let lastFocusedElement = null;

/* Load a saved cart, ignoring anything that looks wrong */
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(function (item) { return item && findProduct(item.id) && Number.isInteger(item.qty) && item.qty > 0; })
      .map(function (item) { return { id: item.id, qty: Math.min(item.qty, MAX_QTY) }; });
  } catch (error) {
    return [];   // storage blocked or data broken: just start with an empty cart
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    /* Saving is optional: the cart still works without it */
  }
}

/* Add one of a product. If it is already in the cart, increase its quantity. */
function addToCart(id, button) {
  const product = findProduct(id);
  if (!product) return;

  const existing = cart.find(function (item) { return item.id === id; });
  if (existing) {
    if (existing.qty >= MAX_QTY) {
      showToast('You can add up to ' + MAX_QTY + ' of the same item.');
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  saveCart();
  renderCart();
  bumpCartCount();
  showToast(product.name + ' added to your cart');

  // Give the button itself quick feedback
  if (button) {
    button.textContent = 'Added \u2713';
    button.disabled = true;
    setTimeout(function () {
      button.textContent = 'Add to Cart';
      button.disabled = false;
    }, 1000);
  }
}

/* change = +1 or -1 */
function changeQuantity(id, change) {
  const item = cart.find(function (entry) { return entry.id === id; });
  if (!item) return;
  const newQty = item.qty + change;
  if (newQty < 1 || newQty > MAX_QTY) return;   // limits: 1 to MAX_QTY (use Remove to delete)
  item.qty = newQty;
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  const product = findProduct(id);
  cart = cart.filter(function (item) { return item.id !== id; });
  saveCart();
  renderCart();
  if (product) showToast(product.name + ' removed');
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
  showToast('Cart cleared');
}

/* Total number of pieces (sum of all quantities) */
function getCartItemCount() {
  return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
}

/* Subtotal in KSh: price x quantity for every item, added together */
function getCartSubtotal() {
  return cart.reduce(function (sum, item) {
    const product = findProduct(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

/* Redraw the whole cart panel and the little number on the cart icon */
function renderCart() {
  const count = getCartItemCount();

  // Cart icon badge
  cartCount.textContent = count;
  cartCount.hidden = count === 0;
  cartToggle.setAttribute('aria-label', 'Open cart, ' + count + (count === 1 ? ' item' : ' items'));

  // Empty vs filled
  const isEmpty = cart.length === 0;
  cartEmpty.hidden = !isEmpty;
  cartFooter.hidden = isEmpty;
  cartItemsList.hidden = isEmpty;
  checkoutNotice.hidden = true;

  // Items
  cartItemsList.innerHTML = cart.map(function (item) {
    const p = findProduct(item.id);
    const thumb = p.image
      ? '<img src="' + escapeHTML(p.image) + '" alt="">'
      : garmentSVG(p.garment, p.color);
    const id = escapeHTML(p.id);
    return (
      '<li class="cart-item">' +
        '<div class="cart-thumb">' + thumb + '</div>' +
        '<div>' +
          '<p class="cart-item-name">' + escapeHTML(p.name) + '</p>' +
          '<p class="cart-item-price">' + formatPrice(p.price) + ' each</p>' +
          '<div class="qty-control">' +
            '<button type="button" class="qty-btn" data-action="decrease" data-id="' + id + '" aria-label="Decrease quantity of ' + escapeHTML(p.name) + '"' + (item.qty <= 1 ? ' disabled' : '') + '>&minus;</button>' +
            '<span class="qty-value" aria-live="polite">' + item.qty + '</span>' +
            '<button type="button" class="qty-btn" data-action="increase" data-id="' + id + '" aria-label="Increase quantity of ' + escapeHTML(p.name) + '"' + (item.qty >= MAX_QTY ? ' disabled' : '') + '>+</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-item-side">' +
          '<span class="cart-line-total">' + formatPrice(p.price * item.qty) + '</span>' +
          '<button type="button" class="cart-remove" data-action="remove" data-id="' + id + '" aria-label="Remove ' + escapeHTML(p.name) + ' from cart">Remove</button>' +
        '</div>' +
      '</li>'
    );
  }).join('');

  // Subtotal
  cartSubtotal.textContent = formatPrice(getCartSubtotal());
}

/* Small "pop" on the cart badge when something is added */
function bumpCartCount() {
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;          // restarts the CSS animation
  cartCount.classList.add('bump');
}

/* Open / close the slide-out cart */
function openCart() {
  lastFocusedElement = document.activeElement;
  closeMenu();
  cartDrawer.classList.add('is-open');
  cartOverlay.classList.add('is-visible');
  document.body.classList.add('no-scroll');
  cartToggle.setAttribute('aria-expanded', 'true');
  cartClose.focus();
}

function closeCart() {
  if (!cartDrawer.classList.contains('is-open')) return;
  cartDrawer.classList.remove('is-open');
  cartOverlay.classList.remove('is-visible');
  document.body.classList.remove('no-scroll');
  cartToggle.setAttribute('aria-expanded', 'false');
  if (lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
}

function initCart() {
  cart = loadCart();
  renderCart();

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // "Start Shopping" in the empty cart: close the panel and jump to the products
  cartStartShopping.addEventListener('click', function () {
    closeCart();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });

  // + / - / Remove buttons inside the cart (one listener for the whole list)
  cartItemsList.addEventListener('click', function (event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.action === 'increase') changeQuantity(id, 1);
    if (button.dataset.action === 'decrease') changeQuantity(id, -1);
    if (button.dataset.action === 'remove') removeFromCart(id);
  });

  clearCartBtn.addEventListener('click', clearCart);

  // Checkout is a demo: explain that nothing is charged
  checkoutBtn.addEventListener('click', function () {
    checkoutNotice.textContent = 'Checkout is currently a demo. No payment was taken and no order was placed. A live store would ask for delivery details and payment here.';
    checkoutNotice.hidden = false;
    showToast('Checkout is a demo. No order was placed.');
  });

  // Keep keyboard focus inside the cart while it is open
  cartDrawer.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    const focusable = cartDrawer.querySelectorAll('button:not([disabled]), a[href]');
    const visibleFocusable = Array.prototype.filter.call(focusable, function (el) { return el.offsetParent !== null; });
    if (!visibleFocusable.length) return;
    const first = visibleFocusable[0];
    const last = visibleFocusable[visibleFocusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  // Save the cart if another tab changes it
  window.addEventListener('storage', function (event) {
    if (event.key === CART_STORAGE_KEY) { cart = loadCart(); renderCart(); }
  });
}


/* =========================================================
   7. MOBILE MENU + SCROLL HIGHLIGHTING
   ========================================================= */
function openMenu() {
  primaryNav.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
}

function closeMenu() {
  primaryNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

function initMenu() {
  menuToggle.addEventListener('click', function () {
    if (primaryNav.classList.contains('is-open')) closeMenu(); else openMenu();
  });

  // Close the menu after choosing a link
  primaryNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close when tapping anywhere outside the header
  document.addEventListener('click', function (event) {
    if (!primaryNav.classList.contains('is-open')) return;
    if (!event.target.closest('#siteHeader')) closeMenu();
  });

  // Close if the window becomes wide enough to show the normal desktop menu
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  // Escape closes the menu or the cart
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeMenu(); closeCart(); }
  });

  // Highlight the nav link for the section currently on screen
  if ('IntersectionObserver' in window) {
    const links = {};
    primaryNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      links[link.getAttribute('href').slice(1)] = link;
    });
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.remove('is-active'); });
        if (links[entry.target.id]) links[entry.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(links).forEach(function (id) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
}


/* =========================================================
   8. STORE OPEN / CLOSED STATUS
   Shows "Open now" or "Closed" for the physical store using Nairobi time,
   no matter where the visitor is. Hours: Mon-Sat 7:00 AM - 6:00 PM, Sunday closed.
   ========================================================= */
const STORE_OPEN_HOUR = 7;     // 7:00 AM
const STORE_CLOSE_HOUR = 18;   // 6:00 PM

function updateStoreStatus() {
  const statusEl = document.getElementById('storeStatus');
  if (!statusEl) return;

  try {
    // Ask the browser for the current day and hour in Nairobi
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Nairobi', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const get = function (type) { return parts.find(function (p) { return p.type === type; }).value; };
    const day = get('weekday');                       // 'Mon', 'Tue', ... 'Sun'
    const hour = parseInt(get('hour'), 10) % 24;      // some browsers report midnight as 24
    const minutes = hour * 60 + parseInt(get('minute'), 10);

    const isSunday = day === 'Sun';
    const isOpen = !isSunday && minutes >= STORE_OPEN_HOUR * 60 && minutes < STORE_CLOSE_HOUR * 60;

    let text;
    if (isOpen) {
      text = 'Open now, closes at 6:00 PM';
    } else if (isSunday) {
      text = 'Closed today, opens Monday at 7:00 AM';
    } else if (minutes < STORE_OPEN_HOUR * 60) {
      text = 'Closed now, opens today at 7:00 AM';
    } else if (day === 'Sat') {
      text = 'Closed now, opens Monday at 7:00 AM';
    } else {
      text = 'Closed now, opens tomorrow at 7:00 AM';
    }

    statusEl.innerHTML = '<span class="status-dot" aria-hidden="true"></span>';
    statusEl.appendChild(document.createTextNode(text));
    statusEl.classList.toggle('is-closed', !isOpen);
    statusEl.hidden = false;
  } catch (error) {
    statusEl.hidden = true;   // very old browser: just hide the status line
  }
}


/* =========================================================
   9. CONTACT FORM VALIDATION
   Each rule returns '' when the value is fine, or an error message.
   Nothing is sent anywhere: on success we show a friendly message.
   ========================================================= */
const FORM_RULES = {
  name: function (value) {
    return value.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).';
  },
  email: function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Please enter a valid email address, like name@example.com.';
  },
  phone: function (value) {
    if (!value.trim()) return '';                                   // phone is optional
    const digits = value.replace(/\D/g, '');
    const looksValid = /^[+\d\s()-]+$/.test(value.trim()) && digits.length >= 9 && digits.length <= 15;
    return looksValid ? '' : 'Please enter a valid phone number, like +254 700 123 456.';
  },
  message: function (value) {
    return value.trim().length >= 10 ? '' : 'Please write a short message (at least 10 characters).';
  }
};

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('contactSubmit');
  const successEl = document.getElementById('formSuccess');

  const fields = {
    name: document.getElementById('contactName'),
    email: document.getElementById('contactEmail'),
    phone: document.getElementById('contactPhone'),
    message: document.getElementById('contactMessage')
  };

  /* Check one field and show or clear its error. Returns true if valid. */
  function validateField(key) {
    const input = fields[key];
    const errorEl = document.getElementById(input.id + 'Error');
    const message = FORM_RULES[key](input.value);
    errorEl.textContent = message;
    input.classList.toggle('is-invalid', message !== '');
    input.setAttribute('aria-invalid', String(message !== ''));
    return message === '';
  }

  // Re-check a field as the user fixes it, and clear the success message when they start again
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener('input', function () {
      successEl.hidden = true;
      if (fields[key].classList.contains('is-invalid')) validateField(key);
    });
    fields[key].addEventListener('blur', function () {
      if (fields[key].value !== '') validateField(key);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();                 // stop the page from reloading
    successEl.hidden = true;

    // Check every field (don't stop at the first error, so all problems show at once)
    let firstInvalid = null;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key) && !firstInvalid) firstInvalid = fields[key];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Pretend to send, then show a friendly success message
    const firstName = fields.name.value.trim().split(/\s+/)[0];
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';
    setTimeout(function () {
      successEl.textContent = 'Thanks, ' + firstName + '! Your message has been received. This is a demo site, so nothing was actually sent.';
      successEl.hidden = false;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      showToast('Message sent (demo)');
    }, 700);
  });
}


/* =========================================================
   10. SCROLL-REVEAL ANIMATION
   Elements with class "reveal" fade in when they scroll into view.
   ========================================================= */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });   // no support: just show everything
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);         // animate only once
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { observer.observe(el); });
}


/* =========================================================
   11. START-UP
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  renderGarmentSlots();
  renderCategoryCounts();
  initShop();
  initCart();
  initMenu();
  initContactForm();
  updateStoreStatus();
  setInterval(updateStoreStatus, 60000);   // refresh the open/closed line every minute
  initReveal();
});

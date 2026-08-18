/* ==========================================================================
   PawMart — Core Application Script
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Data Store & Global State
// --------------------------------------------------------------------------
const PRODUCTS = [
  { id: 1, name: "Chunky Kibble Dog Food (3kg)", category: "Dog Food", price: 1450, emoji: "🐶", rating: 4.9, reviews: 84, badge: "Bestseller", desc: "A protein-rich, grain-friendly kibble blend made for everyday energy and a shiny coat." },
  { id: 2, name: "Salmon & Rice Cat Food (2kg)", category: "Cat Food", price: 1250, emoji: "🐱", rating: 4.8, reviews: 62, badge: "Sale", desc: "Real salmon and rice recipe gentle on sensitive tummies, with added taurine." },
  { id: 3, name: "Crunchy Training Treats", category: "Treats", price: 350, emoji: "🦴", rating: 5.0, reviews: 112, badge: "", desc: "Bite-sized, low-calorie treats perfect for training sessions." },
  { id: 4, name: "Squeaky Bone Chew Toy", category: "Pet Toys", price: 420, emoji: "🧸", rating: 4.7, reviews: 45, badge: "🔥 Selling Fast", desc: "A durable rubber chew toy with a built-in squeaker." },
  { id: 5, name: "Cloud Comfort Pet Bed", category: "Pet Beds", price: 2600, emoji: "🛏️", rating: 4.9, reviews: 98, badge: "Popular", desc: "Plush, machine-washable bed with raised edges." },
  { id: 6, name: "Stainless Steel Food Bowl Set", category: "Food Bowls", price: 680, emoji: "🥣", rating: 4.6, reviews: 31, badge: "", desc: "A rust-resistant, non-slip bowl duo for food and water." },
  { id: 7, name: "Adjustable Collar & Leash Set", category: "Collars & Leashes", price: 950, emoji: "🐕", rating: 4.8, reviews: 53, badge: "", desc: "Matching collar and 1.2m leash set with sturdy clips." },
  { id: 8, name: "Oatmeal Shampoo for Sensitive Skin", category: "Grooming Products", price: 590, emoji: "🧴", rating: 4.9, reviews: 40, badge: "", desc: "Tear-free oatmeal shampoo that soothes itchy skin." },
  { id: 9, name: "Cozy Knit Pet Sweater", category: "Pet Clothes", price: 780, emoji: "👕", rating: 4.5, reviews: 22, badge: "New", desc: "A warm knit sweater for chilly evenings and cold-weather walks." },
  { id: 10, name: "Travel Carrier Backpack", category: "Pet Accessories", price: 3200, emoji: "🏠", rating: 4.9, reviews: 76, badge: "Top Rated", desc: "Ventilated, comfortable carrier backpack for trips." },
  { id: 11, name: "Grain-Free Puppy Food (1.5kg)", category: "Dog Food", price: 1100, emoji: "🐶", rating: 4.8, reviews: 39, badge: "", desc: "Specially formulated for growing puppies with DHA." },
  { id: 12, name: "Feather Wand Cat Toy", category: "Pet Toys", price: 300, emoji: "🧸", rating: 4.7, reviews: 67, badge: "", desc: "Interactive feather wand keeping indoor cats active." }
];

const state = {
  category: "All",
  searchQuery: "",
  sortBy: "default"
};

// --------------------------------------------------------------------------
// 2. LocalStorage Cart Manager & Toast Notifications
// --------------------------------------------------------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("pawmart_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("pawmart_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].qty += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: quantity });
  }

  saveCart(cart);
  showToast(`Added <strong>${quantity}x ${product.name}</strong> to cart! 🛒`);
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("nav-cart-count");
  if (badge) badge.textContent = totalItems;
}

function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --------------------------------------------------------------------------
// 3. Renderers & Components
// --------------------------------------------------------------------------
function createCardHTML(p) {
  const badgeHTML = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";

  return `
    <article class="product-card" data-category="${p.category}">
      ${badgeHTML}
      <button class="wishlist-btn" onclick="toggleWishlist(this)" aria-label="Add to wishlist">
        <svg class="heart-icon" viewBox="0 0 24 24" width="16" height="16">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      <div class="product-thumb">${p.emoji}</div>

      <div class="product-info">
        <div class="product-meta">
          <span class="product-cat">${p.category}</span>
          <div class="star-rating">★ <span>${p.rating} (${p.reviews})</span></div>
        </div>

        <a class="product-name-link" href="product-details.html?id=${p.id}">
          <h3 class="product-name">${p.name}</h3>
        </a>

        <div class="product-price">Rs ${p.price}</div>
        <button class="btn btn-primary btn-small" onclick="addToCart(${p.id})">
          Add to Cart 🛒
        </button>
      </div>
    </article>
  `;
}

function renderProductCards(products, containerId) {
  const container = document.getElementById(containerId);
  const emptyState = document.getElementById("empty-state-message");
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  container.innerHTML = products.map(createCardHTML).join("");
}

// --------------------------------------------------------------------------
// 4. Search, Filtering, and Sorting Pipeline
// --------------------------------------------------------------------------
function getProcessedProducts() {
  return PRODUCTS.filter(p => {
    const matchesCategory = state.category === "All" || p.category === state.category;
    const matchesSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (state.sortBy === "price-low") return a.price - b.price;
    if (state.sortBy === "price-high") return b.price - a.price;
    if (state.sortBy === "rating") return b.rating - a.rating;
    return 0;
  });
}

function updateShopView() {
  const processed = getProcessedProducts();
  renderProductCards(processed, "product-grid");
}

function initShopControls() {
  const filterBar = document.querySelector(".filter-bar");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      state.category = btn.dataset.category;
      updateShopView();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim();
      updateShopView();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      updateShopView();
    });
  }
}

// --------------------------------------------------------------------------
// 5. General Page Features & Details
// --------------------------------------------------------------------------
function toggleWishlist(btn) {
  btn.classList.toggle("active");
  const isWishlisted = btn.classList.contains("active");
  showToast(isWishlisted ? "Item added to your wishlist! ❤️" : "Item removed from wishlist.");
}

function changeQty(delta) {
  const qtyInput = document.getElementById("qty");
  if (!qtyInput) return;
  qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) + delta);
}

function addProductDetailToCart(productId) {
  const qty = parseInt(document.getElementById("qty")?.value || 1);
  addToCart(productId, qty);
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".navbar");
  if (toggle && navbar) {
    toggle.addEventListener("click", () => navbar.classList.toggle("open"));
  }
}

function initProductDetails() {
  const detailContainer = document.getElementById("product-detail-container");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id")) || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  document.title = `${product.name} — PawMart`;

  detailContainer.innerHTML = `
    <div class="product-detail-image">${product.emoji}</div>
    <div class="product-detail-info">
      <span class="product-cat">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="star-rating">★ <span>${product.rating} (${product.reviews} customer reviews)</span></div>
      <div class="product-detail-price" style="margin-top:10px;">Rs ${product.price}</div>
      <p class="product-detail-desc">${product.desc}</p>
      <div class="qty-row">
        <label for="qty">Quantity</label>
        <div class="qty-control">
          <button type="button" onclick="changeQty(-1)">−</button>
          <input type="text" id="qty" value="1" readonly>
          <button type="button" onclick="changeQty(1)">+</button>
        </div>
      </div>
      <button class="btn btn-primary" onclick="addProductDetailToCart(${product.id})">
        Add to Cart 🛒
      </button>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 6. Application Entry Point
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initShopControls();
  initProductDetails();
  updateCartBadge();

  if (document.getElementById("featured-grid")) {
    renderProductCards(PRODUCTS.slice(0, 4), "featured-grid");
  }

  if (document.getElementById("product-grid") && !document.getElementById("product-detail-container")) {
    updateShopView();
  }
});
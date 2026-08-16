/* ============================================
   PawMart — Shared JavaScript
   ============================================ */

const PRODUCTS = [
  { id: 1, name: "Chunky Kibble Dog Food (3kg)", category: "Dog Food", price: 1450, emoji: "🐶", rating: 4.9, reviews: 84, badge: "Bestseller", desc: "A protein-rich, grain-friendly kibble blend made for everyday energy and a shiny coat. Great for medium to large breed dogs." },
  { id: 2, name: "Salmon & Rice Cat Food (2kg)", category: "Cat Food", price: 1250, emoji: "🐱", rating: 4.8, reviews: 62, badge: "Sale", desc: "Real salmon and rice recipe that's gentle on sensitive tummies, with added taurine for healthy eyes and heart." },
  { id: 3, name: "Crunchy Training Treats", category: "Treats", price: 350, emoji: "🦴", rating: 5.0, reviews: 112, badge: "", desc: "Bite-sized, low-calorie treats that are perfect for training sessions or just a little extra love." },
  { id: 4, name: "Squeaky Bone Chew Toy", category: "Pet Toys", price: 420, emoji: "🧸", rating: 4.7, reviews: 45, badge: "🔥 Selling Fast", desc: "A durable rubber chew toy with a built-in squeaker, made to survive even the most enthusiastic chewers." },
  { id: 5, name: "Cloud Comfort Pet Bed", category: "Pet Beds", price: 2600, emoji: "🛏️", rating: 4.9, reviews: 98, badge: "Popular", desc: "Plush, machine-washable bed with raised edges so your pet has something soft to curl up against." },
  { id: 6, name: "Stainless Steel Food Bowl Set", category: "Food Bowls", price: 680, emoji: "🥣", rating: 4.6, reviews: 31, badge: "", desc: "A rust-resistant, non-slip bowl duo for food and water, easy to clean after every meal." },
  { id: 7, name: "Adjustable Collar & Leash Set", category: "Collars & Leashes", price: 950, emoji: "🐕", rating: 4.8, reviews: 53, badge: "", desc: "A matching collar and 1.2m leash set with sturdy clips, adjustable for a comfortable, secure fit." },
  { id: 8, name: "Oatmeal Shampoo for Sensitive Skin", category: "Grooming Products", price: 590, emoji: "🧴", rating: 4.9, reviews: 40, badge: "", desc: "A gentle, tear-free oatmeal shampoo that soothes itchy skin and leaves fur soft and fresh." },
  { id: 9, name: "Cozy Knit Pet Sweater", category: "Pet Clothes", price: 780, emoji: "👕", rating: 4.5, reviews: 22, badge: "New", desc: "A warm knit sweater for chilly evenings and cold-weather walks, available in three sizes." },
  { id: 10, name: "Travel Carrier Backpack", category: "Pet Accessories", price: 3200, emoji: "🏠", rating: 4.9, reviews: 76, badge: "Top Rated", desc: "A ventilated, comfortable carrier backpack for trips to the vet, the park, or on the road." },
  { id: 11, name: "Grain-Free Puppy Food (1.5kg)", category: "Dog Food", price: 1100, emoji: "🐶", rating: 4.8, reviews: 39, badge: "", desc: "Specially formulated for growing puppies, with DHA to support healthy brain and eye development." },
  { id: 12, name: "Feather Wand Cat Toy", category: "Pet Toys", price: 300, emoji: "🧸", rating: 4.7, reviews: 67, badge: "", desc: "An interactive feather wand that keeps indoor cats active, playful, and entertained." }
];

function addToCart(name, price) {
  alert(name + " added to cart! (Rs " + price + ")");
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".navbar");
  if (!toggle || !navbar) return;
  toggle.addEventListener("click", () => navbar.classList.toggle("open"));
}

function renderProductCards(products, containerId) {
  const container = document.getElementById(containerId);
  const emptyState = document.getElementById("empty-state-message");
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  container.innerHTML = products.map(p => `
    <article class="product-card" data-category="${p.category}">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
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
        <button class="btn btn-primary btn-small" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">
          Add to Cart 🛒
        </button>
      </div>
    </article>
  `).join("");
}

function toggleWishlist(button) {
  button.classList.toggle("active");
}

function initShopFilters() {
  const filterBar = document.querySelector(".filter-bar");
  if (!filterBar) return;

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
    renderProductCards(filtered, "product-grid");
  });
}

function initProductDetails() {
  const detailContainer = document.getElementById("product-detail-container");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id")) || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  document.title = product.name + " — PawMart";

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
      <button class="btn btn-primary" onclick="addProductDetailToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">
        Add to Cart 🛒
      </button>
    </div>
  `;
}

function changeQty(delta) {
  const qtyInput = document.getElementById("qty");
  if (!qtyInput) return;
  let value = parseInt(qtyInput.value) + delta;
  if (value < 1) value = 1;
  qtyInput.value = value;
}

function addProductDetailToCart(name, price) {
  const qty = document.getElementById("qty").value;
  alert(qty + " x " + name + " added to cart! (Rs " + (price * qty) + ")");
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-question").addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initShopFilters();
  initProductDetails();
  initFaqAccordion();

  if (document.getElementById("featured-grid")) {
    renderProductCards(PRODUCTS.slice(0, 4), "featured-grid");
  }

  if (document.getElementById("product-grid") && !document.getElementById("product-detail-container")) {
    renderProductCards(PRODUCTS, "product-grid");
  }
});
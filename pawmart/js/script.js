/* ============================================
   PawMart — Shared JavaScript
   ============================================ */

const PRODUCTS = [
  { id: 1, name: "Chunky Kibble Dog Food (3kg)", category: "Dog Food", price: 1450, emoji: "🐶", desc: "A protein-rich, grain-friendly kibble blend made for everyday energy and a shiny coat. Great for medium to large breed dogs." },
];
// Add to Cart — kept intentionally simple, no backend, no storage
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
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p class="empty-note">No products found in this category yet.</p>';
    return;
  }


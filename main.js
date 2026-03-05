const products = [
  { id: 1, title: "Gamer Nova Lite", oldPrice: 2560, newPrice: 1999 },
  { id: 2, title: "Titan Pro Supernova", oldPrice: 2750, newPrice: 2199 },
  { id: 3, title: "GameSir G7 HE", oldPrice: 2500, newPrice: 2099 },
  { id: 4, title: "PXN P50 RGB", oldPrice: 2400, newPrice: 1899 },
  { id: 5, title: "Shadow X Elite", oldPrice: 2999, newPrice: 2499 },
  { id: 6, title: "Neo Strike V2", oldPrice: 2300, newPrice: 1799 },
  { id: 7, title: "Arcade Grip 4", oldPrice: 2150, newPrice: 1699 },
  { id: 8, title: "Spider Phantom", oldPrice: 3200, newPrice: 2699 }
];

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");

function getCart() {
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = String(total);
}

function formatEGP(value) {
  return new Intl.NumberFormat("ar-EG").format(value) + " EGP";
}

function productCardTemplate(product) {
  return `
    <article class="product-card">
      <div class="product-image"></div>
      <h3 class="product-title">${product.title}</h3>
      <div class="price-row">
        <span class="old-price">${formatEGP(product.oldPrice)}</span>
        <span class="new-price">${formatEGP(product.newPrice)}</span>
      </div>
      <button class="add-btn" data-product-id="${product.id}">أضف إلى السلة</button>
    </article>
  `;
}

function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = products.map(productCardTemplate).join("");
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function bindEvents() {
  if (!productsGrid) return;

  productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".add-btn");
    if (!button) return;

    const productId = parseInt(button.dataset.productId, 10);
    addToCart(productId);

    button.textContent = "تمت الإضافة ✓";
    setTimeout(() => {
      button.textContent = "أضف إلى السلة";
    }, 900);
  });
}

updateCartCount();
renderProducts();
bindEvents();
function getCart() {
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = String(total);
}

function formatEGP(value) {
  return new Intl.NumberFormat("ar-EG").format(value) + " EGP";
}

function renderCartItems() {
  const cartItems = document.getElementById("cartItems");
  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">السلة فارغة حاليًا</p>';
    updateSummary();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image"></div>
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p class="cart-item-price">${formatEGP(item.newPrice)}</p>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="qty-minus" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">حذف</button>
      </div>
    </div>
  `
    )
    .join("");

  updateSummary();
}

function updateSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 50;
  const total = subtotal + shipping;

  document.getElementById("subtotal").textContent = formatEGP(subtotal);
  document.getElementById("shipping").textContent = shipping === 0 ? "مجاني" : formatEGP(shipping);
  document.getElementById("total").textContent = formatEGP(total);

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (cart.length === 0) {
    checkoutBtn.style.pointerEvents = "none";
    checkoutBtn.style.opacity = "0.5";
  } else {
    checkoutBtn.style.pointerEvents = "auto";
    checkoutBtn.style.opacity = "1";
  }
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeItem(id);
    return;
  }

  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

document.getElementById("cartItems").addEventListener("click", (e) => {
  const plusBtn = e.target.closest(".qty-plus");
  const minusBtn = e.target.closest(".qty-minus");
  const removeBtn = e.target.closest(".remove-btn");

  if (plusBtn) {
    changeQuantity(parseInt(plusBtn.dataset.id, 10), 1);
  } else if (minusBtn) {
    changeQuantity(parseInt(minusBtn.dataset.id, 10), -1);
  } else if (removeBtn) {
    removeItem(parseInt(removeBtn.dataset.id, 10));
  }
});

updateCartCount();
renderCartItems();
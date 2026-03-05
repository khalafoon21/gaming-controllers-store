function getCart() {
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
}

function formatEGP(value) {
  return new Intl.NumberFormat("ar-EG").format(value) + " EGP";
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = String(total);
}

function renderOrderSummary() {
  const cart = getCart();
  const orderItems = document.getElementById("orderItems");

  if (cart.length === 0) {
    window.location.href = "./cart.html";
    return;
  }

  orderItems.innerHTML = cart
    .map(
      (item) => `
    <div class="order-item">
      <span>${item.title} × ${item.quantity}</span>
      <span>${formatEGP(item.newPrice * item.quantity)}</span>
    </div>
  `
    )
    .join("");

  updateTotals();
}

function updateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);

  const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
  let shippingCost = 50;

  if (shippingMethod === "express") {
    shippingCost = 100;
  } else if (shippingMethod === "free" && subtotal >= 1500) {
    shippingCost = 0;
  } else if (shippingMethod === "free" && subtotal < 1500) {
    shippingCost = 50;
  }

  const total = subtotal + shippingCost;

  document.getElementById("subtotal").textContent = formatEGP(subtotal);
  document.getElementById("shippingCost").textContent = formatEGP(shippingCost);
  document.getElementById("total").textContent = formatEGP(total);

  const freeShippingPrice = document.getElementById("freeShippingPrice");
  if (subtotal >= 1500) {
    freeShippingPrice.textContent = "0 EGP";
  } else {
    freeShippingPrice.textContent = "غير متاح";
  }
}

document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
  radio.addEventListener("change", updateTotals);
});

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    postal: document.getElementById("postal").value,
    shipping: document.querySelector('input[name="shipping"]:checked').value,
    payment: document.querySelector('input[name="payment"]:checked').value,
    cart: getCart(),
    total: document.getElementById("total").textContent
  };

  console.log("Order submitted:", formData);

  localStorage.removeItem("cart");

  alert("تم تأكيد طلبك بنجاح! سيتم التواصل معك قريبًا.");
  window.location.href = "./index.html";
});

updateCartCount();
renderOrderSummary();
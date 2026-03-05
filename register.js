function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const stored = localStorage.getItem("cart");
  const cart = stored ? JSON.parse(stored) : [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = String(total);
}

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  localStorage.setItem("user", JSON.stringify({ name, email, phone, loggedIn: true }));

  alert("تم إنشاء الحساب بنجاح!");
  window.location.href = "./index.html";
});

updateCartCount();
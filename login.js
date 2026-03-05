function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const stored = localStorage.getItem("cart");
  const cart = stored ? JSON.parse(stored) : [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = String(total);
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  localStorage.setItem("user", JSON.stringify({ email, loggedIn: true }));

  alert("تم تسجيل الدخول بنجاح!");
  window.location.href = "./index.html";
});

updateCartCount();
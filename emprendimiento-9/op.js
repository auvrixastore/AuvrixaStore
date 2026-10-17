// Importar los módulos de Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuración de Firebase con tus credenciales reales
const firebaseConfig = {
  apiKey: "AIzaSyBc6CjSRn5VKB-RK_myorhUX9Ba7H9FKvI",
  authDomain: "urbanwearstore-7757d.firebaseapp.com",
  projectId: "urbanwearstore-7757d",
  storageBucket: "urbanwearstore-7757d.firebasestorage.app",
  messagingSenderId: "1044802071199",
  appId: "1:1044802071199:web:f3bd45ba462b13a3da50aa",
  measurementId: "G-7PCTM0000X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Base de datos de productos de la tienda
const productos = [
  { id: 1, nombre: "Camiseta Oversize Minimalist", precio: 25.00, imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
  { id: 2, nombre: "Hoodie Urbano Negro", precio: 45.00, imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" },
  { id: 3, nombre: "Chaqueta Denim Classic", precio: 65.00, imagen: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500" },
  { id: 4, nombre: "Pantalón Cargo Beige", precio: 40.00, imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" }
];

let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const gridProductos = document.getElementById("product-grid");
  const cartCount = document.getElementById("cart-count");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalPrice = document.getElementById("cart-total-price");
  const modalLogin = document.getElementById("modal-login");

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  function cargarProductos() {
    if (!gridProductos) return;
    gridProductos.innerHTML = "";
    productos.forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <div class="product-info">
          <div>
            <h3 class="product-title">${prod.nombre}</h3>
            <p class="product-price">$${prod.precio.toFixed(2)}</p>
          </div>
          <button class="btn-primary" onclick="agregarAlCarrito(${prod.id})">Agregar al Carrito</button>
        </div>
      `;
      gridProductos.appendChild(card);
    });
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Funcionalidad del Carrito
  window.agregarAlCarrito = function(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);

    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
    abrirCarrito();
  };

  function actualizarCarrito() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalCantidad = 0;

    carrito.forEach(item => {
      total += item.precio * item.cantidad;
      totalCantidad += item.cantidad;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div>
          <h4>${item.nombre}</h4>
          <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
        </div>
        <button class="btn-secondary" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    if (cartCount) cartCount.textContent = totalCantidad;
    if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  }

  window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
  };

  function abrirCarrito() { if (cartDrawer) cartDrawer.classList.remove("hidden"); }
  function cerrarCarrito() { if (cartDrawer) cartDrawer.classList.add("hidden"); }

  const btnCart = document.getElementById("btn-cart");
  const btnCloseCart = document.getElementById("btn-close-cart");
  if (btnCart) btnCart.addEventListener("click", abrirCarrito);
  if (btnCloseCart) btnCloseCart.addEventListener("click", cerrarCarrito);

  // Mostrar/Ocultar contraseña con el ojito
  const btnTogglePassword = document.getElementById("btn-toggle-password");
  const passwordInput = document.getElementById("password");
  
  if (btnTogglePassword && passwordInput) {
    btnTogglePassword.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      
      const icon = btnTogglePassword.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", type === "password" ? "eye" : "eye-off");
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });
  }

  // Autenticación real con Firebase (Login / Registro automático si no existe)
  const formAuth = document.getElementById("form-auth");
  if (formAuth) {
    formAuth.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email");

      if (!emailInput || !passwordInput) return;
      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        // Intenta iniciar sesión con Firebase
        await signInWithEmailAndPassword(auth, email, password);
        accesoExitoso(email);
      } catch (error) {
        try {
          // Si el usuario no existe, lo registra de forma segura en Firebase
          await createUserWithEmailAndPassword(auth, email, password);
          alert("¡Cuenta creada y registrada con éxito en Firebase!");
          accesoExitoso(email);
        } catch (regError) {
          alert("Error de acceso: " + regError.message);
        }
      }
    });
  }

  function accesoExitoso(email) {
    if (modalLogin) modalLogin.classList.add("hidden");
    const userDisplay = document.getElementById("user-display");
    if (userDisplay) {
      userDisplay.textContent = email;
      userDisplay.classList.remove("hidden");
    }
    cargarProductos();
  }

  const btnCheckout = document.getElementById("btn-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }
      alert("¡Compra procesada con éxito! Gracias por elegir Auvrixa Store.");
      carrito = [];
      actualizarCarrito();
      cerrarCarrito();
    });
  }
});
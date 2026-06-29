// ================= DATOS DE EJEMPLO =================
const destinations = [
  {
    id: 1,
    title: "Cañón del Chicamocha",
    region: "santander",
    price: 150000,
    duration: "8 Horas",
    img: "./chicamocha.jpg",
    desc: "Recorrido completo con paradas en miradores.",
  },
  {
    id: 2,
    title: "Los Estoraques",
    region: "norte-santander",
    price: 180000,
    duration: "10 Horas",
    img: "./estoraques.jpg",
    desc: "Aventura mística en formaciones rocosas únicas.",
  },
  {
    id: 3,
    title: "Parque Tayrona",
    region: "costa",
    price: 250000,
    duration: "2 Días",
    img: "./tayrona.jpg",
    desc: "Carretera costera y acampada cerca al mar.",
  },
  {
    id: 4,
    title: "Barichara",
    region: "santander",
    price: 120000,
    duration: "6 Horas",
    img: "./barichara.jpg",
    desc: "Visita al pueblito más lindo de Colombia.",
  },
];

let cart = [];

// ================= NAVEGACIÓN Y PANTALLAS =================
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");

document.getElementById("btnGoToScreen2").addEventListener("click", () => {
  screen1.classList.remove("active");
  setTimeout(() => {
    screen1.classList.add("hidden");
    screen2.classList.remove("hidden");
    // Un pequeño timeout para que la transición de opacidad funcione
    setTimeout(() => screen2.classList.add("active"), 50);
  }, 500); // 500ms coincide con el transition de CSS
});

document.getElementById("btnBack").addEventListener("click", () => {
  screen2.classList.remove("active");
  setTimeout(() => {
    screen2.classList.add("hidden");
    screen1.classList.remove("hidden");
    setTimeout(() => screen1.classList.add("active"), 50);
  }, 500);
});

// Bajar un poco en la Screen 1
document.getElementById("btnExplorar").addEventListener("click", () => {
  window.scrollBy({ top: window.innerHeight - 100, behavior: "smooth" });
});

// ================= ANIMACIONES AL SCROLL (Intersection Observer) =================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 },
);

document
  .querySelectorAll(".scroll-reveal")
  .forEach((el) => observer.observe(el));

// ================= RENDER DE TARJETAS Y FILTROS =================
const grid = document.getElementById("destinationsGrid");
const filterBtns = document.querySelectorAll(".filter-btn");

function renderCards(filterRegion = "todas") {
  grid.innerHTML = ""; // Limpiar grid

  const filteredData =
    filterRegion === "todas"
      ? destinations
      : destinations.filter((d) => d.region === filterRegion);

  filteredData.forEach((dest) => {
    const card = document.createElement("div");
    card.className = "tour-card";
    card.innerHTML = `
            <img src="${dest.img}" alt="${dest.title}" onerror="this.src='https://via.placeholder.com/400x200?text=Imagen+Destino'">
            <div class="tour-content">
                <h3>${dest.title}</h3>
                <div class="tour-details">
                    <span><i class="fas fa-clock"></i> ${dest.duration}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${dest.region.toUpperCase()}</span>
                </div>
                <p style="margin-bottom: 15px; font-size:0.9rem;">${dest.desc}</p>
                <div class="price">$${dest.price.toLocaleString("es-CO")} COP</div>
                <button class="btn-add" onclick="addToCart(${dest.id})">Agregar al Viaje</button>
            </div>
        `;
    grid.appendChild(card);
  });
}

// Lógica de los botones de filtro
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    renderCards(e.target.dataset.region);
  });
});

// Inicializar tarjetas
renderCards();

// ================= LÓGICA DEL CARRITO =================
const cartSidebar = document.getElementById("cartSidebar");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cart-count");

// Abrir/Cerrar
cartToggle.addEventListener("click", () => cartSidebar.classList.add("open"));
closeCart.addEventListener("click", () => cartSidebar.classList.remove("open"));

// Función global para agregar desde el botón de la tarjeta
window.addToCart = function (id) {
  const item = destinations.find((d) => d.id === id);
  cart.push(item);
  updateCartUI();
  // Abrir automáticamente el carrito para mejor UX
  cartSidebar.classList.add("open");
};

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <div>
                <strong>${item.title}</strong><br>
                <small>$${item.price.toLocaleString("es-CO")}</small>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.innerText = total.toLocaleString("es-CO");
  cartCountEl.innerText = cart.length;
}

// ================= ENVÍO A WHATSAPP =================
document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Tu carrito está vacío. Agrega un destino primero.");
    return;
  }

  const name = document.getElementById("clientName").value;
  const dates = document.getElementById("clientDates").value;

  // Configura aquí tu número de WhatsApp (código de país + número, sin el símbolo +)
  // Ejemplo para Colombia: 57 seguido de tu celular
  const phone = "573103877948";

  let message = `*¡Hola! Soy ${name}.* 👋\nMe interesa hacer una reserva para las fechas: ${dates}.\n\n*Mi itinerario deseado:* \n`;

  let total = 0;
  cart.forEach((item) => {
    message += `📍 ${item.title} - $${item.price.toLocaleString("es-CO")}\n`;
    total += item.price;
  });

  message += `\n*Presupuesto Total:* $${total.toLocaleString("es-CO")} COP\n\n¿Podrían darme más información?`;

  // Codificar el texto para que las URLs no se rompan por los espacios o saltos de línea
  const encodedMessage = encodeURIComponent(message);
  const waURL = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  window.open(waURL, "_blank");
});

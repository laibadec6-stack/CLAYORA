const products = [
  { id: "dinner-plate", name: "White Stoneware Dinner Plate", category: "Dinner plates", price: 32, image: "photo-1605883705077-8d3d3cebe78c", badge: "Bestseller" },
  { id: "side-plate", name: "Round Ceramic Side Plate", category: "Side plates", price: 24, image: "photo-1591632288574-a387f820a1ca", badge: "" },
  { id: "soup-bowl", name: "Brown Glazed Soup Bowl", category: "Soup bowls", price: 29, image: "photo-1577576223085-3eb295cd414f", badge: "" },
  { id: "pasta-bowl", name: "White Ceramic Pasta Bowl", category: "Pasta bowls", price: 36, image: "photo-1530006498959-b7884e829a04", badge: "" },
  { id: "cereal-bowl", name: "Everyday Cereal Bowl", category: "Cereal bowls", price: 26, image: "photo-1525973779373-015bdf68e579", badge: "" },
  { id: "tea-cup", name: "White Stoneware Tea Cup", category: "Tea cups", price: 22, image: "photo-1516390118834-21602d501886", badge: "" },
  { id: "coffee-mug", name: "Handmade Ceramic Coffee Mug", category: "Coffee mugs", price: 28, image: "photo-1643946404043-178456b0e3f8", badge: "Bestseller" },
  { id: "ceramic-spoon", name: "Ceramic Spoon", category: "Ceramic spoons", price: 14, image: "photo-1670843840695-be4ce9626145", badge: "" },
  { id: "serving-spoon", name: "Ceramic Serving Spoon", category: "Serving spoons", price: 19, image: "photo-1614548539644-ef528186523a", badge: "" },
  { id: "serving-tray", name: "White Serving Tray", category: "Serving trays", price: 58, image: "photo-1571987530791-58e3e7744d99", badge: "" },
  { id: "dinner-set", name: "Colorful Ceramic Dinner Set", category: "Dinner sets", price: 148, image: "photo-1551807306-4bcd16b92a41", badge: "Set of 4" },
  { id: "tea-set", name: "Ceramic Tea Cup Set", category: "Tea sets", price: 96, image: "photo-1610701596007-11502861dcfa", badge: "" },
  { id: "serving-platter", name: "White Ceramic Serving Platter", category: "Serving platters", price: 64, image: "photo-1633856858940-42229cb53dd3", badge: "" },
  { id: "kitchen-accessory", name: "Small Ceramic Catchall Bowl", category: "Kitchen accessories", price: 18, image: "photo-1552740844-4f8a8206c68d", badge: "" }
];

const categories = ["All pieces", "Dinner plates", "Side plates", "Soup bowls", "Pasta bowls", "Cereal bowls", "Tea cups", "Coffee mugs", "Ceramic spoons", "Serving spoons", "Serving trays", "Dinner sets", "Tea sets", "Serving platters", "Kitchen accessories", "Bowls", "Serving"];
const imageUrl = (id, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
const formatPrice = amount => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("atelier-earth-cart") || "[]");
    if (!Array.isArray(saved)) throw new TypeError("Saved cart is not a list.");
    return saved.filter(item => products.some(product => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0);
  } catch (error) {
    console.error("Could not read the saved cart.", error);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem("atelier-earth-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the cart to this browser.", error);
    window.alert("Your browser couldn't save your cart. Check that browser storage is enabled.");
  }
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(node => { node.textContent = count; });
}

function productCard(product) {
  return `<div class="col-6 col-lg-3"><article class="product-card"><div class="product-image-wrap">${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}<img class="product-image" src="${imageUrl(product.image)}" alt="${product.name}" loading="lazy"></div><div class="product-info"><h3>${product.name}</h3><div class="product-meta"><span>${product.category}</span><span class="product-price">${formatPrice(product.price)}</span></div><button class="product-add" type="button" data-add-to-cart="${product.id}">Add to bag <i class="bi bi-arrow-up-right"></i></button></div></article></div>`;
}

function renderShop() {
  const container = document.querySelector("[data-shop-products]");
  const filters = document.querySelector("[data-category-filters]");
  if (!container || !filters) return;

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") || "All pieces";
  let activeCategory = categories.includes(initialCategory) ? initialCategory : "All pieces";
  const search = document.querySelector("[data-product-search]");

  function draw() {
    const term = search.value.trim().toLowerCase();
    const filtered = products.filter(product => {
      const categoryMatches = activeCategory === "All pieces"
        || product.category === activeCategory
        || (activeCategory === "Bowls" && product.category.toLowerCase().includes("bowl"))
        || (activeCategory === "Serving" && ["Serving spoons", "Serving trays", "Serving platters"].includes(product.category));
      return categoryMatches && `${product.name} ${product.category}`.toLowerCase().includes(term);
    });
    container.innerHTML = filtered.map(productCard).join("");
    document.querySelector("[data-product-count]").textContent = `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`;
    document.querySelector("[data-no-products]").classList.toggle("d-none", filtered.length !== 0);
    filters.querySelectorAll(".category-filter").forEach(button => button.classList.toggle("active", button.dataset.category === activeCategory));
  }

  filters.innerHTML = categories.map(category => `<button type="button" class="category-filter${category === activeCategory ? " active" : ""}" data-category="${category}">${category}</button>`).join("");
  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    draw();
  });
  search.addEventListener("input", draw);
  draw();
}

function renderFeatured() {
  const container = document.querySelector("[data-featured-products]");
  if (container) container.innerHTML = products.slice(0, 4).map(productCard).join("");
}

function initStoryValues() {
  const explorer = document.querySelector("[data-values-explorer]");
  if (!explorer) return;

  const values = {
    use: {
      kicker: "For everyday rituals",
      title: "Made to be used.",
      description: "Our pieces are designed for real life: the first cup of coffee, a table full of friends, and every lovely, ordinary meal in between.",
      caption: "Considered, from the very first touch.",
      image: "photo-1605883705077-8d3d3cebe78c",
      alt: "A ceramic plate made for everyday meals"
    },
    choose: {
      kicker: "Good things, thoughtfully found",
      title: "Chosen with care.",
      description: "We look for honest materials, enduring shapes, and makers who put care into their craft. Every piece has a reason to be here.",
      caption: "A thoughtful eye for lasting pieces.",
      image: "photo-1551807306-4bcd16b92a41",
      alt: "A considered collection of ceramic tableware"
    },
    keep: {
      kicker: "Made to find its place at home",
      title: "Keep-worthy things.",
      description: "The best objects become part of your story. They're reached for, shared around, and loved a little more with every passing year.",
      caption: "Pieces to live with, and live in.",
      image: "photo-1587560555570-4d3f84dcee05",
      alt: "Handmade ceramic bowls in natural tones"
    }
  };

  const image = explorer.querySelector("[data-value-image]");
  const buttons = [...explorer.querySelectorAll("[data-value]")];

  function selectValue(button) {
    const value = values[button.dataset.value];
    if (!value) return;

    buttons.forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    explorer.querySelector("[data-value-kicker]").textContent = value.kicker;
    explorer.querySelector("[data-value-title]").textContent = value.title;
    explorer.querySelector("[data-value-description]").textContent = value.description;
    explorer.querySelector("[data-value-caption]").textContent = value.caption;
    image.alt = value.alt;
    image.src = imageUrl(value.image, 1000);
  }

  explorer.addEventListener("click", event => {
    const button = event.target.closest("[data-value]");
    if (button && explorer.contains(button)) selectValue(button);
  });

  explorer.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const currentIndex = buttons.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? buttons.length - 1
      : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
    selectValue(buttons[nextIndex]);
  });
}

function initStoryJourney() {
  const journey = document.querySelector("[data-story-journey]");
  if (!journey) return;

  const chapters = [
    {
      id: "beginning",
      kicker: "A small idea, at home",
      title: "It starts with the everyday.",
      description: "Some of our favorite moments are the simplest ones: a quiet first cup, a shared meal, the familiar bowl we reach for without thinking. CLAYORA grew from wanting those everyday pieces to feel a little more special.",
      caption: "It begins with the everyday.",
      image: "photo-1587560555570-4d3f84dcee05",
      alt: "A handmade ceramic bowl in earthy tones"
    },
    {
      id: "search",
      kicker: "A thoughtful eye",
      title: "The details make the difference.",
      description: "We look for ceramics that feel good in the hand and right at home: considered shapes, tactile finishes, and the quiet character that comes from thoughtful making. Each piece is chosen to be used, not just admired.",
      caption: "Chosen for its feel, form and lasting charm.",
      image: "photo-1551807306-4bcd16b92a41",
      alt: "A colorful collection of carefully chosen ceramic tableware"
    },
    {
      id: "home",
      kicker: "Made part of your story",
      title: "Then the pieces become yours.",
      description: "A mug becomes part of your morning. A serving bowl makes another appearance at the table. The pieces we love most gather memories as they go—and make everyday life feel more like home.",
      caption: "The best pieces feel like they have always belonged.",
      image: "photo-1605883705077-8d3d3cebe78c",
      alt: "Ceramic dinnerware ready to be part of an everyday meal"
    }
  ];

  const buttons = [...journey.querySelectorAll("[data-chapter]")];
  const progress = journey.querySelector("[data-journey-progress]");
  let activeIndex = 0;

  function showChapter(index) {
    activeIndex = (index + chapters.length) % chapters.length;
    const chapter = chapters[activeIndex];
    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === activeIndex;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    journey.querySelector("[data-journey-kicker]").textContent = chapter.kicker;
    journey.querySelector("[data-journey-title]").textContent = chapter.title;
    journey.querySelector("[data-journey-description]").textContent = chapter.description;
    journey.querySelector("[data-journey-caption]").textContent = chapter.caption;
    journey.querySelector("[data-journey-index]").textContent = `0${activeIndex + 1} — 0${chapters.length}`;
    progress.style.width = `${((activeIndex + 1) / chapters.length) * 100}%`;

    const image = journey.querySelector("[data-journey-image]");
    image.alt = chapter.alt;
    image.src = imageUrl(chapter.image, 1100);
  }

  journey.addEventListener("click", event => {
    const chapterButton = event.target.closest("[data-chapter]");
    if (chapterButton && journey.contains(chapterButton)) {
      showChapter(buttons.indexOf(chapterButton));
      return;
    }
    if (event.target.closest("[data-journey-next]")) showChapter(activeIndex + 1);
  });

  journey.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const currentIndex = buttons.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? buttons.length - 1
      : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
    showChapter(nextIndex);
  });

  showChapter(activeIndex);
}

function renderCart() {
  const itemsContainer = document.querySelector("[data-cart-items]");
  const summaryContainer = document.querySelector("[data-cart-summary]");
  if (!itemsContainer || !summaryContainer) return;

  const cart = getCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartContent = document.querySelector(".cart-content");
  document.querySelector("[data-cart-item-count]").textContent = `(${itemCount})`;

  if (cart.length === 0) {
    cartContent.classList.add("is-empty");
    summaryContainer.classList.add("d-none");
    itemsContainer.innerHTML = `<div class="cart-empty"><i class="bi bi-bag"></i><h2>Your bag is taking a little break.</h2><p>Find something lovely for your everyday rituals.</p><a class="btn btn-earth" href="shop.html">Explore the collection <i class="bi bi-arrow-up-right"></i></a></div>`;
    summaryContainer.innerHTML = "";
    return;
  }

  cartContent.classList.remove("is-empty");
  summaryContainer.classList.remove("d-none");
  const subtotal = cart.reduce((total, item) => total + products.find(product => product.id === item.id).price * item.quantity, 0);
  itemsContainer.innerHTML = cart.map(item => {
    const product = products.find(candidate => candidate.id === item.id);
    return `<article class="cart-item"><img src="${imageUrl(product.image, 300)}" alt="${product.name}"><div><h2>${product.name}</h2><span class="cart-item-category">${product.category}</span><div class="cart-item-price">${formatPrice(product.price)} each</div><div class="quantity-control"><button type="button" aria-label="Decrease quantity of ${product.name}" data-quantity-change="-1" data-product-id="${product.id}">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase quantity of ${product.name}" data-quantity-change="1" data-product-id="${product.id}">+</button></div><button type="button" class="cart-remove" data-remove-from-cart="${product.id}">Remove</button></div><span class="cart-item-total">${formatPrice(product.price * item.quantity)}</span></article>`;
  }).join("");
  summaryContainer.innerHTML = `<h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div><div class="summary-row"><span>Shipping</span><span>${subtotal >= 100 ? "Complimentary" : "Calculated at checkout"}</span></div><p class="shipping-note">${subtotal >= 100 ? "Your order ships on us. How lovely." : `You're ${formatPrice(100 - subtotal)} away from complimentary shipping.`}</p><div class="summary-row total"><span>Total before shipping</span><span>${formatPrice(subtotal)}</span></div><button type="button" class="btn btn-earth checkout-button" data-checkout>Continue to checkout <i class="bi bi-arrow-up-right"></i></button>`;
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) {
    const id = addButton.dataset.addToCart;
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, quantity: 1 });
    saveCart(cart);
    const original = addButton.innerHTML;
    addButton.innerHTML = "Added to bag <i class=\"bi bi-check2\"></i>";
    window.setTimeout(() => { addButton.innerHTML = original; }, 1200);
  }

  const quantityButton = event.target.closest("[data-quantity-change]");
  if (quantityButton) {
    const cart = getCart();
    const item = cart.find(candidate => candidate.id === quantityButton.dataset.productId);
    if (item) item.quantity += Number(quantityButton.dataset.quantityChange);
    saveCart(cart.filter(candidate => candidate.quantity > 0));
    renderCart();
  }

  const removeButton = event.target.closest("[data-remove-from-cart]");
  if (removeButton) {
    saveCart(getCart().filter(item => item.id !== removeButton.dataset.removeFromCart));
    renderCart();
  }

  if (event.target.closest("[data-checkout]")) {
    window.alert("Thanks for shopping with CLAYORA! Online checkout isn't available in this demo.");
  }
});

document.querySelector("[data-contact-form]")?.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const subject = `[CLAYORA] ${formData.get("subject")}`;
  const body = `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`;
  window.location.href = `mailto:hello@clayora.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector("[data-contact-feedback]").textContent = "Your message is ready in your email app.";
  form.reset();
});

document.querySelectorAll("[data-year]").forEach(node => { node.textContent = new Date().getFullYear(); });
updateCartCount();
renderFeatured();
renderShop();
renderCart();
initStoryJourney();
initStoryValues();

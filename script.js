// =====================================
// SARAH'S FINGER - MAIN JAVASCRIPT
// =====================================

// =====================================
// DARK MODE
// =====================================

const darkModeButton = document.getElementById("darkMode");

if (darkModeButton) {
    darkModeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const icon = darkModeButton.querySelector("i");

        if (icon) {
            if (document.body.classList.contains("dark-mode")) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            } else {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            }
        }
    });
}

// =====================================
// MOBILE NAVIGATION
// =====================================

const menuButton = document.querySelector(".menu");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}

// =====================================
// GET AND SAVE CART
// =====================================

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// =====================================
// UPDATE CART COUNT
// =====================================

function updateCartCount() {
    const countElement = document.getElementById("cart-count");

    if (!countElement) return;

    const cart = getCart();

    const totalQuantity = cart.reduce(function (total, item) {
        return total + Math.max(0, Number(item.quantity) || 0);
    }, 0);

    countElement.textContent = totalQuantity;
}

// =====================================
// ADD PRODUCTS TO CART
// =====================================

function addToCart(name, price) {
    const cart = getCart();

    const existingItem = cart.find(function (item) {
        return item.name === name;
    });

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart(cart);

    alert(name + " added to your cart!");
}

// =====================================
// DISPLAY CART PRODUCTS
// =====================================

function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    // Only run this section on the cart page
    if (!cartItemsContainer || !cartTotalElement) return;

    const cart = getCart();

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty 🛒</h3>
                <p>You haven't added any bakery products yet.</p>
                <a href="index.html" class="checkout-btn">
                    Continue Shopping
                </a>
            </div>
        `;

        cartTotalElement.textContent = "$0.00";
        updateCartCount();
        return;
    }

    let total = 0;

    cart.forEach(function (item, index) {
        const price = Math.max(0, Number(item.price) || 0);
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const itemTotal = price * quantity;

        total += itemTotal;

        const product = document.createElement("div");
        product.className = "cart-item";

        product.innerHTML = `
            <div class="cart-item-info">
                <h3 class="product-name"></h3>
                <p class="product-price"></p>
                <p class="product-subtotal"></p>
            </div>

            <div class="cart-item-actions">
                <button type="button" class="decrease" aria-label="Decrease quantity">-</button>

                <span class="quantity">${quantity}</span>

                <button type="button" class="increase" aria-label="Increase quantity">+</button>

                <button type="button" class="remove-item">Remove</button>
            </div>
        `;

        product.querySelector(".product-name").textContent =
            item.name || "Bakery Product";

        product.querySelector(".product-price").textContent =
            "Price: $" + price.toFixed(2);

        product.querySelector(".product-subtotal").textContent =
            "Subtotal: $" + itemTotal.toFixed(2);

        product.querySelector(".decrease").addEventListener("click", function () {
            changeQuantity(index, -1);
        });

        product.querySelector(".increase").addEventListener("click", function () {
            changeQuantity(index, 1);
        });

        product.querySelector(".remove-item").addEventListener("click", function () {
            removeFromCart(index);
        });

        cartItemsContainer.appendChild(product);
    });

    cartTotalElement.textContent = "$" + total.toFixed(2);

    updateCartCount();
}

// =====================================
// INCREASE OR DECREASE QUANTITY
// =====================================

function changeQuantity(index, amount) {
    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity = (Number(cart[index].quantity) || 1) + amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    displayCart();
}

// =====================================
// REMOVE PRODUCT FROM CART
// =====================================

function removeFromCart(index) {
    const cart = getCart();

    if (index < 0 || index >= cart.length) return;

    cart.splice(index, 1);

    saveCart(cart);
    displayCart();
}

// =====================================
// INITIALIZE WHEN PAGE LOADS
// =====================================

document.addEventListener("DOMContentLoaded", function () {
    displayCart();
    updateCartCount();
});
// =====================================
// EXTRAS - paste at the VERY END of script.js
// Works on every page (home, cart, services)
// =====================================

// ---------- Remember dark mode on every page ----------
(function () {
    try {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    } catch (error) {
        // Storage not available - ignore
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    // ---------- Dark mode: save choice + correct icon ----------
    const darkBtn = document.getElementById("darkMode");

    if (darkBtn) {
        const darkIcon = darkBtn.querySelector("i");

        // Page opened in saved dark mode: show the sun icon
        if (darkIcon && document.body.classList.contains("dark-mode")) {
            darkIcon.classList.remove("fa-moon");
            darkIcon.classList.add("fa-sun");
        }

        // The main handler toggles the class first, then this saves it
        darkBtn.addEventListener("click", function () {
            try {
                const isDark = document.body.classList.contains("dark-mode");
                localStorage.setItem("theme", isDark ? "dark" : "light");
            } catch (error) {
                // Storage not available - ignore
            }
        });
    }

    // ---------- Mobile menu: close after tapping a link ----------
    const menuLinks = document.querySelector(".nav-links");

    if (menuLinks) {
        menuLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menuLinks.classList.remove("active");
            });
        });

        // ---------- Highlight the current page in the menu ----------
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        menuLinks.querySelectorAll("a").forEach(function (link) {
            const href = link.getAttribute("href");

            if (href && href.indexOf("#") === -1 && href === currentPage) {
                link.classList.add("active-page");
            }
        });
    }

    // ---------- Fade cards in as they scroll into view ----------
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("IntersectionObserver" in window && !reducedMotion) {
        const items = document.querySelectorAll(
            ".service-card, .feature, .product-card, .section-heading"
        );

        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        items.forEach(function (item) {
            item.classList.add("reveal");
            observer.observe(item);
        });
    }
});
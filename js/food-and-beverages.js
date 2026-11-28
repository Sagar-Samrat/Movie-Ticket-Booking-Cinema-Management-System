
const FOOD_CART_KEY = "cineverse_food_cart_v1";
const FOOD_TOTAL_KEY = "foodTotal";

let cart = [];

let cartBox = document.querySelector(".cart-box");
let cartItems = document.querySelector("#cartItems");
let viewCartBtn = document.querySelector(".cart-btn");

cartItems.style.display = "none";
cartItems.style.marginTop = "25px";
cartItems.style.textAlign = "left";




// CHECK LOGIN
function checkLogin() {

    if (window.CineAuth && window.CineAuth.getSession()) {
        return true;
    }

    if (window.CineAuth && typeof window.CineAuth.buildLoginRedirectUrl === "function") {
        window.location.href = window.CineAuth.buildLoginRedirectUrl("food-and-beverages.html");
    } else {
        window.location.href = "login.html?redirect=food-and-beverages.html";
    }
    return false;
}

function saveCartState() {
    if (!(window.CineAuth && window.CineAuth.getSession())) {
        return;
    }
    try {
        const total = cart.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);
        localStorage.setItem(FOOD_CART_KEY, JSON.stringify(cart));
        localStorage.setItem(FOOD_TOTAL_KEY, String(total));
    } catch (err) {
        /* ignore storage errors */
    }
}

function loadCartState() {
    if (!(window.CineAuth && window.CineAuth.getSession())) {
        cart = [];
        return;
    }
    try {
        const saved = JSON.parse(localStorage.getItem(FOOD_CART_KEY) || "[]");
        if (Array.isArray(saved)) {
            cart = saved.filter(function (item) {
                return item && item.name && Number(item.price) > 0 && Number(item.quantity) > 0;
            });
        }
    } catch (err) {
        cart = [];
    }
}


// ADD BUTTONS
let addButtons = document.querySelectorAll(
    ".food-card button, .small-food-card button, .combo-card button"
);


// GET ITEM DETAILS
function getDetails(card) {

    let name, price;

    if (card.classList.contains("combo-card")) {
        name = card.querySelector("h3").innerText;
        price = card.querySelector("h4").innerText;
    }
    else {
        name = card.querySelector("h4").innerText;
        price = card.querySelector(".food-bottom strong").innerText;
    }

    return {
        name: name,
        price: parseInt(price.replace("₹", ""))
    };
}


// ADD ITEM TO CART
function addToCart(name, price) {

    let item = cart.find(function(i) {
        return i.name === name;
    });

    if (item) {
        item.quantity++;
    }
    else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCartState();
    updateCards();
    displayCart();
}


// ADD BUTTON CLICK
addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (!checkLogin()) return;

        let card = button.closest(
            ".food-card, .small-food-card, .combo-card"
        );

        let item = getDetails(card);

        addToCart(item.name, item.price);

    });

});


// UPDATE FOOD CARDS
function updateCards() {

    addButtons.forEach(function(button) {

        let card = button.closest(
            ".food-card, .small-food-card, .combo-card"
        );

        let item = getDetails(card);

        let found = cart.find(function(i) {
            return i.name === item.name;
        });

        let oldControls = card.querySelector(".card-controls");

        if (oldControls) {
            oldControls.remove();
        }

        if (found) {

            button.style.display = "none";

            let controls = document.createElement("div");
            controls.className = "card-controls";

            controls.innerHTML = `
                <button onclick="changeCardQty('${item.name}', -1)">−</button>
                <span>${found.quantity}</span>
                <button onclick="changeCardQty('${item.name}', 1)">+</button>
            `;

            controls.style.display = "flex";
            controls.style.alignItems = "center";
            controls.style.gap = "12px";
            controls.style.marginTop = "10px";

            card.appendChild(controls);

            controls.querySelectorAll("button").forEach(function(btn) {

                btn.style.background = "#e50914";
                btn.style.color = "white";
                btn.style.border = "none";
                btn.style.padding = "8px 15px";
                btn.style.borderRadius = "5px";
                btn.style.cursor = "pointer";
                btn.style.fontSize = "18px";

            });

            controls.querySelector("span").style.fontWeight = "bold";

        }
        else {
            button.style.display = "";
        }

    });

}


// CARD PLUS MINUS
function changeCardQty(name, amount) {

    if (!checkLogin()) return;

    let item = cart.find(function(i) {
        return i.name === name;
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity === 0) {
        cart.splice(cart.indexOf(item), 1);
    }

    saveCartState();
    updateCards();
    displayCart();

}


// DISPLAY CART
function displayCart() {

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty!</p>";
        return;
    }

    let total = 0;
    let output = "";

    cart.forEach(function(item, index) {

        let subtotal = item.price * item.quantity;
        total += subtotal;

        output += `
            <div style="background:#242424; padding:20px;
            margin-bottom:15px; border-radius:10px; color:white;">

                <h4>${item.name}</h4>

                <p style="color:#999;">Price: ₹${item.price}</p>

                <div style="display:flex; align-items:center; gap:12px;">

                    <button onclick="changeCartQty(${index}, -1)"
                    style="background:#303030;color:white;border:0;
                    padding:8px 15px;border-radius:5px;">−</button>

                    <strong>${item.quantity}</strong>

                    <button onclick="changeCartQty(${index}, 1)"
                    style="background:#e50914;color:white;border:0;
                    padding:8px 15px;border-radius:5px;">+</button>

                    <button onclick="removeItem(${index})"
                    style="background:transparent;color:#ff5555;
                    border:1px solid #e50914;padding:8px 12px;
                    border-radius:5px;">REMOVE</button>

                </div>

                <p style="color:#999;">Subtotal: ₹${subtotal}</p>

            </div>
        `;
    });

    output += `
        <h3 style="text-align:right;color:#e50914;">
            Total Bill: ₹${total}
        </h3>
        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:16px; flex-wrap:wrap;">
            <button onclick="confirmFoodOrder()"
            style="background:#e50914;color:white;border:0;
            padding:10px 20px;border-radius:6px;font-weight:bold;cursor:pointer;">
                Confirm Food Order
            </button>
            <a href="booking.html"
            style="background:#303030;color:white;text-decoration:none;
            padding:10px 20px;border-radius:6px;font-weight:bold;display:inline-block;">
                Book Tickets With Food
            </a>
        </div>
    `;

    cartItems.innerHTML = output;

}


// CONFIRM FOOD ORDER
function confirmFoodOrder() {

    if (!checkLogin()) return;

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    saveCartState();

    const session = window.CineAuth.getSession();
    const total = cart.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);
    const itemsSummary = cart.map(function (item) {
        return item.name + " x" + item.quantity + " (₹" + (item.price * item.quantity) + ")";
    }).join("\n");

    alert(
        "Food Order Confirmed!\n\n" +
        "Customer: " + session.name + " (" + session.email + ")\n\n" +
        itemsSummary +
        "\n\nTotal Amount: ₹" + total
    );
}


// CART PLUS MINUS
function changeCartQty(index, amount) {

    if (!checkLogin()) return;

    cart[index].quantity += amount;

    if (cart[index].quantity === 0) {
        cart.splice(index, 1);
    }

    saveCartState();
    displayCart();
    updateCards();

}


// REMOVE ITEM
function removeItem(index) {

    if (!checkLogin()) return;

    cart.splice(index, 1);

    saveCartState();
    displayCart();
    updateCards();

}


// VIEW CART
viewCartBtn.addEventListener("click", function() {

    if (!checkLogin()) return;

    if (cartItems.style.display === "none") {

        cartItems.style.display = "block";
        viewCartBtn.innerText = "HIDE CART";

        displayCart();

    }
    else {

        cartItems.style.display = "none";
        viewCartBtn.innerText = "VIEW CART";

    }

});

loadCartState();
updateCards();

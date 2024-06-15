import { findProductById } from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage, RemoveLocalStorage, qs, renderListWithTemplate, getCartCount } from "./utils.mjs";

export default async function shoppingCart() {
  const cartItems = getLocalStorage("so-cart") ?? [];
  const element = qs(".product-list");

  if (cartItems.length > 0) {
    renderListWithTemplate(cartItemTemplate, element, cartItems);
    updateCartDisplay(cartItems); // Update the cart display
    addClickEvents(cartItems);
    document
      .getElementById("remove_all_items")
      .addEventListener("click", emptyCart);
  } else {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty!</p>";
    document.getElementById("remove_all_items").style.visibility = "hidden";
  }
}

export function cartItemTemplate(item) {
  const itemTotalPrice = (item.Quantity * item.FinalPrice).toFixed(2);
  const newItem = `<li class="cart-card divider">
  <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__quantity-control">
    <button class="quantity-increase" data-id="${item.Id}">+</button>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <button class="quantity-decrease" data-id="${item.Id}">-</button>  
  </div>
  <p class="cart-card__price">Unit Price: $${item.FinalPrice.toFixed(2)}</p>
  <p class="cart-card__total-price">Total Price: $${itemTotalPrice}</p>
  <span class="cart_remove" id="${item.Id}">X</span>
</li>`;

  return newItem;
}

export function calculateTotal(cart) {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.FinalPrice * cartItem.Quantity;
  });
  return total;
}

function addClickEvents(cart) {
  cart.forEach((cartItem) => {
    document
      .getElementById(cartItem.Id)
      .addEventListener("click", removeItem);
    document
      .querySelector(`.quantity-decrease[data-id="${cartItem.Id}"]`)
      .addEventListener("click", decreaseQuantity);
    document
      .querySelector(`.quantity-increase[data-id="${cartItem.Id}"]`)
      .addEventListener("click", increaseQuantity);
  });
}

function updateCartDisplay(cart) {
  const element = qs(".product-list");
  renderListWithTemplate(cartItemTemplate, element, cart); // Re-render the cart items
  addClickEvents(cart); // Re-attach event listeners after re-rendering
  const cartSubtotal = calculateTotal(cart).toFixed(2);
  document.querySelector(".cart-footer").classList.remove("hide");
  document.getElementById("cart-total").innerHTML = `Total: $${cartSubtotal}`;
}

async function removeItem(e) {
  let product = await findProductById(e.target.id);
  let cart = getLocalStorage("so-cart") ?? [];
  let itemIndex = cart.findIndex((item) => item.Id === product.Id);
  cart.splice(itemIndex, 1);
  setLocalStorage("so-cart", cart);
  shoppingCart();
  getCartCount();
}

async function emptyCart() {
  RemoveLocalStorage("so-cart");
  shoppingCart();
  getCartCount();
}

//increae quanity function
function increaseQuantity(e) {
  const productId = e.target.getAttribute("data-id");
  let cart = getLocalStorage("so-cart") ?? [];
  let itemIndex = cart.findIndex((item) => item.Id === productId);
  if (itemIndex !== -1) {
    cart[itemIndex].Quantity += 1;
    setLocalStorage("so-cart", cart);
    updateCartDisplay(cart); // Update the display
    getCartCount(); // Update the cart count
  }
}

//decreae quanity function
function decreaseQuantity(e) {
  const productId = e.target.getAttribute("data-id");
  let cart = getLocalStorage("so-cart") ?? [];
  let itemIndex = cart.findIndex((item) => item.Id === productId);
  if (itemIndex !== -1 && cart[itemIndex].Quantity > 1) {
    cart[itemIndex].Quantity -= 1;
    setLocalStorage("so-cart", cart);
    updateCartDisplay(cart); // Update the display
    getCartCount(); // Update the cart count
  } else if (itemIndex !== -1 && cart[itemIndex].Quantity === 1) {
    removeItem({target: {id: productId}}); // Remove item if quantity is 1
  }
}



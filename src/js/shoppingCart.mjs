import { getLocalStorage, loadHeaderFooter, qs, renderListWithTemplate } from "./utils.mjs";

export default async function shoppingCart() {
  const cartItems = getLocalStorage("so-cart");
  let cartSubtotal = 0;
  const element = qs(".product-list");

  if (cartItems) {
    renderListWithTemplate(cartItemTemplate, element, cartItems);
    cartSubtotal = calculateTotal(cartItems);
    const cartTotal = cartSubtotal;
    document.getElementById("cart-total").innerHTML = `Total: $${cartTotal}`;
  } else {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty!</p>";
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function calculateTotal(cart) {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.FinalPrice;
  });
  document.querySelector(".cart-footer").classList.remove("hide");
  return total;
}
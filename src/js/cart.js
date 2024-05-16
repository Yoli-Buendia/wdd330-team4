import { getLocalStorage, getcartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  let cartSubtotal = 0;
  // Check if cartItems is null or undefined
  if (cartItems) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    cartSubtotal = calculateTotal(cartItems);
    const cartTotal = cartSubtotal;
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    document.getElementById("cart-total").innerHTML = 'Total: $${cartTotal}';
    //Display # of items in the cart
 
  } else {
    // Display a message if cartItems is null of undefine
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty!</p>";
  }
}


function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
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

renderCartContents();
getcartCount();


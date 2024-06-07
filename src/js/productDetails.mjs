import { setLocalStorage, getLocalStorage, qs, getCartCount } from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";


export default async function productDetails(productId) {

  const product = await findProductById(productId);

  if (typeof product !== "undefined") {
    renderProductDetails(product);
  }
  else {
    renderEmptyPage();
  }
}

function addProductToCart(product) {
  // get cart array from storage or if null, set to an empty array
  let cart = getLocalStorage("so-cart") ?? [];
  let itemIndex = cart.findIndex((item) => item.Id === product.Id);
  // if item is in the cart, increment quantity, else set quantity to 1 and add to cart
  if (itemIndex >= 0) {
    cart[itemIndex].Quantity += 1;
  } else {
    product.Quantity = 1;
    cart.push(product);
  }
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
  animateCart();
  getCartCount();
}

function renderProductDetails(product) {

  document.getElementById("productName").innerText = product.Name;
  document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
  document.getElementById("productImage").setAttribute("src", product.Images.PrimaryLarge);
  document.getElementById("productImage").setAttribute("alt", product.NameWithoutBrand);
  qs("#productImageXL").setAttribute("media", "(min-width: 500px)"); 
  qs("#productImageXL").setAttribute("srcset", product.Images.PrimaryExtraLarge); 

  if (product.FinalPrice < product.SuggestedRetailPrice) {
    //Consider putting this in Utility
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", });

    const discountAmount = Math.round(product.SuggestedRetailPrice - product.FinalPrice)
    document.getElementById("productRetailPrice").innerText = `Retail Price: ${currency.format(product.SuggestedRetailPrice)}`;
    document.getElementById("productDiscountAmount").innerText = `Discount: ${currency.format(discountAmount)}`;
  }

  document.getElementById("productFinalPrice").innerText = `Sale Price: $${product.FinalPrice}`;
  document.getElementById("productColorName").innerText = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").setAttribute("data-id", product.Id);

  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
}


function renderEmptyPage(){
  document.getElementById("productName").innerText = "Product unavailable, please try again later.";
  document.getElementById("addToCart").style.display = "none";
}

function animateCart() {
  let cartIcon = qs(".cart > a > svg");
  cartIcon.classList.add("animate-cart");
  setTimeout(() => {
    cartIcon.classList.remove("animate-cart");
  }, 500);
}
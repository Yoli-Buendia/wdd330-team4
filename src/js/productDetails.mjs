import { setLocalStorage, getLocalStorage, qs } from "./utils.mjs";
import { findProductById } from "./productData.mjs";


export default async function productDetails(productId) {

    const product = await findProductById(productId);

    renderProductDetails(product);
}

function addProductToCart(product) {
    let cart = getLocalStorage("so-cart") ?? [];
    cart.push(product);
    setLocalStorage("so-cart", cart);
  }

  async function addToCartHandler(e) {
    const product = await findProductById(e.target.dataset.id);
    addProductToCart(product);
    animateCart();
  }

function renderProductDetails(product) {
    document.getElementById("productName").innerText = product.Name;
    document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
    document.getElementById("productImage").setAttribute("src", product.Image);
    document.getElementById("productImage").setAttribute("alt", product.NameWithoutBrand);

    if(product.FinalPrice < product.SuggestedRetailPrice){
      //Consider putting this in Utility
      const currency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',});
      
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

function animateCart() {
  let cartIcon = qs(".cart > a > svg");
  console.log(cartIcon);
  // Either open the backpack flap, 
  // wiggle back and forth
  // or stretch and compress

}
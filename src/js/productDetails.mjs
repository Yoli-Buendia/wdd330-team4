import { setLocalStorage, getLocalStorage } from "./utils.mjs";
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
  }

function renderProductDetails(product) {
    document.getElementById("productName").innerText = product.Name;
    document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
    document.getElementById("productImage").setAttribute("src", product.Image);
    document.getElementById("productImage").setAttribute("alt", product.NameWithoutBrand);
    document.getElementById("productFinalPrice").innerText = product.FinalPrice;
    document.getElementById("productColorName").innerText = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").setAttribute("data-id", product.Id);

    document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

}

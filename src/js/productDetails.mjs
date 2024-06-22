import { setLocalStorage, getLocalStorage, qs, getCartCount, renderListWithTemplate } from "./utils.mjs";
import { modalSetup, productCardTemplate } from "./productList.mjs";
import { findProductById, getProductsByCategory } from "./externalServices.mjs";


export default async function productDetails(productId) {

  const product = await findProductById(productId);

  if (typeof product !== "undefined") {
    renderProductDetails(product);
    let imageList = product.Images.ExtraImages;
    imageList.unshift({Src: product.Images.PrimaryExtraLarge, Title: "Main View"});
    renderImageCarousel(imageList);
    renderRecommendedProducts(product)
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

function renderImageCarousel(images) {
  let imagePreviewContainer = qs(".image-carousel");
  renderListWithTemplate(imageCarouselTemplate, imagePreviewContainer, images, "afterbegin", true, "");
  previewImage();
}

function imageCarouselTemplate(image, actionText) {
  return `<li class="image-thumb">
    <img class="image-thumb-item" src="${image.Src}" alt="${image.Title}" />
  </li>`
}

function previewImage() {
  let imageElements = document.querySelectorAll(".image-thumb img");
  imageElements.forEach((image) => {
  image.addEventListener("click", () => {
    displayImage(image.getAttribute("src"));
  })
 });
}

function displayImage(src) {
  console.log(src);
  qs("#productImageXL").setAttribute("srcset", src);
  qs("#productImage").setAttribute("src", src);
}

async function renderRecommendedProducts(product){
  const products = await getProductsByCategory(product.Category);
  const randomProducts = getRandomProducts(products, product);
  
  const header = document.getElementById("recProductsHeader")
  if (header){
    header.innerText = "Recommended Products";
    const recProductsContainer = qs(".recProductsContainer");
    renderListWithTemplate(productCardTemplate, recProductsContainer, randomProducts);
    modalSetup();
  }
}

function getRandomProducts(products, currentProduct){
  products = products.filter(number => number.Id !== currentProduct.Id);
  let randomProducts = products.sort(() => 0.5 - Math.random());
  return randomProducts.slice(0, 3);
}
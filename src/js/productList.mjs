import { getProductsByCategory } from "./externalServices.mjs";
import { qs, renderListWithTemplate, renderWithTemplate, loadTemplate } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

let items = {};
let priceReverse = false;
let nameReverse = false;
let productListElement;

export default async function productList(selector, category, customItems = null) {
    items = customItems ?? await getProductsByCategory(category);
    productListElement = qs(selector);
    document
        .getElementById("sort_by_price")
        .addEventListener("click", sortProductItemsByPrice);
    document
        .getElementById("sort_by_name")
        .addEventListener("click", sortProductItemsByName);
    renderListWithTemplate(productCardTemplate, productListElement, items);

    modalSetup();
}

function modalSetup() {
    let modal = qs(".modal-bg");
    let close = qs(".close");

    let quickViewBtns = document.querySelectorAll(".quick-view-btn");

    quickViewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        renderQuickView(btn.dataset.id);
        showModal();
      })
    });

    close.onclick = () => hideModal();
    // modal.onclick = () => hideModal();
    // window.onclick = () => hideModal();


    function showModal() {
      modal.style.display = "flex";
    }
    function hideModal() {
      modal.style.display = "none";
    }
}

function sortProductItemsByPrice() {
    items.sort((a, b) => +a.FinalPrice - +b.FinalPrice);
    const icon = qs("#sort_price_icon")
    if (priceReverse) {
        items.reverse();
        priceReverse = false;
        icon.textContent = "↓";
    }
    else{
        priceReverse = true;
        icon.textContent = "↑";
    }

    renderListWithTemplate(productCardTemplate, productListElement, items);
    modalSetup();

}

function sortProductItemsByName() {
    items.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    const icon = qs("#sort_name_icon")
    if (nameReverse) {
        items.reverse();
        nameReverse = false;
        icon.textContent = "↓";
    } else {
        nameReverse = true;
        icon.textContent = "↑";
    }
    renderListWithTemplate(productCardTemplate, productListElement, items)
    modalSetup();
}

function productCardTemplate(product) {

    //To display discount amount
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", });
    const discountAmount = Math.round(product.SuggestedRetailPrice - product.FinalPrice);

    return `<li class="product-card">
        <a href="../product_pages/?product=${product.Id}">
            <img
                src="${product.Images.PrimaryMedium}"
                alt="${product.NameWithoutBrand}"
            />
            <h3 class="card__brand">${product.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__retail_price">Retail Price: 
            ${currency.format(product.SuggestedRetailPrice)}
            </p>
            <p class="product-card__discount">Discount: 
            ${currency.format(discountAmount)}
            </p>
            <p class="product-card__price">Sale Price: 
            ${currency.format(product.FinalPrice)}
            </p>
            </a>
            <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
    </li>`
}

export function renderQuickView(productId) {
  const modalTemplate = loadTemplate("/partials/productDetail.html");
 
  const modal = qs(".product-detail");
  
   renderWithTemplate(modalTemplate, modal, productDetails, productId);
}
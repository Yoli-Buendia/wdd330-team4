import { getData } from "./productData.mjs";
import { qs, renderListWithTemplate, filterList } from "./utils.mjs";

let items = {};
let priceReverse = false;
let nameReverse = false;
let productListElement;

export default async function productList(selector, category) {
    items = await getData(category);
    productListElement = qs(selector);
    document
        .getElementById("sort_by_price")
        .addEventListener("click", sortProductItemsByPrice);
    document
        .getElementById("sort_by_name")
        .addEventListener("click", sortProductItemsByName);
    renderListWithTemplate(productCardTemplate, productListElement, items);
}

function sortProductItemsByPrice() {
    const element = qs(".product-list");
    items.sort((a, b) => { return +a.FinalPrice - +b.FinalPrice; });
    if (priceReverse) {
        items.reverse();
        priceReverse = false;
    }
    else{
        priceReverse = true;
    }
    renderListWithTemplate(productCardTemplate, productListElement, items);
}

function sortProductItemsByName(reverse=false) {
    const element = qs(".product-list");
    items.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    if (nameReverse) {
        items.reverse();
        nameReverse = false;
    } else {
        nameReverse = true;
    }
    renderListWithTemplate(productCardTemplate, productListElement, items);
}

function productCardTemplate(product) {

    //To display discount amount
    const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', });
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
    </li>`
}

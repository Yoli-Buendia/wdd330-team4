/* eslint-disable no-console */
import { getProductsByCategory } from "./externalServices.mjs";
import { qs, renderListWithTemplate, renderWithTemplate, loadTemplate } from "./utils.mjs";
import productDetails from "./productDetails.mjs";


let priceReverse = false;
let nameReverse = false;

let items = [];

export async function productList(selector, query = null, category) {
 
    const productListElement = qs(selector);
    const sortPriceButton = qs("#sort_by_price");
    const sortNameButton = qs("#sort_by_name");
    const sortPriceIcon = qs("#sort_price_icon");
    const sortNameIcon = qs("#sort_name_icon");
   
    try {
        // Check if a search query is provided
        if (query) {
            // Fetch and filter products based on the search query
            items = await getFilteredProducts(query);
        } else {
            // Fetch all products for the specified categories
            items = await getAllProducts(productListElement,category);
        }

        // Render the list of products
        renderProductList(productListElement, items);
    } catch (error) {
        console.error("Error fetching products:", error);
    }

    // Add event listeners for sorting buttons if they exist
    if (sortPriceButton && sortNameButton) {
        sortPriceButton.addEventListener("click", () => sortProductItemsByPrice(items, productListElement, sortPriceIcon));
        sortNameButton.addEventListener("click", () => sortProductItemsByName(items, productListElement, sortNameIcon));
    } else {
        console.warn("Sorting buttons not found.");
    }
    modalSetup();
}



async function getFilteredProducts(query) {
    let filteredProducts = [];
    let categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    // console.log("Search query:", query);

    // Iterate over the categories to fetch products for each category
    for (const category of categories) {
        const categoryProducts = await getProductsByCategory(category);
        // console.log(`Products in category "${category}":`, categoryProducts);

        // Filter products based on the search query
        const matchingProducts = categoryProducts.filter(product => {
            const Name = product.Name || "";
            const isMatch = Name.toLowerCase().includes(query.toLowerCase());
            // console.log(`Checking product: ${Name}, is match: ${isMatch}`);
            return isMatch;
        });

        // console.log(`Matching products in category "${category}":`, matchingProducts);

        // Add matching products to the filteredProducts array
        filteredProducts.push(...matchingProducts);
    }

    // console.log("Filtered products:", filteredProducts);
    return filteredProducts;
}

async function getAllProducts(productListElement, category) {
   const categoryProducts = await getProductsByCategory(category);
   return categoryProducts;
  
}

function renderProductList(element, products) {
    // Clear the existing content of the element
    element.innerHTML = "";
    // Render the list of products using the provided template function
    renderListWithTemplate(productCardTemplate, element, products);
}


function sortProductItemsByPrice(items, container) {
    items.sort((a, b) => +a.FinalPrice - +b.FinalPrice);
    const icon = qs("#sort_price_icon");
    qs("#sort_name_icon").textContent = "";
    if (priceReverse) {
        items.reverse();
        priceReverse = false;
        icon.textContent = "↓";
    }
    else{
        priceReverse = true;
        icon.textContent = "↑";
    }
    renderListWithTemplate(productCardTemplate, container, items);
    modalSetup();
}

function sortProductItemsByName(items, container) {
    items.sort((a, b) => a.Name.localeCompare(b.Name));
    const icon = qs("#sort_name_icon");
    qs("#sort_price_icon").textContent = "";
    if (nameReverse) {
        items.reverse();
        nameReverse = false;
        icon.textContent = "↓";
    } else {
        nameReverse = true;
        icon.textContent = "↑";
    }
    renderListWithTemplate(productCardTemplate, container, items);
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

    function showModal() {
      modal.style.display = "flex";
    }
    function hideModal() {
      modal.style.display = "none";
    }
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

 function renderQuickView(productId) {
  const modalTemplate = loadTemplate("/partials/productDetail.html");
 
  const modal = qs(".product-detail");
  
   renderWithTemplate(modalTemplate, modal, productDetails, productId);
}

import { getData } from "./productData.mjs";
import { qs, renderListWithTemplate, filterList } from "./utils.mjs";
export default async function productList(selector, category) {
    const items = await getData(category);
    const filter = ["880RR", "985RF", "985PR", "344YJ"]
    const newItems = filterList(items, filter);
    const element = qs(selector);
    renderListWithTemplate(productCardTemplate, element, newItems);
}
function productCardTemplate(product) {
    return `<li class="product-card">
        <a href="product_pages/index.html?product=${product.Id}">
            <img
                src="${product.Image}"
                alt="${product.NameWithoutBrand}"
            />
            <h3 class="card__brand">${product.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">${product.FinalPrice}</p></a
        >
    </li>`
}
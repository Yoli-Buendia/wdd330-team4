import { loadHeaderFooter, getParam, qs } from "./utils.mjs";
import productList from "./productList.mjs";

const category = getParam("category");
qs(".category-title").textContent =
  "Top Products: " + category.charAt(0).toUpperCase() + category.slice(1);
productList(".product-list", category);
loadHeaderFooter();

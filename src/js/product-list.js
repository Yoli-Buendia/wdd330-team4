import { loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const category = urlParams.get("category");

productList(".product-list", category);
loadHeaderFooter();

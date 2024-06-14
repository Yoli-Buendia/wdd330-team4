/* eslint-disable no-console */
import { loadHeaderFooter, getParam, qs } from "./utils.mjs";
import { productList } from "./productList.mjs";
import alert from "./alert.mjs";

loadHeaderFooter();

alert();

document.addEventListener("DOMContentLoaded", async function () {
  const category = getParam("category");
  const searchQuery = getParam("searchInput"); // Changed variable name to searchQuery

  // Set the category title if category is present
  if (category) {
    qs(".category-title").textContent =
      "Top Products: " + category.charAt(0).toUpperCase() + category.slice(1);
    try {
      // Load products for the specified category
      await productList(".product-list", null, category);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  } else if (searchQuery) {
    // If search query is present, perform a search across all categories
    try {
      await productList(".product-list", searchQuery);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  } else {
    // If no category or search query is specified, load all products
    await productList(".product-list");
  }

  // Add event listener to a parent element using event delegation
  document.addEventListener("submit", async function (event) {
    if (event.target && event.target.id === "search_form") {
      const searchInput = getParam("searchInput"); // Changed variable name to searchInput
      try {
        if (searchInput) {
          // Search for products based on the query
          await productList(".product-list", searchInput);
        } else {
          // If no query, display products based on all categories
          await productList(".product-list");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  });
});

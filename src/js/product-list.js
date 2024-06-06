import { loadHeaderFooter, getParam, qs } from "./utils.mjs";
import productList from "./productList.mjs";
import { renderQuickView } from "./productList.mjs";

loadHeaderFooter();
const category = getParam("category");
qs(".category-title").textContent =
  "Top Products: " + category.charAt(0).toUpperCase() + category.slice(1);
productList(".product-list", category)
  .then(() => {
    /* Modal stuff */
    // let modal = qs("#quick-view");
    // let close = qs(".close");
    // let addToCart = qs("#addToCart");

    // let quickViewBtns = document.querySelectorAll(".quick-view-btn");

    // quickViewBtns.forEach((btn) => {
    //   btn.addEventListener("click", () => {
    //     renderQuickView(btn.dataset.id);
    //     showModal();
    //   })
    // });

    // // addToCart.addEventListener("click", () => {
    // //   hideModal();
    // // })

    // close.onclick = () => hideModal();

    // // window.onclick = () => hideModal();


    // function showModal() {
    //   modal.style.display = "block";
    // }
    // function hideModal() {
    //   modal.style.display = "none";
    // }

    // renderQuickView("989CH");
  });




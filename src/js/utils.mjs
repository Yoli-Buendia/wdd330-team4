// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get('product');
  return product;
}

export function renderListWithTemplate(templateFn, 
  parentElement, 
  list, 
  position = "afterbegin", 
  clear = true) {
    const products = list.map(items => templateFn(items));
    if(clear){
      parentElement.innerHtml = "";
    }
    parentElement.insertAdjacentHTML(position, products.join(''));
}

export function filterList(list, filter){
  const newList = list.filter((listItem) => filter.includes(listItem.Id));
  return newList;
}

export function renderProductDetails(product) {
  document.getElementById("productName").innerText = product.Name;
  document.getElementById("productNameWithoutBrand").innerText = product.NameWithoutBrand;
  document.getElementById("productImage").setAttribute("src", product.Image);
  document.getElementById("productImage").setAttribute("alt", product.NameWithoutBrand);

  if(product.FinalPrice < product.SuggestedRetailPrice){
    //Consider putting this in Utility
    const currency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',});
    
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

export function currencyY(product){
  const currency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',});
  const discountAmount = Math.round(product.SuggestedRetailPrice - product.FinalPrice)

  return currency.format(discountAmount)
}
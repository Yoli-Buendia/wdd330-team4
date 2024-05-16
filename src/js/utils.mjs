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
export function getcartCount(){
  const cartItems = getLocalStorage("so-cart");
  const count = cartItems.length;
  //Display # of items in the cart
  return document.getElementById("cart_count").innerHTML = count;

}
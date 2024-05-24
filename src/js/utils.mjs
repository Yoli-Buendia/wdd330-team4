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
// clears all data from local storage for a specific key
export function RemoveLocalStorage(key) {
  return localStorage.removeItem(key);
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

export function getCartCount(){
  const cartItems = getLocalStorage("so-cart");
  let count = 0;
  if(cartItems){
    cartItems.forEach((item) => count += item.Quantity);
  }
  //Display # of items in the cart
  document.getElementById("cart_count").innerHTML = count;

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

export async function renderWithTemplate(templateFn, parentElement, callback, 
    data,
    position = "afterbegin",
    clear = true) {
    
    if (clear) {
      parentElement.innerHTML = "";
    } 
    const template =  await templateFn(data);
    parentElement.insertAdjacentHTML(position, template);

    if(callback){
      callback(data);
    }

}

export function filterList(list, filter){
  const newList = list.filter((listItem) => filter.includes(listItem.Id));
  return newList;
}

function loadTemplate (path){
  return async function (){
    const response = await fetch(path);
    if (response.ok){
      const html = await response.text();
      return html;
      }
        
   };
}

 export  function loadHeaderFooter(){
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
 
  const header = qs("#main-header");
  const footer = qs("#main-footer");
  
   renderWithTemplate(headerTemplateFn, header, getCartCount);
   renderWithTemplate(footerTemplateFn, footer);
   
 }



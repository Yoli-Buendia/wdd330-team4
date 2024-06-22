// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);
export const qsAll = (selector, parent = document) =>
  parent.querySelectorAll(selector);

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
  return urlParams.get(param);
}

export function getCartCount() {
  const cartItems = getLocalStorage("so-cart");
  let count = 0;
  if (cartItems) {
    cartItems.forEach((item) => (count += item.Quantity));
  }
  //Display # of items in the cart
  document.getElementById("cart_count").innerHTML = count;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true,
  actionText = "X"
) {
  const products = list.map((items) => templateFn(items, actionText));
  if (clear) {
    parentElement.textContent = "";
  }
  parentElement.insertAdjacentHTML(position, products.join(""));
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  callback,
  data,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.textContent = "";
  }
  const template = await templateFn(data);
  parentElement.insertAdjacentHTML(position, template);

  if (callback) {
    callback(data);
  }
}

export function filterList(list, filter) {
  const newList = list.filter((listItem) => filter.includes(listItem.Id));
  return newList;
}

export function loadTemplate(path) {
  return async function () {
    const response = await fetch(path);
    if (response.ok) {
      const html = await response.text();
      return html;
    }
  };
}

export function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");

  const header = qs("#main-header");
  const footer = qs("#main-footer");

  renderWithTemplate(headerTemplateFn, header, getCartCount);
  renderWithTemplate(footerTemplateFn, footer);
}

export function formatCurrency(price) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return currency.format(price);
}

export function alertMessage(messages, scroll = true, actionText = "&times;") {
  const parentElement = qs("header");
  renderListWithTemplate(
    alertMessageTemplate,
    parentElement,
    messages,
    "afterend",
    false,
    actionText
  );
  if (scroll) {
    window.scrollTo(0, 0);
  }

  let closeBtns = document.querySelectorAll(".message-close");

  closeBtns.forEach((close) => {
    close.addEventListener("click", () => {
      close.parentElement.remove();
    });
  });
}

function alertMessageTemplate(message, actionText) {
  return `<li class="error-message">${message}
          <span class="close message-close">${actionText}</span></li>`;
}

export function ordersTemplate(order) {
  return `<tr><td>${order.id}</td><td>${order.fname}</td><td>${order.lname}</td><td>${order.orderDate}</td></tr>`;
}

// takes the close button's selector, a callback function for the close action,
// and optionally, the number of parent elements up to apply the callback function
export function closeX(selector, callback, level = 1) {
  let closeBtns = document.querySelectorAll(selector);
  closeBtns.forEach((closeBtn) => {
    let parent = closeBtn;
    for (let i = 0; i < level; i++) {
      parent = parent.parentElement;
    }
    closeBtn.addEventListener("click", () => {
      callback(parent);
    });
  });
}

export function hideElement(element) {
  element.style.display = "none";
}

import { renderListWithTemplate, qs, closeX, hideElement } from "./utils.mjs";
import { getJson } from "./externalServices.mjs";

const primaryColor = document.querySelector(':root').style.getPropertyValue('--primary-color');

export default async function alert() {
  let alertMessages = await getJson("../json/alerts.json");
  const closeText = "&times;";
  const main = qs("main");
  main.insertAdjacentHTML(
    "beforebegin",
    `<section class="alert-list"></section>`
  );

  const parentElement = qs(".alert-list");
  renderListWithTemplate(
    alertTemplate,
    parentElement,
    alertMessages,
    "beforeend",
    false,
    closeText
  );

  closeX(".close-alert", hideElement);
}

function alertTemplate(alertObject = {message: "This is not a drill.", background: primaryColor, color: "black"}, actionText) {
  return `<p class="alert-list-item" 
          style="background-color: ${alertObject.background}; 
          color: ${alertObject.color};">
            ${alertObject.message}
          <span class="close close-alert">${actionText}</span></p>`;
}

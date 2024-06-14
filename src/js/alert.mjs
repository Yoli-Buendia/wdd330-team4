import { renderListWithTemplate, qs, closeX, hideElement } from "./utils.mjs"
import { getJson } from "./externalServices.mjs"

export default async function alert() {
  let alertMessages = await getJson("../json/alerts.json");
  const main = qs("main");
  main.insertAdjacentHTML("beforebegin", `<section class="alert-list"></section>`);
  
  const parentElement = qs(".alert-list");
  renderListWithTemplate(alertTemplate, parentElement, alertMessages, "beforeend", false);

  closeX(".close-alert", hideElement);
}

function alertTemplate(alertObject) {
  return `<p class="alert-list-item" style="background-color: ${alertObject.background}; color: ${alertObject.color};">${alertObject.message}<span class="close close-alert">&times;</span></p>`
}
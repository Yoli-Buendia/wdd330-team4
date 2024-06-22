import {
    getLocalStorage,
    renderListWithTemplate,
    ordersTemplate,
} from "./utils.mjs";
import { orders } from "./externalServices.mjs";

export async function displayOrders() {
    const token = getLocalStorage("so-token");
    const allOrders = await orders(token);
    const parent = document.querySelector("#orders-list");
    renderListWithTemplate(ordersTemplate, parent, allOrders);
}

import { loadHeaderFooter } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import { displayOrders } from "./currentOrder.mjs";

loadHeaderFooter();

checkLogin();

displayOrders();

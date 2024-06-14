import {
  loadHeaderFooter,
  setLocalStorage,
  getLocalStorage,
  alertMessage,
} from "./utils.mjs";

const visitedKey = "visited";

const visited = getLocalStorage(visitedKey) ?? 0;
if (visited < 1) {
  alertMessage(
    ["Enter to win a free backpack when you register!"],
    true,
    "Register"
  );
}
setLocalStorage(visitedKey, visited + 1);

loadHeaderFooter();

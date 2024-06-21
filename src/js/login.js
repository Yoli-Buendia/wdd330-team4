import { loadHeaderFooter, getParam, setClick } from "./utils.mjs";
import { login } from "./auth.mjs";

loadHeaderFooter();

const redirect = getParam("redirect");

document.forms["login"].addEventListener("submit", (event) => {
    event.preventDefault();
    
    submitLogin(event.target);
  });



 function submitLogin(form) {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    console.log({email,password});
    login({email,password}, redirect);
}


import { format } from "prettier";
import { loginRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage, RemoveLocalStorage } from "./utils.mjs";
import * as jwt_decode from "jwt-decode";

const tokenKey = "so-token";
export async function login(creds, redirect = "/") {
    try {
        const token = await loginRequest(creds);
        setLocalStorage(tokenKey, token);
        // because of the default arg provided above...if no redirect is provided send them Home.
        window.location = redirect;
    } catch (err) {
        alertMessage(err.message.message);
    }
}

export function checkLogin(){
   const token = getLocalStorage(tokenKey);
   const valid = isTokenValid(token);
 if (valid){
    return token
 }else {
    RemoveLocalStorage(tokenKey)
    const location = window.location;
    
    window.location = `/login/index.html?redirect=${location.pathname}`;

    }

}

function isTokenValid(token){
    if (token){
        const tokenobj = jwt_decode(token);
        const currentDate = new Date();
    
        return (tokenobj.exp * 1000 < (currentDate.getTime())) ? false : true;
    } else return false;
       
}
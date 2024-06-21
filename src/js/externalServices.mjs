/* eslint-disable no-undef */
/* eslint-disable no-console */
const baseURL = import.meta.env.VITE_SERVER_URL

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

// Function to fetch products for a specific category
export async function getProductsByCategory(category) {
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function findProductById(id) {
  const products = await fetch(baseURL + `product/${id}`);
  const data = await convertToJson(products);
  return data.Result;
}

export async function checkout(payload) {
  const url = baseURL + `checkout`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }

  const response = await fetch(url, options);
  const data = await convertToJson(response);
  console.log("Data: " + response);
  return data;
}

export async function getJson(url) {
  const data = await fetch(url)
    .then(convertToJson);
  // .then((data) => console.log("JSON " + JSON.stringify(data)))
  // .then((data) => JSON.parse(data));

  return data;
}

export async function loginRequest(creds) {
  const url = baseURL + "login";
  const user = JSON.stringify(creds);
  const data = await fetch(url, {
    method: "POST", headers: {
      "Content-Type": "application/json",
    }, body: user
  })
    //const data = await fetch(url, {method: "POST",body: JSON.stringify({ "email": "user1@email.com" , "password": "user1" })})
    .then(convertToJson);

  return data.accessToken;
}




export async function orders(token) {
  const url = baseURL + `orders`;
  const options = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },

  }

  const response = await fetch(url, options);
  const data = await convertToJson(response);
  console.log("Data: " + response);
  return data;
}


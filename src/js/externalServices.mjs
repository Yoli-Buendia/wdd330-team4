const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export async function getProductsByCategory(category) {
  const response = await fetch(baseURL + `/products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

export async function findProductById(id) {
  const products = await fetch(baseURL + `/product/${id}`);
  const data = await convertToJson(products);
  return data.Result;
}

export async function checkout(payload) {
  const url = baseURL + `checkout`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }

  const response = await fetch(url, options);
  const data = await convertToJson(response);
  console.log("Data: " + response);
  return data;
}
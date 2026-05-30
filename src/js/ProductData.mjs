// base URL of the API, pulled from the VITE_SERVER_URL env variable
const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  // the category is no longer stored here; it's passed in when needed so the
  // same data source can fetch any category from the API
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    // the API wraps the list of products in a Result property
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    // a single product is likewise wrapped in Result
    return data.Result;
  }
}

// base URL of the API, pulled from the VITE_SERVER_URL env variable
const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  // parse the body first so we can hand the server's error detail to the caller.
  // on a 400 the server puts the specifics in the body, which the old version
  // (returning a generic "Bad Response") was throwing away.
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    // Error() only takes a string, so throw a custom object instead and stash the
    // parsed body on message for the checkout handler to display.
    throw { name: 'servicesError', message: jsonResponse };
  }
}

// renamed from ProductData: this module now talks to the server for more than
// just products (it also submits orders), so the broader name fits better
export default class ExternalServices {
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

  // the API only searches by category, not by keyword, so to search by name we
  // pull every category and filter the combined list client-side.
  async searchProducts(query) {
    const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
    const lists = await Promise.all(categories.map((c) => this.getData(c)));
    const term = query.trim().toLowerCase();
    return lists.flat().filter((p) => p.Name.toLowerCase().includes(term));
  }

  // POST a completed order to the server. Unlike the GETs above, this needs an
  // options object so fetch sends JSON with the right method and header.
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
}

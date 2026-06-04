import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const services = new ExternalServices();

// take the rich product objects stored in the cart and reduce them to the
// minimal shape the server expects for each order line item
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

// turn a form element into a plain object keyed by each input's `name`
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  // subtotal of the items in the cart, plus how many there are
  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);

    document.querySelector(`${this.outputSelector} #num-items`).textContent =
      this.list.length;
    document.querySelector(`${this.outputSelector} #subtotal`).textContent =
      this.itemTotal.toFixed(2);
  }

  // tax + shipping depend on the subtotal/quantity; called once a zip is entered
  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    // $10 for the first item, $2 for each additional item
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).textContent =
      this.tax.toFixed(2);
    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      this.shipping.toFixed(2);
    document.querySelector(`${this.outputSelector} #orderTotal`).textContent =
      this.orderTotal.toFixed(2);
  }

  async checkout(form) {
    // start from the form fields, then layer on the calculated/derived values
    const order = formDataToJSON(form);
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    return await services.checkout(order);
  }
}

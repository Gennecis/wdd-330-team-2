import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const myCheckout = new CheckoutProcess('so-cart', '.order-summary');
myCheckout.init();

// tax + shipping depend on destination, so wait until a zip is entered to
// calculate the order total (blur fires once the user leaves the field)
document
  .querySelector('#zip')
  .addEventListener('blur', () => myCheckout.calculateOrderTotal());

document.forms['checkout'].addEventListener('submit', (event) => {
  // stop the browser's default GET-and-reload so we can POST via fetch instead
  event.preventDefault();
  const form = event.target;
  // checkout() now owns the outcome: redirect to success, or show an alert on
  // failure. only run it once the form passes the browser's validation rules.
  if (form.checkValidity()) {
    myCheckout.checkout(form);
  } else {
    // surfaces the native "please fill out this field" messages
    form.reportValidity();
  }
});

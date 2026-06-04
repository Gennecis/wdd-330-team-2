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

document.forms['checkout'].addEventListener('submit', async (event) => {
  // stop the browser's default GET-and-reload so we can POST via fetch instead
  event.preventDefault();
  const form = event.target;
  if (form.checkValidity()) {
    const response = await myCheckout.checkout(form);
    // handling success vs. failure responses is next week's task; for now the
    // deliverable is just to confirm the server responds
    // eslint-disable-next-line no-console
    console.log(response);
  } else {
    // surfaces the native "please fill out this field" messages
    form.reportValidity();
  }
});

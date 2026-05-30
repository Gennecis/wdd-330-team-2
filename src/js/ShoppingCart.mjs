import { getLocalStorage, renderListWithTemplate } from './utils.mjs';

// returns the markup for a single cart line item
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  init() {
    // read the cart out of localStorage; default to [] so an empty cart just
    // renders nothing instead of throwing on a null .map
    const list = getLocalStorage(this.key) || [];
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(cartItemTemplate, this.listElement, list, 'afterbegin', true);
  }
}

import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
} from './utils.mjs';

// returns the markup for a single cart line item
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}" title="Remove from cart">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
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
    this.renderList();
    // one delegated listener on the <ul>, which survives re-renders, so we don't
    // have to re-bind a handler to every X each time the list is rebuilt
    this.listElement.addEventListener('click', this.handleRemove.bind(this));
  }

  renderList() {
    // read the cart out of localStorage; default to [] so an empty cart just
    // renders nothing instead of throwing on a null .map
    const list = getLocalStorage(this.key) || [];
    renderListWithTemplate(cartItemTemplate, this.listElement, list, 'afterbegin', true);
  }

  handleRemove(event) {
    const button = event.target.closest('.cart-card__remove');
    if (button) {
      this.removeItem(button.dataset.id);
    }
  }

  removeItem(id) {
    const cart = getLocalStorage(this.key) || [];
    const index = cart.findIndex((item) => item.Id === id);
    if (index !== -1) {
      // splice a single entry so duplicates of the same product drop one at a time
      cart.splice(index, 1);
      setLocalStorage(this.key, cart);
      this.renderList();
    }
  }
}

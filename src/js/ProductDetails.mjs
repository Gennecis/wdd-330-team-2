import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // findProductById returns a promise, so await the details before rendering
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once rendered, listen for clicks on the Add to Cart button.
    // .bind(this) keeps `this` pointing at the instance inside the callback
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage('so-cart') || [];
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
  }

  renderProductDetails() {
    const product = this.product;

    document.querySelector('#productBrand').textContent = product.Brand.Name;
    document.querySelector('#productName').textContent = product.NameWithoutBrand;

    const image = document.querySelector('#productImage');
    image.src = product.Image;
    image.alt = product.NameWithoutBrand;

    document.querySelector('#productPrice').textContent = `$${product.FinalPrice}`;
    document.querySelector('#productColor').textContent =
      product.Colors[0].ColorName;
    // the description field already contains HTML, so set innerHTML
    document.querySelector('#productDescription').innerHTML =
      product.DescriptionHtmlSimple;

    document.querySelector('#addToCart').dataset.id = product.Id;
  }
}

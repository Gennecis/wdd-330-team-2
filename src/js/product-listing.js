import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

// turn a category slug like "sleeping-bags" into a display title "Sleeping Bags"
function categoryTitle(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const category = getParam('category');
// first create an instance of the ExternalServices class
const dataSource = new ExternalServices();
// then get the element you want the product list to render in
const listElement = document.querySelector('.product-list');
// then create an instance of the ProductList class and send it the right info
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

// show which category is being viewed, e.g. "Top Products: Backpacks"
document.querySelector('#page-title').textContent =
  `Top Products: ${categoryTitle(category)}`;

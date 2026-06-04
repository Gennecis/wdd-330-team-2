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
// the navbar search form sends users here with ?search=<term>
const search = getParam('search');
const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const titleElement = document.querySelector('#page-title');
const myList = new ProductList(category, dataSource, listElement);

if (search !== null) {
  // search mode: pull every match from the API and render them via the same
  // product-card template the category view uses
  dataSource.searchProducts(search).then((results) => {
    myList.renderList(results);
    titleElement.textContent = results.length
      ? `Search results for "${search}" (${results.length})`
      : `No products found for "${search}"`;
  });
} else {
  // category mode: show the products for the chosen category
  myList.init();
  titleElement.textContent = `Top Products: ${categoryTitle(category)}`;
}

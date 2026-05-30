// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// read a named value from the current URL's query string (the part after ?)
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
// render a list by running each item through a template function and inserting
// the resulting HTML into parentElement. position/clear let callers reuse it.
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// render ONE template string into parentElement, then run callback(data) if one
// was passed (handy later for header extras like a cart-count badge).
// innerHTML is used here because it replaces whatever placeholder was inside the
// element; insertAdjacentHTML('afterbegin', ...) would instead append and could
// stack duplicates on a re-render, and createContextualFragment is more verbose
// for a single static blob with no scripts to worry about.
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch an HTML partial by path and return its markup as a string
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// load the header and footer partials and render them into their placeholders.
// absolute paths so the one copy resolves from any page depth (/, /cart/, etc.).
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');
  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

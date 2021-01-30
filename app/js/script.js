const btnHamburger = document.getElementById('btnHamburger');
const headerMenu = document.querySelector('.header__menu');
const inputElem = document.querySelector('.shorten__input > input');
const btnShorten = document.getElementById('btnShorten');
const formShorten = document.getElementById('formShorten');
const shortLinksElem = document.getElementById('shortLinks');
const errorMsg = document.getElementById('errorMsg');
const copyBtns = document.querySelectorAll('.copy-button');
const API = 'https://api.shrtco.de/v2/shorten?url=';

let shortLinks = [];

window.addEventListener('DOMContentLoaded', setupItems);

btnHamburger.addEventListener('click', () => {
  headerMenu.classList.toggle('show-links');
  document.body.classList.toggle('no-scroll');
});

formShorten.addEventListener('submit', (e) => {
  e.preventDefault();
  toggleErrorMsg(false);

  btnShorten.disabled = true;
  btnShorten.classList.add('loading');

  const value = inputElem.value;
  fetchShortLink(value);
});

// btnShorten.addEventListener('click', (e) => {
//   e.preventDefault();
// });

const fetchShortLink = async (url) => {
  const resp = await fetch(API + url);
  const respData = await resp.json();

  if (respData.ok) {
    addLink(respData.result);
    saveToLS(respData.result);
    toggleErrorMsg(false);
  } else {
    toggleErrorMsg(true);
  }

  btnShorten.disabled = false;
  btnShorten.classList.remove('loading');
};

const toggleErrorMsg = (isShow) => {
  if (isShow) {
    if (!errorMsg.classList.contains('show-message'))
      errorMsg.classList.add('show-message');
  } else {
    if (errorMsg.classList.contains('show-message'))
      errorMsg.classList.remove('show-message');
  }
};

const addLink = ({ original_link, full_short_link }) => {
  const liElem = document.createElement('li');
  liElem.classList.add('shorten__link');

  liElem.innerHTML = `
  <div class="original-link">${original_link}</div>
  <div class="new-link">
    <span class="short-link"> ${full_short_link} </span>
    <button class="shorten-button copy-button">Copy</button>
  </div>`;

  const copyBtn = liElem.querySelector('.copy-button');

  copyBtn.addEventListener('click', (e) => {
    shortLinksElem.querySelectorAll('.copy-button').forEach((btn) => {
      btn.style.backgroundColor = 'hsl(180, 66%, 49%)';
      btn.textContent = 'Copy';
    });

    copyBtn.style.backgroundColor = 'hsl(258, 27%, 26%)';
    copyBtn.textContent = 'Copied!';

    navigator.clipboard.writeText(full_short_link);
  });

  shortLinksElem.insertBefore(liElem, shortLinksElem.firstChild);
};

const saveToLS = ({ original_link, full_short_link }) => {
  const newLinks = { original_link, full_short_link };
  console.log(newLinks);
  let links = getFromLS();
  links = [...links, newLinks];
  console.log(links);

  if (links.length > 3) {
    links = links.slice(1);
    shortLinksElem.lastElementChild.remove();
  }

  localStorage.setItem('links', JSON.stringify(links));
};

const getFromLS = () => {
  return localStorage.getItem('links')
    ? JSON.parse(localStorage.getItem('links'))
    : [];
};

function setupItems() {
  const links = getFromLS();
  if (links.length > 0) {
    links.forEach((link) => {
      addLink(link);
    });
  }
}

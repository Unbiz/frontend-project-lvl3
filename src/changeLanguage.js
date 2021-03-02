// import pageElements from './pageElements.js';

const exampleUrl = 'https://ru.hexlet.io/lessons.rss';

export default (i18next, pageElements) => {
  const {
    title, description, input, addButton, example,
  } = pageElements;

  title.textContent = i18next.t('html.title');
  description.textContent = i18next.t('html.description');
  input.placeholder = i18next.t('html.placeholder');
  addButton.textContent = i18next.t('html.button');
  example.textContent = `${i18next.t('html.example')}: ${exampleUrl}`;
};

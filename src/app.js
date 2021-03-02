import i18n from 'i18next';

// import pageElements from './pageElements.js';
// import changeLanguage from './changeLanguage.js';
import validateUrl from './validate.js';
import { getNewFeedAndPosts, getUpdatedPosts } from './builder.js';
import resources from './locales';
import getWatcher from './watchers';
import loader from './loader.js';

export default () => {
  const rssState = {
    lng: 'ru',
    status: 'ready',
    form: {
      validStatus: true,
      message: '',
    },
    feeds: [],
    posts: [],
  };

  const i18next = i18n.createInstance();
  i18next.init({
    lng: rssState.lng,
    resources,
  });

  const pageElements = {
    title: document.querySelector('h1'),
    description: document.querySelector('h1 + p'),
    form: document.querySelector('form[data-type="form"]'),
    input: document.querySelector('input[data-type="input"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    addButton: document.querySelector('button[data-type="button"]'),
    example: document.querySelector('p[data-type="example"]'),
  };

  const exampleUrl = 'https://ru.hexlet.io/lessons.rss';

  pageElements.title.textContent = i18next.t('html.title');
  pageElements.description.textContent = i18next.t('html.description');
  pageElements.input.placeholder = i18next.t('html.placeholder');
  pageElements.addButton.textContent = i18next.t('html.button');
  pageElements.example.textContent = `${i18next.t('html.example')}: ${exampleUrl}`;

  const updateInterval = 5000;

  const watcher = getWatcher(rssState, pageElements, i18next);

  const getParsedData = (data) => {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'text/xml');
  };

  const updatePosts = (state) => {
    const { feeds, posts } = state;

    if (state.feeds.length === 0) {
      return setTimeout(updatePosts, updateInterval, state);
    }

    const promises = feeds.map((feed) => {
      const { url, id } = feed;
      return loader(url)
        .then((response) => getParsedData(response.data.contents))
        .then((parsedData) => getUpdatedPosts(parsedData, posts, id))
        .then((newPosts) => {
          console.log('!!!%%%!!!!', url);
          watcher.posts.push(...newPosts);
        });
    });

    return Promise.all(promises)
      .then(() => setTimeout(updatePosts, updateInterval, state));
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValueUrl = formData.get('url');
    const addedFeedsUrl = rssState.feeds.map((feed) => feed.url);

    const validateResult = validateUrl(inputValueUrl, addedFeedsUrl, i18next);
    if (validateResult !== null) {
      // const errorMessage = error.errors[0];
      watcher.form.message = validateResult;
      watcher.form.validStatus = false;
      return;
    }

    watcher.form.validStatus = true;
    watcher.form.message = i18next.t('messages.loading');
    watcher.status = 'waiting';

    loader(inputValueUrl)
      .then((response) => getParsedData(response.data.contents))
      .then((parsedData) => getNewFeedAndPosts(parsedData, inputValueUrl))
      .then(({ newFeed, newPosts }) => {
        console.log('!!!!!!!!!!', inputValueUrl);
        watcher.form.message = i18next.t('messages.loadedSuccess');
        watcher.feeds.push(newFeed);
        watcher.posts.push(...newPosts);
        watcher.status = 'ready';
      })
      .catch(() => {
        watcher.form.message = i18next.t('errors.network');
        watcher.status = 'ready';
      });
  };

  // changeLanguage(i18next, pageElements);

  updatePosts(rssState, watcher);

  pageElements.form.addEventListener('submit', onSubmitForm);
};

import i18n from 'i18next';

import pageElements from './pageElements.js';
import changeLanguage from './changeLanguage.js';
import validateUrl from './validate.js';
import { getNewFeedAndPosts, getUpdatedPosts } from './builder.js';
import resources from './locales';
import getWatcher from './watchers';
import loader from './loader.js';

const updateInterval = 5000;

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

  validateUrl(inputValueUrl, addedFeedsUrl, i18next)
    .then(() => {
      watcher.form.validStatus = true;
      watcher.form.message = i18next.t('messages.loading');
      watcher.status = 'waiting';
    })
    .then(() => {
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
    })
    .catch((error) => {
      const errorMessage = error.errors[0];
      watcher.form.message = errorMessage;
      watcher.form.validStatus = false;
    });
};

export default () => {
  changeLanguage(i18next, pageElements);

  updatePosts(rssState, watcher);

  pageElements.form.addEventListener('submit', onSubmitForm);
};

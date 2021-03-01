import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import i18n from 'i18next';

import resources from './locales';
import getWatcher from './watchers.js';

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

  const updateInterval = 5000;

  const i18next = i18n.createInstance();
  i18next.init({
    lng: rssState.lng,
    resources,
  });

  const changeLanguageTemplateHTML = () => {
    const title = document.querySelector('h1');
    const description = document.querySelector('h1 + p');
    const input = document.querySelector('input');
    const button = document.querySelector('button[data-type="button"]');
    const example = document.querySelector('form + p');

    title.textContent = i18next.t('html.title');
    description.textContent = i18next.t('html.description');
    input.placeholder = i18next.t('html.placeholder');
    button.textContent = i18next.t('html.button');
    example.textContent = `${i18next.t('html.button')}: https://ru.hexlet.io/lessons.rss`;
  };

  changeLanguageTemplateHTML();

  const pageElements = {
    form: document.querySelector('form[data-type="form"]'),
    input: document.querySelector('input[data-type="input"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    addButton: document.querySelector('button[data-type="button"]'),
  };

  const geIdCounter = () => {
    let idNumber = 0;
    return () => {
      idNumber += 1;
      return idNumber;
    };
  };

  const getUnuqFeedId = geIdCounter();
  const getUnuqPostId = geIdCounter();

  const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com/get?url=';
  const buildUrlWithProxy = (url) => `${PROXY_URL}${url}`;

  const validateUrl = (url, feeds) => {
    // yup.setLocale({
    //   string: {
    //     default: i18next.t('errors.urlInvalid'),
    //     url: i18next.t('errors.urlInvalid'),
    //   },
    //   notOneOf: {
    //     default: i18next.t('errors.urlAlreadyExists'),
    //   },
    // });

    const schema = yup
      .string(i18next.t('errors.urlInvalid'))
      .url(i18next.t('errors.urlInvalid'))
      .notOneOf(feeds, i18next.t('errors.urlAlreadyExists'));
    return schema.validate(url);
  };

  const watcher = getWatcher(rssState, pageElements, i18next);

  const getParsedFeed = (data) => {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'text/xml');
  };

  const loadRssFeed = (inputValueUrl) => {
    const url = buildUrlWithProxy(inputValueUrl);
    watcher.status = 'waiting';
    axios.get(url, {
      params: {
        disableCache: true,
      },
    })
      .then((response) => {
        const parsedFeed = getParsedFeed(response.data.contents);
        const feedId = getUnuqFeedId();
        const feedTitle = parsedFeed.querySelector('channel title').textContent;
        const feedDescription = parsedFeed.querySelector('channel description').textContent;
        const feedPostsElements = parsedFeed.querySelectorAll('item');
        const feed = {
          title: feedTitle, description: feedDescription, id: feedId, url: inputValueUrl,
        };
        const posts = [...feedPostsElements].map((post) => {
          const postId = getUnuqPostId();
          const title = post.querySelector('title').textContent;
          const link = post.querySelector('link').textContent;
          const description = post.querySelector('description').textContent;
          return {
            title, link, description, feedId, id: postId, readed: false,
          };
        });
        watcher.form.message = i18next.t('messages.loadedSuccess');
        watcher.feeds.unshift(feed);
        watcher.posts.unshift(...posts);
        watcher.status = 'ready';
      })
      .catch(() => {
        watcher.form.message = i18next.t('errors.network');
        watcher.status = 'ready';
      });
  };

  const updatePosts = (state) => {
    const { feeds, posts } = state;

    if (rssState.feeds.length === 0) {
      return setTimeout(updatePosts, updateInterval, state);
    }

    const promises = feeds.map((feed) => {
      const oldPosts = posts.filter((post) => post.feedId === feed.id);
      const url = buildUrlWithProxy(feed.url);
      return axios.get(url, {
        params: {
          disableCache: true,
        },
      })
        .then((response) => {
          const parsedFeed = getParsedFeed(response.data.contents);
          const feedPostsElements = parsedFeed.querySelectorAll('item');
          const currentPosts = [...feedPostsElements].map((post) => {
            const title = post.querySelector('title').textContent;
            const link = post.querySelector('link').textContent;
            const description = post.querySelector('description').textContent;
            return {
              title, link, description, feedId: feed.id, readed: false,
            };
          });
          const oldPostsWithoutId = oldPosts.map((post) => {
            const cloneOldPosts = _.cloneDeep(post);
            delete cloneOldPosts.id;
            return cloneOldPosts;
          });
          const newPosts = _.differenceWith(currentPosts, oldPostsWithoutId, _.isEqual);
          const newPostsWithId = newPosts.map((post) => ({ ...post, id: getUnuqPostId() }));
          watcher.posts.push(...newPostsWithId);
        })
        .catch(() => {
          console.log('error timeout');
        });
    });
    return Promise.all(promises)
      .then(() => {
        setTimeout(updatePosts, updateInterval, state);
      });
  };

  pageElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValueUrl = formData.get('url').trim();
    const addedFeedsUrl = rssState.feeds.map((feed) => feed.url);
    validateUrl(inputValueUrl, addedFeedsUrl)
      .then(() => {
        watcher.form.validStatus = true;
        watcher.form.message = '';
        watcher.form.message = i18next.t('messages.loading');
        loadRssFeed(inputValueUrl);
      })
      .catch((error) => {
        watcher.form.validStatus = false;
        watcher.form.message = error.errors;
      });
  });

  updatePosts(rssState);
};

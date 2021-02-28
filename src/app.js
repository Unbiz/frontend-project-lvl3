import * as yup from 'yup';
import axios from 'axios';
import getWatcher from './watchers.js';

export default () => {
  const rssState = {
    form: {
      inputValue: '',
      validStatus: true,
      errorMessage: '',
    },
    feeds: [],
    posts: [],
  };

  const pageElements = {
    form: document.querySelector('form[data-type="form"]'),
    input: document.querySelector('input[data-type="input"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const geIdCounter = () => {
    let idNumber = 0;
    return () => {
      idNumber += 1;
      return idNumber;
    };
  };

  const getUnuqFeedid = geIdCounter();
  const getUnuqPostid = geIdCounter();

  const errorMessages = {
    invalidUrl: 'Url is not valid. Please enter a valid URL adress.',
    doubleFeed: 'This feed is olready added.',
    errorNetwork: 'Network is offline.',
    downloading: 'Downloading...',
    downloadOk: 'RSS успешно загружен',
  };

  const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com/get?url=';
  const buildUrlWithProxy = (url) => `${PROXY_URL}${url}`;

  const validateUrl = (url, feeds) => {
    const schema = yup
      .string()
      .url(errorMessages.invalidUrl)
      .notOneOf(feeds, errorMessages.doubleFeed);
    return schema.validate(url);
  };

  const watcher = getWatcher(rssState, pageElements);

  const getParsedFeed = (data) => {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'text/xml');
  };

  const loadRssFeed = (inputValueUrl) => {
    const url = buildUrlWithProxy(inputValueUrl);
    axios.get(url)
      .then((response) => {
        const parsedFeed = getParsedFeed(response.data.contents);
        const feedId = getUnuqFeedid();
        const feedTitle = parsedFeed.querySelector('channel title').textContent;
        const feedDescription = parsedFeed.querySelector('channel description').textContent;
        const feedPostsElements = parsedFeed.querySelectorAll('item');
        const feed = {
          title: feedTitle, description: feedDescription, id: feedId, url: inputValueUrl,
        };
        const posts = [...feedPostsElements].map((post) => {
          const postId = getUnuqPostid();
          const title = post.querySelector('title').textContent;
          const link = post.querySelector('link').textContent;
          const description = post.querySelector('description').textContent;
          return {
            title, link, description, id: postId,
          };
        });
        feed.postsId = [...posts].map((post) => post.id);
        watcher.form.errorMessage = errorMessages.downloadOk;
        watcher.feeds.unshift(feed);
        watcher.posts.push(...posts);
        console.log(rssState);
      })
      .catch((err) => {
        console.log('!$!$!$!', err);
        watcher.form.errorMessage = errorMessages.errorNetwork;
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
        watcher.form.errorMessage = '';
        watcher.form.inputValue = inputValueUrl;
        watcher.form.errorMessage = errorMessages.downloading;
        loadRssFeed(inputValueUrl);
      })
      .catch((error) => {
        watcher.form.validStatus = false;
        watcher.form.errorMessage = error.errors;
        watcher.form.inputValue = inputValueUrl;
      });
  });
};

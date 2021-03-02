import onChange from 'on-change';

import renderChangeValidStatus from './validStatus.js';
import renderChangeMessage from './message.js';
import renderChangeFeeds from './feeds.js';
import renderChangePosts from './posts.js';
import renderChangeStatus from './status.js';

export default (state, pageElements, i18next) => {
  const watcher = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'form.validStatus':
        renderChangeValidStatus(value, pageElements);
        break;
      case 'form.message':
        renderChangeMessage(value, pageElements);
        break;
      case 'feeds':
        renderChangeFeeds(value, pageElements, i18next);
        break;
      case 'posts':
        renderChangePosts(value, prevValue, pageElements, i18next);
        break;
      case 'status':
        renderChangeStatus(value, pageElements);
        break;
      default:
        break;
    }
  });
  return watcher;
};

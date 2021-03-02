import axios from 'axios';
import { getUrlWithProxy } from './utils.js';

export default (url, getWatcher, i18next) => {
  const watcher = getWatcher;
  const urlWithProxy = getUrlWithProxy(url);
  return axios.get(urlWithProxy, { params: { disableCache: true } })
    .catch(() => {
      watcher.form.message = i18next.t('errors.network');
      watcher.status = 'ready';
    });
};

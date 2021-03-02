import axios from 'axios';
import { getUrlWithProxy } from './utils.js';

export default (url) => {
  const urlWithProxy = getUrlWithProxy(url);
  return axios.get(urlWithProxy, { params: { disableCache: true } });
};

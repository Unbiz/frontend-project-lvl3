export default (url) => {
  const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com/get?url=';
  return `${PROXY_URL}${url}`;
};

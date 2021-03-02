const getIdCounter = () => {
  let idNumber = 0;
  return () => {
    idNumber += 1;
    return idNumber;
  };
};

const getUrlWithProxy = (url) => {
  const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com/get?url=';
  return `${PROXY_URL}${url}`;
};

export { getIdCounter, getUrlWithProxy };

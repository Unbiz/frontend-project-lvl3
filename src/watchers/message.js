export default (value, pageElements) => {
  const { feedback } = pageElements;
  console.log('$$$MESS$$$', value);
  feedback.textContent = value;
};

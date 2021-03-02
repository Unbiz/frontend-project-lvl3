export default (value, pageElements) => {
  const { feedback } = pageElements;
  feedback.textContent = value;
};

export default (value, pageElements) => {
  const { addButton } = pageElements;
  if (value === 'waiting') addButton.disabled = true;
  if (value === 'ready') addButton.removeAttribute('disabled');
};

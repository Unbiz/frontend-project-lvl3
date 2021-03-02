export default (value, pageElements) => {
  const { addButton, input } = pageElements;
  console.log(input)
  if (value === 'waiting') {
    addButton.disabled = true;
    input.readOnly = true;
  }
  if (value === 'ready') {
    addButton.disabled = false;
    input.readOnly = false;
  }
};

export default (value, pageElements) => {
  const { input } = pageElements;
  if (value) {
    input.classList.remove('border', 'border-danger');
  } else {
    input.classList.add('border', 'border-danger');
  }
};

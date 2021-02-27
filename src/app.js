export default () => {
  const state = {
    status: '',
  };

  const form = document.querySelector('form[data-type="form"]');
  const input = form.querySelector('input[data-type="form"]');
  const button = form.querySelector('input[data-type="button"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.get('url'));
  });
};

export default (value, pageElements, i18next) => {
  const { feeds, form } = pageElements;

  if (!feeds.firstChild) {
    feeds.innerHTML = (
      `<h2>${i18next.t('feeds')}</h2>
      <ul class="list-group mb-5">
      </ul>`
    );
  }

  const feedItem = value[value.length - 1];
  const feedsList = feeds.querySelector('ul');
  const feedItemNode = document.createElement('li');
  feedItemNode.classList.add('list-group-item');
  feedItemNode.innerHTML = (
    `<h3>${feedItem.title}</h3>
        <p>${feedItem.description}</p>`
  );
  feedsList.append(feedItemNode);
  form.reset();
};

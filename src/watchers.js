import onChange from 'on-change';

const renderChangeValidStatus = (value, pageElements) => {
  const { input } = pageElements;
  if (value) {
    input.classList.remove('border', 'border-danger');
  } else {
    input.classList.add('border', 'border-danger');
  }
};

const renderChangeErrorMessage = (value, pageElements) => {
  const { feedback } = pageElements;
  feedback.textContent = value;
};

const renderChangeFeeds = (value, pageElements) => {
  const { feeds } = pageElements;
  feeds.innerHTML = (
    `<h2>Фиды</h2>
          <ul class="list-group mb-5">
          </ul>`
  );
  const feedsList = feeds.querySelector('ul');
  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item');
  feedItem.innerHTML = (
    `<h3>${value[0].title}</h3>
          <p>${value[0].description}</p>`
  );
  feedsList.append(feedItem);
};

const renderChangePosts = (value, pageElements) => {
  const { posts } = pageElements;
  posts.innerHTML = (
    `<h2>Посты</h2>
          <ul class="list-group">
          </ul>`
  );
  const postsList = posts.querySelector('ul');
  value.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    postItem.innerHTML = (
      `<a href="${post.link}" class="font-weight-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
            <button type="button" class="btn btn-primary btn-sm" data-id="${post.id}" data-toggle="modal"
            data-target="#modal">Просмотр</button>`
    );
    postsList.append(postItem);
  });
};

export default (state, pageElements) => {
  const watcher = onChange(state, (path, value) => {
    switch (path) {
      case 'form.validStatus':
        renderChangeValidStatus(value, pageElements);
        break;
      case 'form.errorMessage':
        renderChangeErrorMessage(value, pageElements);
        break;
      case 'feeds':
        renderChangeFeeds(value, pageElements);
        break;
      case 'posts':
        renderChangePosts(value, pageElements);
        break;
      default:
        break;
    }
  });
  return watcher;
};

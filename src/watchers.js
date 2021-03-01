import onChange from 'on-change';
import _ from 'lodash';

const renderChangeValidStatus = (value, pageElements) => {
  const { input } = pageElements;
  if (value) {
    input.classList.remove('border', 'border-danger');
  } else {
    input.classList.add('border', 'border-danger');
  }
};

const renderChangeMessage = (value, pageElements) => {
  const { feedback, form } = pageElements;
  const oldDouble = document.querySelector('.double');
  if (oldDouble !== null) {
    oldDouble.remove();
  }
  const feedbackDouble = document.createElement('div');
  feedbackDouble.classList.add('double');
  console.log('@@@FED-', feedback, '@@@DOUB-', feedbackDouble, '@@@VAL-', value);
  feedback.textContent = value;
  feedbackDouble.textContent = value;
  form.append(feedbackDouble);
  console.log('RESULT---', feedback.textContent);
};

const renderChangeFeeds = (value, pageElements, i18next) => {
  const { feeds, form } = pageElements;
  feeds.innerHTML = (
    `<h2>${i18next.t('feeds')}</h2>
          <ul class="list-group mb-5">
          </ul>`
  );
  const feedsList = feeds.querySelector('ul');

  const feedItems = value.map((item) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item');
    feedItem.innerHTML = (
      `<h3>${item.title}</h3>
          <p>${item.description}</p>`
    );
    return feedItem;
  });
  feedsList.append(...feedItems);
  form.reset();
};

const renderChangePosts = (value, prevValue, pageElements, i18next) => {
  const { posts } = pageElements;
  if (posts.innerHTML === '') {
    posts.innerHTML = (
      `<h2>${i18next.t('posts')}</h2>
    <ul class="list-group">
    </ul>`
    );
  }
  const newPosts = _.differenceWith(value, prevValue, _.isEqual);
  const postsList = posts.querySelector('ul');
  newPosts.reverse().forEach((post) => {
    // const linkClass = post.readed ? 'font-weight-normal' : 'font-weight-bold';
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    postItem.innerHTML = (
      `<a href="${post.link}" class="font-weight-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
            <button type="button" class="btn btn-primary btn-sm" data-id="${post.id}" data-toggle="modal"
            data-target="#modal">${i18next.t('view')}</button>`
    );
    postsList.prepend(postItem);
    const button = postItem.querySelector('button[data-toggle="modal"]');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const body = document.querySelector('body');
      body.classList.add('modal-open');
      body.style = 'padding-right: 17px;';
      const modal = body.querySelector('#modal');
      modal.classList.add('show');
      modal.ariaModal = 'true';
      modal.removeAttribute('aria-hidden');
      modal.style = 'padding-right: 17px; display: block;';
      modal.innerHTML = (
        `<div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">${post.title}</h5><button type="button" class="close"
        data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
    </div>
    <div class="modal-body">${post.description}</div>
    <div class="modal-footer"><a class="btn btn-primary full-article"
        href="${post.link}" role="button"
        target="_blank" rel="noopener noreferrer">${i18next.t('modal.readFull')}</a><button type="button" class="btn btn-secondary"
        data-dismiss="modal">${i18next.t('modal.close')}</button></div>
  </div>
</div>`
      );
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      body.append(backdrop);

      const link = postItem.querySelector(`a[data-id="${button.dataset.id}"]`);
      link.classList.remove('font-weight-bold');
      link.classList.add('font-weight-normal');

      const closeButtons = modal.querySelectorAll('button');
      const closeModal = () => {
        body.classList.remove('modal-open');
        body.style = '';
        modal.classList.remove('show');
        modal.ariaHidden = 'true';
        modal.removeAttribute('aria-modal');
        modal.style = '';
        backdrop.remove();
        closeButtons.forEach((closeButton) => {
          closeButton.removeEventListener('click', closeModal);
        });
      };

      const closeModalBack = (evt) => {
        if (evt.target === modal) {
          closeModal();
          modal.removeEventListener('click', closeModalBack);
        }
      };

      modal.addEventListener('click', closeModalBack);
      closeButtons.forEach((closeButton) => {
        closeButton.addEventListener('click', closeModal);
      });
    });
  });
};

const renderChangeStatus = (value, pageElements) => {
  const { addButton } = pageElements;
  if (value === 'waiting') addButton.disabled = true;
  if (value === 'ready') addButton.removeAttribute('disabled');
};

export default (state, pageElements, i18next) => {
  const watcher = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'form.validStatus':
        renderChangeValidStatus(value, pageElements);
        break;
      case 'form.message':
        renderChangeMessage(value, pageElements);
        break;
      case 'feeds':
        renderChangeFeeds(value, pageElements, i18next);
        break;
      case 'posts':
        renderChangePosts(value, prevValue, pageElements, i18next);
        break;
      case 'status':
        renderChangeStatus(value, pageElements);
        break;
      default:
        break;
    }
  });
  return watcher;
};

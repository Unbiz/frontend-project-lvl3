import _ from 'lodash';

export default (value, prevValue, pageElements, i18next) => {
  const { posts } = pageElements;

  if (!posts.firstChild) {
    posts.innerHTML = (
      `<h2>${i18next.t('posts')}</h2>
    <ul class="list-group">
    </ul>`
    );
  }

  const newPosts = _.differenceWith(value, prevValue, _.isEqual);
  const postsList = posts.querySelector('ul');
  newPosts.reverse().forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    postItem.innerHTML = (
      `<a href="${post.link}" class="font-weight-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
            <button type="button" class="btn btn-primary btn-sm" data-id="${post.id}" data-toggle="modal"
            data-target="#modal">${i18next.t('view')}</button>`
    );
    postsList.prepend(postItem);

    const button = postItem.querySelector('button[data-toggle="modal"]');

    button.addEventListener('click', () => {
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
              <h5 class="modal-title">${post.title}</h5>
              <button type="button" class="close"data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">${post.description}</div>
            <div class="modal-footer">
              <a class="btn btn-primary full-article" href="${post.link}" role="button"
              target="_blank" rel="noopener noreferrer">${i18next.t('modal.readFull')}</a>
              <button type="button" class="btn btn-secondary"
              data-dismiss="modal">${i18next.t('modal.close')}</button>
            </div>
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

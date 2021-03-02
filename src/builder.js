import _ from 'lodash';

const getFeed = (data, url) => {
  const title = data.querySelector('channel title').textContent;
  const description = data.querySelector('channel description').textContent;
  const id = _.uniqueId();

  return {
    title, description, url, id,
  };
};

const getPosts = (data, feedId) => {
  const feedPostsElements = data.querySelectorAll('item');
  const posts = [...feedPostsElements].map((post) => {
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const description = post.querySelector('description').textContent;

    return {
      title, link, description, feedId,
    };
  });

  return posts;
};

const getNewItem = (currentItems, oldItems) => {
  const oldItemsWithoutId = oldItems.map((post) => {
    const cloneOldPosts = _.cloneDeep(post);
    delete cloneOldPosts.id;

    return cloneOldPosts;
  });

  return _.differenceWith(currentItems, oldItemsWithoutId, _.isEqual);
};

const getNewFeedAndPosts = (data, url) => {
  const newFeed = getFeed(data, url);
  const newPostsWithoutId = getPosts(data, newFeed.id);
  const newPosts = newPostsWithoutId.map((post) => ({ ...post, id: _.uniqueId() }));
  return { newFeed, newPosts };
};

const getUpdatedPosts = (data, posts, feedId) => {
  const currentPosts = getPosts(data, feedId);
  const oldPosts = posts.filter((post) => post.feedId === feedId);
  const newPostsWithoutId = getNewItem(currentPosts, oldPosts);
  const newPosts = newPostsWithoutId.map((post) => ({ ...post, id: _.uniqueId() }));

  return newPosts;
};

export { getNewFeedAndPosts, getUpdatedPosts };

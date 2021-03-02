import * as yup from 'yup';

export default (url, feeds, i18next) => {
  const schema = yup
    .string(i18next.t('errors.urlInvalid'))
    .required(i18next.t('errors.urlInvalid'))
    .url(i18next.t('errors.urlInvalid'))
    .notOneOf(feeds, i18next.t('errors.urlAlreadyExists'));

  try {
    schema.validateSync(url);
    return null;
  } catch ({ message }) {
    return message;
  }
};

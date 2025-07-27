import { createSelector } from 'reselect';

const selectTemplateState = (state) => state.template;

export const selectTemplates = createSelector(
  [selectTemplateState],
  (template) => template.templates
);

export const selectLoading = createSelector(
  [selectTemplateState],
  (template) => template.loading
);

export const selectError = createSelector(
  [selectTemplateState],
  (template) => template.error
);

export const selectPage = createSelector(
  [selectTemplateState],
  (template) => template.page
);

export const selectTotalPages = createSelector(
  [selectTemplateState],
  (template) => template.totalPages
);

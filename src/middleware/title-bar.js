const parsingBreadcrumb = (id, breadcrumbs = []) => {
  if (_.isEmpty(breadcrumbs)) return [];
  return breadcrumbs.map(b => {
    if (_.has(b, "active") && b.active) {
      return b;
    } else {
      return {
        text: b.text,
        to: `/kos/${id}${b.to}`
      };
    }
  });
};

const setTitleBar = (titleBar = {}, store, id) => {
  const { title = "", breadcrumbs = [] } = titleBar;
  store.dispatch("title-bar/setTitle", title);
  store.dispatch(
    "title-bar/setBreadcrumbs",
    parsingBreadcrumb(id, breadcrumbs)
  );
};

export default ({ store, next, to }) => {
  const kos = store.getters["kos/selected"];
  const toName = to?.name;
  const toId = to?.params?.id;
  if (toId && toName && toName.includes("kos-id") && !_.isEmpty(kos)) {
    const titleBar = to.meta?.titlebar;
    if (!_.isEmpty(titleBar)) {
      setTitleBar(titleBar, store, toId);
    } else {
      setTitleBar({}, store, toId);
    }
  }
  return next();
};

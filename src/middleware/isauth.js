export default ({ store, next }) => {
  const auth = store.getters["authentication/auth"];
  if (!auth) {
    return next("/login");
  }
  return next();
};

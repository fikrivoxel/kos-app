export default ({ store, next }) => {
  const auth = store.getters["authentication/auth"];
  if (auth) {
    return next("/");
  }
  return next();
};

export default async ({ store, next }) => {
  try {
    await store.dispatchPromise("authentication/checkUser");
    return next();
  } catch (_err) {
    return next();
  }
};

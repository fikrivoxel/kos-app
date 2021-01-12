export default async ({ store, to, next }) => {
  const id = to?.params?.id;
  if (_.isEmpty(id)) {
    return next("/");
  }
  try {
    await store.dispatchPromise("kos/getById", {
      id
    });
  } catch (err) {
    return next("/");
  }
  return next();
};

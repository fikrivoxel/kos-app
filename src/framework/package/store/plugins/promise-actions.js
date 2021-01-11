import promiseIpc from "electron-promise-ipc";

const DISPATCH = "promise-action-dispatch";

export default () => store => {
  const renderer = store => {
    store.dispatchPromise = (type, payload) =>
      promiseIpc.send(DISPATCH, {
        type,
        payload
      });
  };

  const main = store => {
    promiseIpc.on(DISPATCH, ({ type, payload }) => {
      return store.dispatch(type, payload);
    });
  };

  return process.type === "renderer" ? renderer(store) : main(store);
};

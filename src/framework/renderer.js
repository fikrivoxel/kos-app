import _router from "@/framework/package/router";
import _store from "@/framework/package/store";
import _plugins from "@/framework/package/plugins";

_plugins(_store);

export const router = _router(_store);
export const store = _store;

import config_app from "@/config/app.json";

class Middleware {
  static evaluateGuards(guards, { to, from, next, store }) {
    const guardsLeft = guards.slice(0);
    const nextGuard = guardsLeft.shift();
    if (_.isEmpty(nextGuard) && !_.isFunction(nextGuard)) {
      return next();
    }
    nextGuard({
      to,
      from,
      next: nextArg => {
        if (_.isEmpty(nextArg)) {
          Middleware.evaluateGuards(guardsLeft, { to, from, next, store });
          return;
        }
        next(nextArg);
      },
      store
    });
  }
  constructor(to, from, next, store) {
    this.to = to;
    this.from = from;
    this.next = next;
    this.store = store;
    if (this.to && this.to.matched) {
      to.matched.forEach(route => this.applyRouteMiddlewares(route));
    }
  }
  defaultMiddleware() {
    const defMiddle = config_app.middleware;
    if (_.isArray(defMiddle)) {
      return Object.keys(this.middlewareList())
        .filter(mid => {
          return _.includes(defMiddle, mid);
        })
        .map(mid => {
          return this.middlewareList()[mid];
        });
    } else {
      return [this.middlewareList()[defMiddle]];
    }
  }
  middlewareList() {
    const files = require.context("../../../../middleware", false, /\.js$/);
    const middlewares = {};
    files.keys().forEach(key => {
      const filesKey = _.has(files(key), "default")
        ? files(key).default
        : files(key);
      middlewares[key.replace(/(\.\/|\.js)/g, "")] = filesKey;
    });
    return middlewares;
  }
  applyRouteMiddlewares(route) {
    if (
      route.meta &&
      route.meta.middleware &&
      !_.isEmpty(config_app.middleware)
    ) {
      let middlewareKeys = route.meta.middleware;
      if (_.isArray(middlewareKeys)) {
        const filterMidleware = Object.keys(this.middlewareList())
          .filter(mid => {
            return _.includes(middlewareKeys, mid);
          })
          .map(mid => {
            return this.middlewareList()[mid];
          });
        Middleware.evaluateGuards(
          [...this.defaultMiddleware(), ...filterMidleware],
          {
            to: this.to,
            from: this.from,
            next: this.next,
            store: this.store
          }
        );
      } else {
        Middleware.evaluateGuards(
          [
            ...this.defaultMiddleware(),
            ...[this.middlewares()[middlewareKeys]]
          ],
          {
            to: this.to,
            from: this.from,
            next: this.next,
            store: this.store
          }
        );
      }
    } else {
      this.next();
    }
  }
}

export default store => {
  return (...toMiddleware) => new Middleware(...toMiddleware, store);
};

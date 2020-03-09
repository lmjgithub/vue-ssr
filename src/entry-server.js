import { createApp } from "./main";
const isDev = process.env.NODE_ENV !== "production";

export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now();
    const { app, router, store } = createApp();
    const { url } = context;
    const { fullPath } = router.resolve(url).route;
    if (fullPath !== url) {
      return reject(new Error(fullPath));
    }
    // set router's location
    router.push(url);

    router.onReady(() => {
      // 获取路由匹配的组件
      const matchedComponents = router.getMatchedComponents();
      // 没有匹配
      if (!matchedComponents.length) {
        return reject(new Error("404"));
      }
      Promise.all(
        matchedComponents.map(
          ({ asyncData }) =>
            asyncData && asyncData({ store, route: router.currentRoute })
        )
      )
        .then(() => {
          isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`);
          context.state = store.state;

          resolve(app);
        })
        .catch(reject);
    });
  });
};

import Koa from "koa";
import Router from "koa-router";

// import laixuanH5Routers from "./laixuan_wechat_h5.router";
// import laixuanMiniRouters from './laixuan_mini_prog.router'
// import wxRouters from "./wx.router";
// import aliyunRouters from "./aliyun.router";
// import canvasRoutes from "./canvas.router";
// import feedbackRoutes from "./feedback.router";
// import userRoutes from "../user/user.router";

import { IMainOptions } from "../interface";

export default function router(app: Koa, options: IMainOptions) {
  console.log("router prefix: ", options.route.prefix);
  const rootRouter = new Router({ prefix: options.route.prefix });

  // laixuanH5Routers(rootRouter, options);
  // wxRouters(rootRouter, options);
  // aliyunRouters(rootRouter, options);
  // canvasRoutes(rootRouter, options);
  // feedbackRoutes(rootRouter);
  // userRoutes(rootRouter);

  app.use(rootRouter.routes());
  app.use(rootRouter.allowedMethods());
}

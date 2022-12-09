import Koa from "koa";

import middleware from "./middleware";
import router from "./middleware/router.mw";
import connectDB, { dispose as disposeDB } from "./db";
import getLogger from "./helper/logger.helper";

// -----------------------------------------------------------------------------

const logger = getLogger();

// -----------------------------------------------------------------------------

function shutdown(code: number = 0) {
  const defers = [disposeDB()];

  return Promise.all(defers).then(() => {
    setTimeout(() => {
      logger.info("process ready to shutdown.");
      process.exit(code);
    }, 1200);
  });
}

export default async function main(options: any) {
  const err = await connectDB(options.mode);
  if (err) {
    throw err;
  }

  const app = new Koa();

  // use middlewares
  middleware(app, options);

  // app.use((ctx: Koa.Context, next) => {
  //   function afterResponse() {
  //     ctx.res.removeListener("finish", afterResponse);
  //     ctx.res.removeListener("close", afterResponse);

  //     // actions after response
  //     console.log("actions after response", ctx.body);
  //   }
  //   ctx.res.on("finish", afterResponse);
  //   ctx.res.on("close", afterResponse);

  //   // action before request
  //   // eventually calling `next()`
  //   next();
  // });

  // app.use((ctx, next) => {
  //   console.log("before route", ctx.body);
  //   next();
  // });

  // user routers
  router(app, options);

  // If we receive a kill cmd then we will first try to dispose our listeners.
  const exiting = () => {
    shutdown(0);
  };

  // tslint:disable-next-line
  ["SIGUSR1", "SIGUSR2", "SIGINT", "SIGTERM"].map((sig: any) =>
    process.on(sig, exiting)
  );

  // uncaughtException
  process.on("uncaughtException", (err: Error) => {
    logger.error("process.uncaughtException:", err.message, err.stack);

    shutdown(1);
  });

  // ---------------------------------------------------------------------------

  return new Promise((resolve, reject) => {
    const server = app
      .listen(options.port, () => {
        const { route } = options;
        const serv = `http://::1:${options.port}${route.prefix}`;

        console.info(
          `Server is running on ${serv} in ${options.env} ${options.mode}.`
        );

        resolve(server);
      })
      .on("error", (err: Error) => {
        console.error(err.stack as string);
        reject(err);
      });
  });
}

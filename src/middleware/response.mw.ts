import { Context } from "koa";
import Router from "koa-router";

/**
 * modification middleware
 */

// @see https://stackoverflow.com/questions/56558386/how-to-create-koa2-middleware-which-will-modify-response-body-and-run-last-in-a
const response = async (
  ctx: Context | Router.IRouterContext,
  next: () => Promise<any>
) => {
  await next();

  const error = (ctx.body as any)?.error || {
    error_code: 0,
    error_detail: "",
  };

  ctx.body = {
    error,
    data: ctx.body,
  };
};

export default response;

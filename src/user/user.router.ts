import { Context } from "koa";
import * as Router from "koa-router";
import { IUser } from "../interface/user.interface";
import { UserController } from "./user.controller";

export default async (router: Router) => {
  const userActions = new UserController();

  router.post("/auth/login", async (ctx: Context) => {
    const { username, password } = ctx.request.body as any;
    console.log("ctx.request.body", ctx.request.body);
    const userNameHash = await userActions.login(username, password);

    // maxAge unit is ms
    ctx.cookies.set("me_signed_username", userNameHash, {
      domain: "192.168.50.165",
      maxAge: 30 * 3600 * 24 * 1000,
      httpOnly: true,
    });

    ctx.body = userNameHash;
  });

  router.post("/user", async (ctx: Context) => {
    const params = ctx.request.body;
    const user = await userActions.createUser(params as IUser);
    ctx.body = user;
  });

  // http://localhost:8000/api/me/users
  router.get("/users", async (ctx: Context) => {
    const users = await userActions.findAll();
    ctx.body = users;
  });

  router.get("/user/:userNameHash", async (ctx: Context) => {
    const { userNameHash } = ctx.params;
    console.log("find user router", userNameHash);
    const user = await userActions.findOneFromHash(userNameHash);
    ctx.body = user;
  });

  // ----------------------------------------------------------------
  // TODO: 测试接口 用完就删
  // ----------------------------------------------------------------

  router.get("/user/test/del/:username", async (ctx: Context) => {
    const { username } = ctx.params;
    ctx.body = await userActions.removeOneCache(username);
  });

  // http://localhost:8000/api/me/user/test/luankefei
  router.get("/user/test/:username", async (ctx: Context) => {
    const { username } = ctx.params;
    console.log("find user router", username);
    const user = await userActions.findOne(username);
    ctx.body = user;
  });
};

/**
 * 入口模块
 */
import sourceMapSupport from "source-map-support";
import * as moment from "moment";
// import "moment/locale/zh-cn";
import "isomorphic-fetch";

sourceMapSupport.install();

// require("isomorphic-fetch");

// import * as Bluebird from "bluebird";
// global.Promise = Bluebird;

// import * as moment from "moment";
// import "moment/locale/zh-cn";

console.log(0);
import main from "./main";
console.log("-");
import config from "./constant/env.constant";
console.log("-");

moment.locale("zh-cn");
console.log(1);
main(config);
console.log(2);

/**
 * 入口模块
 */
import sourceMapSupport from "source-map-support";
import moment from "moment";
// import "moment/locale/zh-cn";
import "isomorphic-fetch";
import main from "./main";
import config from "./constant/env.constant";

sourceMapSupport.install();

// for test
// import { migrateGarminCN2GarminGlobal } from "./garmin/index";
// migrateGarminCN2GarminGlobal();

// require("isomorphic-fetch");

// import * as Bluebird from "bluebird";
// global.Promise = Bluebird;

// import * as moment from "moment";
// import "moment/locale/zh-cn";

moment.locale("zh-cn");
main(config);

import fs from "fs";
import unzipper from "unzipper";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import GarminGlobal from "@gooin/garmin-connect";

import GarminCN from "./garmin_cn";
import GarminGlobal from "./garmin_global";
import { activities, DOWNLOAD_DIR, FILE_SUFFIX } from "./api";
import { number2capital } from "../utils/number";
import GarminCNClient from "./garmin_cn";
import GarminConnect from "./garmin_global";

type GarminClientType = typeof GarminCN | typeof GarminGlobal;

const GARMIN_MIGRATE_START = "";
const GARMIN_MIGRATE_NUM = "";

/**
 * 上传 .fit file
 * @param fitFilePath
 * @param client
 */
export const uploadGarminActivity = async (
  fitFilePath: string,
  client: GarminConnect
): Promise<void> => {
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
  }
  const upload = await client.uploadActivity(fitFilePath);
  console.log("upload to garmin activity", upload);
};

/**
 * 下载 garmin 活动原始数据，并解压保存到本地
 * @param activityId
 * @param client GarminClientType
 */
export const downloadGarminActivity = async (
  activityId: any,
  client: GarminCN
): Promise<string> => {
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
  }
  const activity = await client.getActivity({ activityId });
  await client.downloadOriginalActivityData(activity, DOWNLOAD_DIR);
  const originZipFile = DOWNLOAD_DIR + "/" + activityId + ".zip";
  await fs
    .createReadStream(originZipFile)
    .pipe(unzipper.Extract({ path: DOWNLOAD_DIR }));
  // waiting 4s for extract zip file
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const baseFilePath = `${DOWNLOAD_DIR}/${activityId}_ACTIVITY`;
  console.log("saved origin FilePath", baseFilePath);
  const fitFilePath = `${baseFilePath}.${FILE_SUFFIX.FIT}`;
  const gpxFilePath = `${baseFilePath}.${FILE_SUFFIX.GPX}`;
  const tcxFilePath = `${baseFilePath}.${FILE_SUFFIX.TCX}`;
  try {
    if (fs.existsSync(fitFilePath)) {
      return fitFilePath;
    } else if (fs.existsSync(gpxFilePath)) {
      return gpxFilePath;
    } else if (fs.existsSync(tcxFilePath)) {
      return tcxFilePath;
    } else {
      const existFiles = fs
        .readdirSync(DOWNLOAD_DIR, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .map((item) => item.name);
      console.log("fitFilePath not exist, curr existFiles", existFiles);
      // core.setFailed("file not exist " + baseFilePath);
      return Promise.reject("file not exist " + fitFilePath);
    }
  } catch (err) {
    console.error("-----", err);
    // core.setFailed(err);
  }
  return fitFilePath;
};

export const migrateGarminCN2GarminGlobal = async (count = 200) => {
  console.log("-----");
  const actIndex = Number(GARMIN_MIGRATE_START) ?? 0;
  // const actPerGroup = 10;
  // const totalAct = Number(GARMIN_MIGRATE_NUM) || count;
  const totalAct = 1;

  // TODO: 这里的逻辑不对，不止需要返回 client，还需要登录。参考 DailySync 项目
  const garminCN = new GarminCN();
  const { client: clientCN } = garminCN;
  await garminCN.login("luankefei@gmail.com", "Sunken24");

  // const clientGlobal = new GarminGlobal();
  // await clientGlobal.login();

  const actSlices = await garminCN.getActivities(actIndex, totalAct);
  console.log("actSlices", actSlices, actIndex, totalAct);

  // only running
  const runningActs = actSlices.filter(
    (item: any) => item.activityType.typeKey === "running"
  );

  console.log("runningActs", runningActs.length);

  // const runningActs = actSlices;
  for (let j = 0; j < runningActs.length; j++) {
    const act = runningActs[j];
    // console.log({ act });
    // 下载佳明原始数据
    const filePath = await downloadGarminActivity(act.activityId, garminCN);
    // 上传到佳明国际区
    console.log(
      `本次开始向国际区上传第 ${number2capital(
        j + 1
      )} 条数据，相对总数上传到 ${number2capital(j + 1 + actIndex)} 条，  【 ${
        act.activityName
      } 】，开始于 【 ${act.startTimeLocal} 】，活动ID: 【 ${act.activityId} 】`
    );

    try {
      await uploadGarminActivity(filePath, clientGlobal);
    } catch (err) {
      console.log("e", err);
    }
    // await new Promise(resolve => setTimeout(resolve, 2000));
  }
};

// export const syncGarminCN2GarminGlobal = async () => {
//   const clientCN = await getGaminCNClient();
//   const clientGlobal = await getGaminCNClient(); // 两边逻辑相同，只区分配置文件即可

//   let cnActs = await clientCN.getActivities(0, 10);
//   const globalActs = await clientGlobal.getActivities(0, 1);

//   const latestGlobalActStartTime = globalActs[0]?.startTimeLocal ?? "0";
//   const latestCnActStartTime = cnActs[0]?.startTimeLocal ?? "0";
//   if (latestCnActStartTime === latestGlobalActStartTime) {
//     console.log(
//       `没有要同步的活动内容, 最近的活动:  【 ${cnActs[0].activityName} 】, 开始于: 【 ${latestCnActStartTime} 】`
//     );
//   } else {
//     // fix: #18
//     _.reverse(cnActs);
//     let actualNewActivityCount = 1;
//     for (let i = 0; i < cnActs.length; i++) {
//       const cnAct = cnActs[i];
//       if (cnAct.startTimeLocal > latestGlobalActStartTime) {
//         // 下载佳明原始数据
//         const filePath = await downloadGarminActivity(
//           cnAct.activityId,
//           clientCN
//         );
//         // 上传到佳明国际区
//         console.log(
//           `本次开始向国际区上传第 ${number2capital(
//             actualNewActivityCount
//           )} 条数据，【 ${cnAct.activityName} 】，开始于 【 ${
//             cnAct.startTimeLocal
//           } 】，活动ID: 【 ${cnAct.activityId} 】`
//         );
//         await uploadGarminActivity(filePath, clientGlobal);
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         actualNewActivityCount++;
//       }
//     }
//   }

type ConfigType = "cn" | "global";

// 国区和国际区配置相同，只需把.cn替换成.com
const GC_MODERN = "https://connect.garmin.com/modern";
const GARMIN_SSO_ORIGIN = "https://sso.garmin.com";
const GARMIN_SSO = `${GARMIN_SSO_ORIGIN}/sso`;
const BASE_URL = `${GC_MODERN}/proxy`;

export const DOWNLOAD_DIR = "./garmin_fit_files";

export const FILE_SUFFIX = {
  FIT: "fit",
  GPX: "gpx",
  TCX: "tcx",
};

export const GLOBAL = {
  GC_MODERN: GC_MODERN,
  GARMIN_SSO_ORIGIN: GARMIN_SSO_ORIGIN,
  GARMIN_SSO: `${GARMIN_SSO_ORIGIN}/sso`,
  SIGNIN_URL: `${GARMIN_SSO}/signin`,
  CURRENT_USER_SERVICE: `${GC_MODERN}/currentuser-service/user/info`,
};

// GLOBAL
const ACTIVITY_SERVICE = `${BASE_URL}/activity-service`;
const activity = (id: any) => `${ACTIVITY_SERVICE}/activity/${id}`;
export const activityDetails = (id: any) => `${activity(id)}/details`;

const ACTIVITYLIST_SERVICE = `${BASE_URL}/activitylist-service`;
export const activities = () =>
  `${ACTIVITYLIST_SERVICE}/activities/search/activities`;

const DOWNLOAD_SERVICE = `${BASE_URL}/download-service`;
export const originalFile = (id: any) =>
  `${DOWNLOAD_SERVICE}/files/activity/${id}`;

const UPLOAD_SERVICE = `${BASE_URL}/upload-service`;
export const upload = (format: string) => `${UPLOAD_SERVICE}/upload/${format}`;

/**
 *
 * @param id {string}
 * @param type "tcx" | "gpx" | "kml"
 * @return {`${string}/export/${string}/activity/${string}`}
 */
export const exportFile = (id: string, type: string) =>
  `${DOWNLOAD_SERVICE}/export/${type}/activity/${id}`;

// 这里只能获取基础配置，其他的交给各文件的 get 函数来 replace
export default function config(type: ConfigType) {
  if (type === "global") return GLOBAL;
  const CN = { ...GLOBAL };
  Reflect.ownKeys(CN).forEach((item) => {
    CN[item] = CN[item].replace(".com", ".cn");
  });
  return CN;
}

export function getUrl(key: any, type: ConfigType) {}

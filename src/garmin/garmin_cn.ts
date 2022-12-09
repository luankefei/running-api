import GarminClient from "./client";

import getConfig, {
  activities,
  activityDetails,
  originalFile,
  exportFile,
} from "./api";

const config = getConfig("cn");

const headers = {
  origin: "https://sso.garmin.cn",
  nk: "NT",
};

export default class GarminCNClient {
  client: any;

  constructor() {
    this.client = new GarminClient(headers);
  }

  replace(url: string) {
    return url.replace(".com", ".cn");
  }

  // General methods
  async get(url: string, data: any) {
    const path = url.replace(".com", ".cn");
    const response = await this.client.get(path, data);
    // this.triggerEvent(this.events.sessionChange, this.sessionJson);
    return response;
  }

  // User info
  /**
   * Get basic user information
   * @returns {Promise<*>}
   */
  async getUserInfo() {
    return this.get(config.CURRENT_USER_SERVICE, {});
  }

  // Activites
  /**
   * Get list of activites
   * @param start
   * @param limit
   * @returns {Promise<*>}
   */
  async getActivities(start: number, limit: number) {
    return this.get(activities(), { start, limit });
  }

  /**
   * Get details about an activity
   * @param activity
   * @param maxChartSize
   * @param maxPolylineSize
   * @returns {Promise<*>}
   */
  async getActivity(
    activity: any,
    maxChartSize?: number,
    maxPolylineSize?: number
  ) {
    const { activityId } = activity || {};
    if (activityId) {
      return this.get(activityDetails(activityId), {
        maxChartSize,
        maxPolylineSize,
      });
    }
    return Promise.reject();
  }

  /**
   * Login to Garmin Connect
   * @param username
   * @param password
   * @returns {Promise<*>}
   */
  async login(username: string, password: string) {
    const credentials = {
      username,
      password,
      embed: "false",
      rememberme: "on",
    };

    await this.client.post(config.SIGNIN_URL, credentials);
    const userPreferences = await this.getUserInfo();
    const { displayName } = userPreferences;
    // this.userHash = displayName;
    // console.log("CN login", config.SIGNIN_URL);
    console.log(userPreferences);
  }

  /**
   * Download original activity data to disk as zip
   * Resolves to absolute path for the downloaded file
   * @param activity : any
   * @param dir Will default to current working directory
   * @param type : string - Will default to 'zip'. Other possible values are 'tcx', 'gpx' or 'kml'.
   * @returns {Promise<*>}
   */
  async downloadOriginalActivityData(
    activity: any,
    dir: string,
    type: string = ""
  ) {
    const { activityId } = activity || {};
    if (activityId) {
      const url =
        type === "" || type === "zip"
          ? originalFile(activityId)
          : exportFile(activityId, type);
      return this.client.downloadBlob(dir, this.replace(url));
    }
    return Promise.reject();
  }
}

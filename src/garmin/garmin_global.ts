import path from "path";
import fs from "fs";
import FormData from "form-data";

import getConfig, { GLOBAL, activityDetails, upload } from "./api";
import GarminClient from "./client";

// let config = {};
// try {
//   // eslint-disable-next-line
//   config = require(`${appRoot}/garmin.config.json`);
// } catch (e) {
//   // Do nothing
// }

// const CFClient = require("../common/CFClient");
// const { Running } = require("./workouts");
// const { toDateString } = require("../common/DateUtils");
// const urls = require("./Urls");

// const { username: configUsername, password: configPassword } = config;

// const credentials = {
//   username: configUsername,
//   password: configPassword,
//   embed: "false",
// };

const config = getConfig("global");

class GarminConnect {
  client: any;
  userHash: any;
  listeners: any;
  events: any;

  constructor() {
    const headers = {
      origin: config.GARMIN_SSO_ORIGIN,
      nk: "NT",
    };
    this.client = new GarminClient(headers);
    this.userHash = undefined;
    this.listeners = {};
    this.events = { sessionChange: "sessionChange" };
  }

  get sessionJson() {
    const cookies = this.client.serializeCookies();
    return { cookies, userHash: this.userHash };
  }

  set sessionJson(json) {
    const { cookies, userHash } = json || {};
    if (cookies && userHash) {
      this.userHash = userHash;
      this.client.importCookies(cookies);
    }
  }

  // /**
  //  * Add an event listener callback
  //  * @param event
  //  * @param callback
  //  */
  // on(event, callback) {
  //   if (
  //     event &&
  //     callback &&
  //     typeof event === "string" &&
  //     typeof callback === "function"
  //   ) {
  //     if (!this.listeners[event]) {
  //       this.listeners[event] = [];
  //     }
  //     this.listeners[event].push(callback);
  //   }
  // }

  // /**
  //  * Method for triggering any event
  //  * @param event
  //  * @param data
  //  */
  // triggerEvent(event, data) {
  //   const callbacks = this.listeners[event] || [];
  //   callbacks.forEach((cb) => cb(data));
  // }

  // /**
  //  * Add a callback to the 'sessionChange' event
  //  * @param callback
  //  */
  // onSessionChange(callback) {
  //   this.on(this.events.sessionChange, callback);
  // }

  // /**
  //  * Restore an old session from storage and fallback to regular login
  //  * @param json
  //  * @param username
  //  * @param password
  //  * @returns {Promise<GarminConnect>}
  //  */
  // async restoreOrLogin(json, username, password) {
  //   return this.restore(json).catch((e) => {
  //     console.warn(e);
  //     return this.login(username, password);
  //   });
  // }

  // /**
  //  * Restore an old session from storage
  //  * @param json
  //  * @returns {Promise<GarminConnect>}
  //  */
  // async restore(json) {
  //   this.sessionJson = json;
  //   try {
  //     const info = await this.getUserInfo();
  //     const { displayName } = info || {};
  //     if (displayName && displayName === this.userHash) {
  //       // Session restoration was successful
  //       return this;
  //     }
  //     throw new Error("Unable to restore session, user hash do not match");
  //   } catch (e) {
  //     throw new Error(`Unable to restore session due to: ${e}`);
  //   }
  // }

  /**
   * Login to Garmin Connect
   * @param username
   * @param password
   * @returns {Promise<*>}
   */
  async login(username: string, password: string) {
    // let tempCredentials = { ...credentials, rememberme: "on" };
    // if (username && password) {
    //   tempCredentials = {
    //     ...credentials,
    //     username,
    //     password,
    //     rememberme: "on",
    //   };
    // }
    // await this.client.get(urls.SIGNIN_URL);
    // await this.client.post(urls.SIGNIN_URL, tempCredentials);
    // const userPreferences = await this.getUserInfo();
    // const { displayName } = userPreferences;
    // this.userHash = displayName;
    // return this;

    const credentials = {
      username,
      password,
      embed: "false",
      rememberme: "on",
    };

    console.log("GLOBAL LOGIN", config.SIGNIN_URL, credentials);
    await this.client.get(config.SIGNIN_URL);
    const res = await this.client.post(config.SIGNIN_URL, credentials);
    const userPreferences = await this.getUserInfo();
    // const { displayName } = userPreferences;
    // this.userHash = displayName;
    console.log(userPreferences);
  }

  // User info
  /**
   * Get basic user information
   * @returns {Promise<*>}
   */
  async getUserInfo() {
    return this.get(config.CURRENT_USER_SERVICE, {});
  }

  // /**
  //  * Get social user information
  //  * @returns {Promise<*>}
  //  */
  // async getSocialProfile() {
  //   return this.get(urls.socialProfile(this.userHash));
  // }

  // /**
  //  * Get a list of all social connections
  //  * @returns {Promise<*>}
  //  */
  // async getSocialConnections() {
  //   return this.get(urls.socialConnections(this.userHash));
  // }

  // // Devices
  // /**
  //  * Get a list of all registered devices
  //  * @returns {Promise<*>}
  //  */
  // async getDeviceInfo() {
  //   return this.get(urls.deviceInfo(this.userHash));
  // }

  // // Sleep data
  // /**
  //  * Get detailed sleep data for a specific date
  //  * @param date
  //  * @returns {Promise<*>}
  //  */
  // async getSleepData(date = new Date()) {
  //   const dateString = toDateString(date);
  //   return this.get(urls.dailySleepData(this.userHash), { date: dateString });
  // }

  // /**
  //  * Get sleep data summary for a specific date
  //  * @param date
  //  * @returns {Promise<*>}
  //  */
  // async getSleep(date = new Date()) {
  //   const dateString = toDateString(date);
  //   return this.get(urls.dailySleep(), { date: dateString });
  // }

  // // Heart rate
  // /**
  //  * Get heart rate measurements for a specific date
  //  * @param date
  //  * @returns {Promise<*>}
  //  */
  // async getHeartRate(date = new Date()) {
  //   const dateString = toDateString(date);
  //   return this.get(urls.dailyHeartRate(this.userHash), { date: dateString });
  // }

  // // Weight
  // /**
  //  * Post a new body weight
  //  * @param weight
  //  * @returns {Promise<*>}
  //  */
  // async setBodyWeight(weight) {
  //   if (weight) {
  //     const roundWeight = Math.round(weight * 1000);
  //     const data = { userData: { weight: roundWeight } };
  //     return this.put(urls.userSettings(), data);
  //   }
  //   return Promise.reject();
  // }

  // // Activites
  // /**
  //  * Get list of activites
  //  * @param start
  //  * @param limit
  //  * @returns {Promise<*>}
  //  */
  // async getActivities(start, limit) {
  //   return this.get(urls.activities(), { start, limit });
  // }

  // /**
  //  * Get details about an activity
  //  * @param activity
  //  * @param maxChartSize
  //  * @param maxPolylineSize
  //  * @returns {Promise<*>}
  //  */
  async getActivity(activity: any, maxChartSize: any, maxPolylineSize: any) {
    const { activityId } = activity || {};
    if (activityId) {
      return this.get(activityDetails(activityId), {
        maxChartSize,
        maxPolylineSize,
      });
    }
    return Promise.reject();
  }

  // /**
  //  * Get weather data from an activity
  //  * @param activity
  //  * @returns {Promise<*>}
  //  */
  // async getActivityWeather(activity) {
  //   const { activityId } = activity || {};
  //   if (activityId) {
  //     return this.get(urls.weather(activityId));
  //   }
  //   return Promise.reject();
  // }

  // /**
  //  * Updates an activity
  //  * @param activity
  //  * @returns {Promise<*>}
  //  */
  // async updateActivity(activity) {
  //   return this.put(urls.activity(activity.activityId), activity);
  // }

  // /**
  //  * Deletes an activity
  //  * @param activity
  //  * @returns {Promise<*>}
  //  */
  // async deleteActivity(activity) {
  //   const { activityId } = activity || {};
  //   if (activityId) {
  //     const headers = { "x-http-method-override": "DELETE" };
  //     return this.client.postJson(
  //       urls.activity(activityId),
  //       undefined,
  //       undefined,
  //       headers
  //     );
  //   }
  //   return Promise.reject();
  // }

  // /**
  //  * Get list of activities in your news feed
  //  * @param start
  //  * @param limit
  //  * @returns {Promise<*>}
  //  */
  // async getNewsFeed(start, limit) {
  //   return this.get(urls.newsFeed(), { start, limit });
  // }

  // // Steps
  // /**
  //  * Get step count for a specific date
  //  * @param date
  //  * @returns {Promise<*>}
  //  */
  // async getSteps(date = new Date()) {
  //   const dateString = toDateString(date);
  //   return this.get(urls.dailySummaryChart(this.userHash), {
  //     date: dateString,
  //   });
  // }

  // // Workouts
  // /**
  //  * Get list of workouts
  //  * @param start
  //  * @param limit
  //  * @returns {Promise<*>}
  //  */
  // async getWorkouts(start, limit) {
  //   return this.get(urls.workouts(), { start, limit });
  // }

  // /**
  //  * Download original activity data to disk as zip
  //  * Resolves to absolute path for the downloaded file
  //  * @param activity : any
  //  * @param dir Will default to current working directory
  //  * @param type : string - Will default to 'zip'. Other possible values are 'tcx', 'gpx' or 'kml'.
  //  * @returns {Promise<*>}
  //  */
  // async downloadOriginalActivityData(activity, dir, type = "") {
  //   const { activityId } = activity || {};
  //   if (activityId) {
  //     const url =
  //       type === "" || type === "zip"
  //         ? urls.originalFile(activityId)
  //         : urls.exportFile(activityId, type);
  //     return this.client.downloadBlob(dir, url);
  //   }
  //   return Promise.reject();
  // }

  // /**
  //  * Uploads an activity file ('gpx', 'tcx', or 'fit')
  //  * @param file the file to upload
  //  * @param format the format of the file. If undefined, the extension of the file will be used.
  //  * @returns {Promise<*>}
  //  */
  async uploadActivity(file: any, format?: any) {
    // throw new Error("uploadActivity method is disabled in this version");
    const detectedFormat = format || path.extname(file);
    if (
      detectedFormat !== ".gpx" &&
      detectedFormat !== ".tcx" &&
      detectedFormat !== ".fit"
    ) {
      Promise.reject();
    }

    // console.log(
    //   "uploadActivity",
    //   file,
    //   format,
    //   path.basename(file),
    //   fs.createReadStream(file)
    // );
    const formData = new FormData();
    const fileData = fs.readFileSync(file);
    // formData.append("data", fileData, { filename: path.basename(file) });
    // const fileData = fs.readFileSync(file, "utf-8");
    // console.log(typeof fileData);
    formData.append(
      "file",
      // path.basename(file),
      fileData,
      { filename: path.basename(file) }
    );
    // formData.append(path.basename(file), fileData);
    return this.client.postBlob(upload(format), formData);
  }

  // /**
  //  * Adds a running workout with one step of completeing a set distance.
  //  * @param name
  //  * @param meters
  //  * @param description
  //  * @returns {Promise<*>}
  //  */
  // async addRunningWorkout(name, meters, description) {
  //   const running = new Running();
  //   running.name = name;
  //   running.distance = meters;
  //   running.description = description;
  //   return this.addWorkout(running);
  // }

  // /**
  //  * Add a new workout preset.
  //  * @param workout
  //  * @returns {Promise<*>}
  //  */
  // async addWorkout(workout) {
  //   if (workout.isValid()) {
  //     const data = { ...workout.toJson() };
  //     if (!data.description) {
  //       data.description = "Added by garmin-connect for Node.js";
  //     }
  //     return this.post(urls.workout(), data);
  //   }
  //   return Promise.reject();
  // }

  // /**
  //  * Add a workout to your workout calendar.
  //  * @param workout
  //  * @param date
  //  * @returns {Promise<*>}
  //  */
  // async scheduleWorkout(workout, date) {
  //   const { workoutId } = workout || {};
  //   if (workoutId && date) {
  //     const dateString = toDateString(date);
  //     return this.post(urls.schedule(workoutId), { date: dateString });
  //   }
  //   return Promise.reject();
  // }

  // /**
  //  * Delete a workout based on a workout object.
  //  * @param workout
  //  * @returns {Promise<*>}
  //  */
  // async deleteWorkout(workout) {
  //   const { workoutId } = workout || {};
  //   if (workoutId) {
  //     const headers = { "x-http-method-override": "DELETE" };
  //     return this.client.postJson(
  //       urls.workout(workoutId),
  //       undefined,
  //       undefined,
  //       headers
  //     );
  //   }
  //   return Promise.reject();
  // }

  // // General methods

  async get(url: any, data: any) {
    const response = await this.client.get(url, data);
    // this.triggerEvent(this.events.sessionChange, this.sessionJson);
    return response;
  }

  async post(url: string, data: any) {
    const response = await this.client.postJson(url, data);
    // this.triggerEvent(this.events.sessionChange, this.sessionJson);
    return response;
  }

  // async put(url, data) {
  //   const response = await this.client.putJson(url, data);
  //   this.triggerEvent(this.events.sessionChange, this.sessionJson);
  //   return response;
  // }
}

export default GarminConnect;

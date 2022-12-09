import cloudscraper from "cloudscraper";
import axios, { Axios } from "axios";
import qs from "qs";
import request from "request";
import fs from "fs";
import path from "path";

const asJson = (body: any) => {
  try {
    const jsonBody = JSON.parse(body);
    return jsonBody;
  } catch (e) {
    // Do nothing
  }
  return body;
};

class CFClient {
  cloudscraper: any;
  axios: any;
  queryString: any;
  cookies: any;
  headers: any;
  sessionJson: any;

  constructor(headers: any) {
    this.cloudscraper = cloudscraper;
    this.axios = axios.create({});
    this.queryString = qs;
    this.cookies = request.jar();
    this.headers = headers || {};
  }

  setCookie(name: any, value: any) {
    this.cookies[name] = value;
    this.headers.Cookie = this.getCookieString();
  }

  parseCookies(response: any) {
    const setCookies =
      response && response.headers && response.headers["set-cookie"];
    if (setCookies) {
      setCookies.forEach((c: any) => {
        const [cookieValue] = c.split(";");
        const [name, value] = cookieValue.split("=");
        this.setCookie(name, value);
      });
    }
    return response;
  }

  getCookie(name: any) {
    return this.cookies[name];
  }

  getCookieString() {
    return Object.entries(this.cookies)
      .map((e) => `${e[0]}=${e[1]}`)
      .join("; ");
  }

  serializeCookies() {
    // eslint-disable-next-line no-underscore-dangle
    return this.cookies._jar.serializeSync();
  }

  importCookies(cookies: any) {
    // eslint-disable-next-line no-underscore-dangle
    const deserialized = this.cookies._jar.constructor.deserializeSync(cookies);
    this.cookies = request.jar();
    // eslint-disable-next-line no-underscore-dangle
    this.cookies._jar = deserialized;
  }

  async scraper(options: any) {
    return new Promise((resolve) => {
      this.cloudscraper(options, (err: any, res: any) => {
        resolve(res);
      });
    });
  }

  /**
   * @param {string} downloadDir
   * @param {string} url
   * @param {*} data
   */
  async downloadBlob(downloadDir = "", url: string, data: any) {
    const queryData = this.queryString.stringify(data);
    const queryDataString = queryData ? `?${queryData}` : "";
    const options = {
      method: "GET",
      jar: this.cookies,
      uri: `${url}${queryDataString}`,
      headers: this.headers,
      encoding: 0,
    };
    return new Promise((resolve) => {
      this.cloudscraper(options, async (err: any, response: any, body: any) => {
        const { headers } = response || {};
        const { "content-disposition": contentDisposition } = headers || {};
        const downloadDirNormalized = path.normalize(downloadDir);
        if (contentDisposition) {
          const defaultName = `garmin_connect_download_${Date.now()}`;
          const [, fileName = defaultName] =
            contentDisposition.match(/filename="?([^"]+)"?/);
          const filePath = path.resolve(downloadDirNormalized, fileName);
          fs.writeFileSync(filePath, body);
          resolve(filePath);
        }
      });
    });
  }

  async get(url: string, data: any) {
    const queryData = this.queryString.stringify(data);
    const queryDataString = queryData ? `?${queryData}` : "";
    const options = {
      method: "GET",
      jar: this.cookies,
      uri: `${url}${queryDataString}`,
      headers: this.headers,
    };
    const { body }: any = await this.scraper(options);
    return asJson(body);
  }

  async post(url: string, data: any) {
    const options = {
      method: "POST",
      uri: url,
      jar: this.cookies,
      formData: data,
      headers: this.headers,
    };
    const { body }: any = await this.scraper(options);
    return asJson(body);
  }

  async postJson(url: string, data: any, params: any, headers: any) {
    const options = {
      method: "POST",
      uri: url,
      jar: this.cookies,
      json: data,
      headers: {
        ...this.headers,
        ...headers,
        "Content-Type": "application/json",
      },
    };
    const { body }: any = await this.scraper(options);
    return asJson(body);
  }

  async putJson(url: string, data: any) {
    const options = {
      method: "PUT",
      uri: url,
      jar: this.cookies,
      json: data,
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
      },
    };
    const { body }: any = await this.scraper(options);
    return asJson(body);
  }

  /**
   * Uploads an activity file ('gpx', 'tcx', or 'fit')
   * @param file the file to upload
   * @param format the format of the file. If undefined, the extension of the file will be used.
   * @returns {Promise<*>}
   */
  async uploadActivity(file: any, format: any) {
    throw new Error("uploadActivity method is disabled in this version");
    /*
    const detectedFormat = format || path.extname(file);
    if (detectedFormat !== '.gpx' && detectedFormat !== '.tcx' && detectedFormat !== '.fit') {
        Promise.reject();
    }
    const formData = new FormData();
    formData.append(path.basename(file), fs.createReadStream(file));
    return this.client.postBlob(urls.upload(format), formData);
     */
  }

  postBlob(url: string, formData: any) {
    // console.log("formData", typeof formData);

    // return this.axios.post(url, formData);
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    return this.axios({
      method: "POST",
      url,
      data: formData,
      headers: {
        ...this.headers,
        ...headers,
        // ...formData.getHeaders(),
      },
    })
      .then((r: any) => this.parseCookies(r))
      .then((r: any) => r && r.data);
  }
}

export default CFClient;

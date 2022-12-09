import yaml from "js-yaml";
import path from "path";
import fs from "fs";
import API from "./api";
import response from "@/middleware/response.mw";
import { head } from "request";

let config: any;
try {
  const filePath = path.resolve(__dirname, "../db", "user.yaml");
  const dbConfig = fs.readFileSync(filePath, "utf-8");
  config = yaml.load(dbConfig);
  config = config.strava;
} catch (e) {
  console.log(e);
}

export default {
  auth: async () => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${config.access_token}`);
    const request = new Request(API.auth, { headers });
    return await fetch(request).then((res) => res.json());
  },
};

// {
//   "id": 79931608,
//   "username": null,
//   "resource_state": 2,
//   "firstname": "克非",
//   "lastname": "栾",
//   "bio": null,
//   "city": "beijing",
//   "state": null,
//   "country": null,
//   "sex": "M",
//   "premium": false,
//   "summit": false,
//   "created_at": "2021-03-03T02:33:25Z",
//   "updated_at": "2022-11-21T00:22:38Z",
//   "badge_type_id": 0,
//   "weight": 56.0,
//   "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/79931608/22418909/1/medium.jpg",
//   "profile": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/79931608/22418909/1/large.jpg",
//   "friend": null,
//   "follower": null
// }

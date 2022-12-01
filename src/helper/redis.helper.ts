import { getConnection } from "../db/redis.db";

export function getKey(key: string, redisInst: string = "default") {
  const client = getConnection(redisInst);
  return client.get(key).catch((err: Error) => console.log("getKeyError", err));
}

export function setKey(key: string, value: string | number, expire: number = 0, redisInst: string = "default") {
  const client = getConnection(redisInst);
  if (expire) {
    return client.set(key, value, { EX: expire }).catch((err: Error) => console.log("setKeyError", err));
  } else {
    return client.set(key, value).catch((err: Error) => console.log("setKeyError", err));
  }
}

export function delKey(key: string, redisInst: string = "default") {
  const client = getConnection(redisInst);
  return client.del(key).catch((err: Error) => console.log("delKeyError", err));
}

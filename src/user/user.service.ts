// /**
//  * 用户相关服务
//  */
// import { getManager, Repository } from "typeorm";

// import { getKey, setKey, delKey } from "../helper/redis.helper";
// import { User } from "./user.entity";
// import { USER_HASH, USER_KEY } from "../constant/redis.constant";

// import { IUser } from "../interface/user.interface";

// // @Injectable()
// export class UserService {
//   private readonly userRepository: Repository<User>;

//   constructor() {
//     this.userRepository = getManager().getRepository(User);
//   }

//   create(user: IUser): Promise<User> {
//     const temp = new User();
//     temp.email = user.email;
//     temp.level = 0;
//     temp.nickname = user.nickname;
//     temp.password = user.password;
//     temp.salt = user.salt;
//     temp.username = user.username;
//     temp.avatar = user.avatar;

//     return this.userRepository.save(temp);
//   }

//   // 缓存30 + 1天
//   createUserNameHash(userNameHash: string, username: string): Promise<any> {
//     const hash = `${USER_HASH}_${userNameHash}`;
//     return setKey(hash, username, 86400 * 31);
//   }

//   async findOneFromHash(userNameHash: string): Promise<User | undefined> {
//     const key = `${USER_HASH}_${userNameHash}`;
//     const username = await getKey(key);

//     if (!username) throw new Error("memory cache expired.");
//     const user = await this.findOne(username);
//     return user;
//   }

//   async removeOneCache(username: string): Promise<any> {
//     const key = `${USER_KEY}_${username}}`;
//     return delKey(key);
//   }

//   async findOne(username: string): Promise<User | undefined> {
//     console.log("findOne start");
//     const key = `${USER_KEY}_${username}}`;
//     let userJSONStr = await getKey(key);
//     console.log("find user from redis", userJSONStr);
//     if (userJSONStr) {
//       try {
//         return JSON.parse(userJSONStr);
//       } catch (e) {
//         console.error("JSON parse error", e);
//       }
//     }

//     const user = await this.userRepository.findOne({ username });
//     console.log("findOne from db", user);
//     if (user) await setKey(key, JSON.stringify(user), 86400);

//     return user;
//   }

//   findAll(): Promise<User[]> {
//     return this.userRepository.find();
//   }
// }

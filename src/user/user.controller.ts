// /**
//  * 用户路由
//  */
// import crypto from "crypto";
// import { TypeORMError } from "typeorm";

// import { UserService } from "./user.service";
// import { IUser } from "../interface/user.interface";

// /**
//  * 生成随机字符串
//  * @param length 生成随机字符串的长度
//  */
// export function createNonceStr(length: number) {
//   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let str = "";
//   const charsLen = chars.length;
//   for (let i = 0; i < length; i++) {
//     const start = Math.floor(Math.random() * charsLen);
//     str = str + chars.slice(start, start + 1);
//   }
//   return str;
// }

// /*
//  * 10位盐
//  * 时间戳(2)+随机字母(8)
//  */
// const generateSalt = () => {
//   const suffix = Date.now() % 100;
//   const prefix = createNonceStr(8);

//   return prefix + suffix;
// };

// const md5 = (text) => {
//   return crypto.createHash("md5").update(String(text)).digest("hex");
// };

// const encrypt = (password, salt) => {
//   return md5(md5(password) + salt);
// };

// export class UserController {
//   private readonly userService: UserService;

//   constructor() {
//     this.userService = new UserService();
//   }

//   // @post @body
//   createUser(user: IUser): Promise<IUser> {
//     const salt = generateSalt();
//     const password = encrypt(user.password, salt);
//     user.password = password;
//     user.salt = salt;
//     return this.userService.create(user);
//   }

//   findOne(username: string): Promise<IUser> {
//     console.log("findOneControllerl", username);
//     return this.userService.findOne(username);
//   }

//   findOneFromHash(userNameHash: string): Promise<IUser> {
//     return this.userService.findOneFromHash(userNameHash);
//   }

//   findAll(): Promise<IUser[]> {
//     return this.userService.findAll();
//   }

//   removeOneCache(username: string): Promise<any> {
//     return this.userService.removeOneCache(username);
//   }

//   async validateUser(username: string, pass: string): Promise<IUser | null> {
//     const user = await this.findOne(username);

//     console.log("login 2 --------------", user);
//     console.log("login 3 --------------", user.password, encrypt(pass, user.salt));

//     if (user && user.password === encrypt(pass, user.salt)) {
//       delete user.password;
//       delete user.salt;
//       return user;
//     }
//     return null;
//   }

//   async login(username: string, password: string): Promise<string> {
//     let userNameHash = "";

//     try {
//       const result = await this.validateUser(username, password);
//       const salt = generateSalt();
//       userNameHash = encrypt(username, salt);

//       if (result === null) {
//         throw new TypeORMError("UnauthorizedException 401");
//       }

//       // hash 换 user
//       await this.userService.createUserNameHash(userNameHash, result.username);
//     } catch (e) {
//       console.error("TODO: logger error here", e);
//     }

//     return userNameHash;
//   }
// }

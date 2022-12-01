export interface IUser {
  uid: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  level: number;
  salt?: string;
  password?: string;
}

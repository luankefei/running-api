export type EnvMode = "dev" | "prod" | "pre";
export type EnvNodeEnv = "development" | "production";

export interface IMainOptions {
  root: string;
  env: EnvNodeEnv;
  mode: EnvMode;
  debug: boolean;
  port: number;
  miniProgram: {
    appID: string;
    appSecret: string;
  };
  route: {
    prefix: string;
    articleH5Path: string;
    wxH5Path: string;
    canvasApi: string;
    aliyun: string;
  };
  redis: {
    db: number;
    host: string;
    password: string;
    port: number;
  };
  mysqlDB: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    supportBigNumbers: boolean;
  };
  oss: any;
}

export interface IAppError {
  error_code: number;
  error_name: string;
  detail: string;
}

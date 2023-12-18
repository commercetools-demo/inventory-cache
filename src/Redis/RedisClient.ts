import {createClient} from "redis";

export interface Config {
  host: string;
  port: number;
}

export class RedisClient {
  private host: string;
  private port: number;

  constructor(config: Config) {
    this.host = config.host;
    this.port = config.port;
  }

  public getRedisClient(): any {
    const redisClient = createClient({
      socket: {
        host: this.host,
        port: this.port,
      },
    });
    redisClient.on("error", (err) => console.error("ERR:REDIS:", err));
    redisClient.connect();
    return redisClient;
  }
}

import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class SessionRedisService {
  private redisClient: Redis.Redis | Redis.Cluster;

  constructor() {
    this.redisClient = new Redis.Cluster(
      [
        { port: 7000, host: 'localhost' },
        { port: 7001, host: 'localhost' },
        { port: 7002, host: 'localhost' },
        { port: 7003, host: 'localhost' },
        { port: 7004, host: 'localhost' },
        { port: 7005, host: 'localhost' },
      ],
      //   {
      //     Redis options
      //     redisOptions: {
      //       Add any additional options if necessary
      //       like password, db, etc.
      //     }
      //   }
    );
    // Error handling
    this.redisClient.on('error', (error) => {
      console.error('Redis Error:', error);
    });

    this.redisClient.on('ready', () => {
      console.log('Redis client connected and ready');
    });
  }

  // Store the session token in Redis
  async setSession(userId: string, token: string): Promise<string | null> {
    await this.redisClient.set(`session:${userId}`, token); // Set with expiration (1 hour)
    return 'Session Saved';
  }

  // Retrieve the session token from Redis
  async getSession(userId: string): Promise<string | null> {
    return await this.redisClient.get(`session:${userId}`);
  }

  // Delete the session (optional, e.g., for logout)
  async deleteSession(userId: string): Promise<number | null> {
    return await this.redisClient.del(`session:${userId}`);
  }

  // Delete the blacklisted session (optional, e.g., for logout)
  async removeFromBlacklist(userId: string): Promise<number | null> {
    return await this.redisClient.del(`blacklist:${userId}`);
  }

  // Blacklist methods
  async addToBlacklist(userId: string, token: string): Promise<string | null> {
    await this.redisClient.sadd(`blacklist:${userId}`, token);
    return 'User Blacklisted';
  }

  //clear all data from session storage
  //   async clearAllData(): Promise<string | null> {
  //     try {
  //       await this.redisClient.flushall();
  //       return 'All data cleared from Redis cluster';
  //     } catch (error) {
  //       console.error('Error clearing Redis data:', error);
  //       return 'Error in redis cluster';
  //     }
  //   }
}

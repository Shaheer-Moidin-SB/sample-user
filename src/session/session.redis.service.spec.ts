import Redis from 'ioredis';

const redisClient = new Redis.Cluster([{ port: 6379, host: 'localhost' }]);

async function testRedis() {
  try {
    await redisClient.set('testKey', 'testValue');
    const value = await redisClient.get('testKey');
    console.log('Retrieved value:', value);
    await redisClient.del('testKey');
    console.log('Key deleted successfully');
  } catch (error) {
    console.error('Redis error:', error);
  } finally {
    redisClient.quit();
  }
}

testRedis();

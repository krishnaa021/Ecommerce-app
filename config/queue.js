const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

connection.on('connect', () => {
    console.log('Connected to Redis');
});

connection.on('error', (err) => {
    console.log('Redis connection error:', err.message);
});

const orderQueue = new Queue('order-tasks', { connection });

module.exports = { orderQueue, connection };
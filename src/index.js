import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import redis from 'redis';
import { CronJob } from 'cron';
import { taskController } from '../src/controllers/task';
import {
   userRouter, matterRouter, clientRouter, matterTypeRouter,
   updateRouter, taskRouter, updateTypeRouter, eventRouter
 } from '../src/routes';

 

dotenv.config();

const app = express();
app.use(cors());
app.use(logger('dev'));

export const redisClient = redis.createClient(process.env.REDIS_URL);

//Connection
redisClient.on('connect', function() {
   console.log('Redis client connected');
});

//Error
redisClient.on('error', function (err) {
   console.log('Something went wrong ' + err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 1600;

//invoke cronjob
const job = new CronJob('00 25 19 * * 1-5', function() {
	taskController.taskReminder();
});
job.start();

app.use(userRouter);
app.use(matterRouter);
app.use(clientRouter);
app.use(matterTypeRouter);
app.use(updateTypeRouter);
app.use(updateRouter);
app.use(taskRouter);
app.use(eventRouter);




// entry point of the application
app.get('*', (req, res) => res.status(200).send({
   message: 'Welcome to this API.'
}));
app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});
export default app;
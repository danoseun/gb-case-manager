import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import redis from 'redis';
import {
   userRouter, matterRouter, clientRouter, matterTypeRouter
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

app.use(userRouter);
app.use(matterRouter);
app.use(clientRouter);
app.use(matterTypeRouter);




// entry point of the application
app.get('*', (req, res) => res.status(200).send({
   message: 'Welcome to this API.'
}));
app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});
export default app;
var kue = require("kue");
var Queue = kue.createQueue();

export const scheduleJob = data => {
    console.log('here', data);
  Queue.createJob(data.jobName, data.params)
    .attempts(3)
    .delay(data.time - Date.now()) // relative to now.
    .save();
};




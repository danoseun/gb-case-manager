// var kue = require("kue");
// var Queue = kue.createQueue();
// import sgMail from '@sendgrid/mail'
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Queue.process("sendEmail", async function(job, done) {
//     console.log({job})
//   let { data } = job;
//   console.log({data});
//   await sgMail.send(data);
//   done();
// });
import {config} from 'dotenv';
import {quickAddJob} from 'graphile-worker';

// yarn ts-node-dev src/helloQueue/addJob.ts

config();

// Or add a job to be executed:
const app = async () => {
  for (let i = 0; i < 10; i++) {
    await quickAddJob(
      // makeWorkerUtils options
      {connectionString: process.env.DATABASE_URL},

      // Task identifier
      'hello',

      // Payload
      {name: 'Bobby Tables'},
    );
  }
};

app();

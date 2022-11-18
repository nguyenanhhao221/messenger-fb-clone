import Pusher from 'pusher';

const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
const PUSHER_KEY = process.env.PUSHER_KEY;
const PUSHER_SECRET = process.env.PUSHER_SECRET;
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER;
if (!PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER || !PUSHER_APP_ID) {
  throw new Error(`Key for PUSHER is not valid, please check your .env files `);
}

export const serverPusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
});

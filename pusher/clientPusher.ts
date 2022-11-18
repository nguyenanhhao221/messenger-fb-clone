import ClientPusher from 'pusher-js';

const PUSHER_CLIENT_SECRET = process.env.NEXT_PUBLIC_PUSHER_CLIENT_SECRET;
if (typeof PUSHER_CLIENT_SECRET === 'undefined') {
  throw new Error('Invalid client secret, please double check your .env file');
}
export const clientPusher = new ClientPusher(PUSHER_CLIENT_SECRET, {
  cluster: 'ap1',
  //force to use TLS connection
  // An application that uses TLS should use this option to ensure connection traffic is encrypted.
  forceTLS: true,
});

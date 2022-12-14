'use client';
import React, { useEffect, useRef } from 'react';
import { fetchMessages } from '../utils/fetchMessages';
import useSWR from 'swr';
import { MessageItem } from './MessageItem';
import type { TMessage } from '../type';
import { clientPusher } from '../pusher/clientPusher';
import type { Session } from 'next-auth';

type Props = {
  initialRoomMessages: TMessage[];
  session: Session;
  roomId: string;
};

export const MessageList = ({
  initialRoomMessages,
  roomId,
  session,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    data: messagesData,
    error,
    mutate,
  } = useSWR<TMessage[]>(`/api/getMessages/room/${roomId}`, fetchMessages);

  //  This will be used as a placeholder so that every time new message comes in, we will scroll to this div to make sure that we can see th latest message, otherwise user have to manually scroll down
  useEffect(() => {
    return bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  // Pusher, tell client to listen to event and update message data
  // subscribe to the channel ('message') this 'message' channel is determine in the Server
  // Before your web app can receive the event you publish, your web app needs to subscribe to the my-channel channel channel. Do this with pusher.subscribe.
  const channelName = 'message'; //update in case of changes
  const eventName = 'new-message';

  /**
   * When the component mount, establish a connection to the channel name and listen to the eventName.
   * Let's say we have 2 browser looking at the same chat, with the same account, the behavior we want is browser A send a message, browser B will see that same message
   * Keep in mind that this is the same account, we haven't implement message to other account yet in this stage
   * When a message is sent, for example in Client A, that message will be optimistic update through the ChatInput component of Client A, and also our server will tell Pusher , Pusher will tell all clients that currently subscribe to the channel (in this case client B & client A) "hey something happen"
   * We can use the .bind method to bind client to the eventName, this method accept the eventName to listen to and a function that will be called every-time some thing happen to that channel, this function also carry a parameter which is the "message" that was created.
   *
   * So the idea is we can use this function to update all client with the new message return from the channel.
   * But there is a catch, because Pusher cannot tell which one of the client is sending the message
   * For example, if we run this function on all client, the Client A which originally send the message, Pusher will also tell client A to run that function and will cause duplicate message again
   * So we need to check if the message id that was just created is already in the cache (because ChatInput of Client A will be optimistically updated with this new message), if this created message by Pusher is already exist in the cache, we don't return anything. If it is not, we run the function with the new message data and update the cache (in this case in client B)
   */
  useEffect(() => {
    const channel = clientPusher.subscribe(channelName);
    channel.bind(eventName, (newMessage: TMessage) => {
      const isSubscribeMessageExist = messagesData?.find(
        ({ id }) => id === newMessage.id
      );
      if (isSubscribeMessageExist) return;

      // If messageData doesn't exist, call the api to load the message
      if (!messagesData) return fetchMessages;

      mutate([...messagesData, newMessage], { rollbackOnError: true });
    });
    // Clean up, unsubscribe to avoid open connection
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messagesData, mutate]);

  if (error) {
    console.error(error);
    return <div>Something wrong: </div>;
  }

  return (
    <div className="mx-auto space-y-4 px-4 pb-32 md:w-[90vw] ">
      {(messagesData || initialRoomMessages)?.map(
        (message, index, messageArr) => (
          <div key={message.id}>
            <MessageItem
              session={session}
              message={message}
              lastItem={index === messageArr.length - 1 ? true : false}
            />
          </div>
        )
      )}
      <div ref={bottomRef} className="bottom-div"></div>
    </div>
  );
};

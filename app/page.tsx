import React from 'react';
import { ChatInput } from '../components/ChatInput';
import { MessageList } from '../components/MessageList';

const HomePage = () => {
  return (
    <main>
      {/* MessageList */}
      <MessageList />
      {/* ChatInput */}
      <ChatInput />
    </main>
  );
};

export default HomePage;

import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';
import React from 'react';
import MessengerLogo from '../public/logo/logo-1024.png';
import { SignOutButton } from './SignOutButton';

export const Header = async () => {
  const session = await unstable_getServerSession();

  if (session) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 mx-auto bg-black md:w-[90%]">
        <h1 className="text-center text-2xl">Facebook Messenger</h1>
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex gap-2">
            <Image
              alt="Facebook messenger"
              src={MessengerLogo}
              className="h-12 w-12"
              priority
              placeholder="blur"
            />
            <div className="flex flex-col items-center">
              <p className="text-fb-blue">Logged in as:</p>
              <p className="font-bold">{session.user?.name}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </header>
    );
  }
  return <div className="sr-only">Please Log In</div>;
};

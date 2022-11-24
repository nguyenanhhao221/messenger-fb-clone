import React from 'react';
import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import MessengerLogo from '../public/logo/logo-1024.png';

type Props = {
  userId: string;
};

export const Header = async ({ userId }: Props) => {
  const session = await unstable_getServerSession();

  if (session) {
    return (
      <header className="sticky top-0 left-0 right-0 z-50 mx-auto bg-black md:w-[90%]">
        {/* <h1 className="text-center text-xl">Chats</h1> */}
        <div className="flex items-center justify-between gap-4 p-2">
          <Link href={'/'}>
            <h1 className="sr-only">Facebook Messenger</h1>
            <Image
              src={MessengerLogo}
              alt="Facebook Messenger"
              className="h-12 w-12"
            />
          </Link>
          <Link href={`/user/${userId}`} className="flex gap-2">
            <Image
              alt="Facebook messenger"
              src={session.user?.image || MessengerLogo}
              className="h-10 w-10 rounded-full"
              width={200}
              height={200}
              priority
            />
          </Link>
        </div>
      </header>
    );
  }
  return <div className="sr-only">Please Log In</div>;
};

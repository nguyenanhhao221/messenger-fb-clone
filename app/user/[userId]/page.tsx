import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import { SignOutButton } from '../../../components/SignOutButton';
import { client } from '../../../redis/redis';
import Link from 'next/link';
import { TypeUser } from '../../../utils/getUserInfo';

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const session = await unstable_getServerSession();
  if (
    !session ||
    !session.user ||
    typeof session.user.image !== 'string' ||
    typeof session.user.email !== 'string'
  ) {
    redirect('/auth/signin');
  }

  //Check if the userId in the params match the current user id in redis database, if not, redirect
  const getIdFromDB = await client.get(`email:${session.user.email}`);
  if (!getIdFromDB) {
    redirect('/auth/signin');
  }
  const idFromDB = TypeUser.parse(JSON.parse(getIdFromDB)).id;
  if (!idFromDB) {
    redirect('/auth/signin');
  }
  // userId from the url
  const userId = params.userId;

  if (userId !== idFromDB) {
    return (
      <main className="flex h-screen w-screen flex-col items-center justify-center gap-4 text-center">
        <p>You are not authorized to view this page</p>
        <Link href="/" className="authentication-button">
          Home Page
        </Link>
      </main>
    );
  }

  return (
    <main>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <Image
          alt="user avatar"
          width={144}
          height={144}
          src={session.user.image}
          className="h-36 w-36 rounded-full"
        />
        <h2 className="text-center text-2xl font-bold">{session.user.name}</h2>
        <SignOutButton />

        <Link href="/" className="authentication-button">
          Home Page
        </Link>
      </div>
    </main>
  );
};

export default UserPage;

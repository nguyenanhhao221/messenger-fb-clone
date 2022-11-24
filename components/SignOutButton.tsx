'use client';
import { signOut } from 'next-auth/react';

export const SignOutButton = () => {
  return (
    <button
      type="button"
      className="authentication-button py-2 px-4"
      onClick={async () => await signOut({ callbackUrl: '/' })}
    >
      Sign Out
    </button>
  );
};

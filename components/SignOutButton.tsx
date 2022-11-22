'use client';
import { signOut } from 'next-auth/react';

export const SignOutButton = () => {
  return (
    <button
      type="button"
      className="authentication-button"
      onClick={async () => await signOut({ callbackUrl: '/' })}
    >
      Sign Out
    </button>
  );
};

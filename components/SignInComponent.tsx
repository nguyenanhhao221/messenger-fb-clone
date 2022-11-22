'use client';
import React from 'react';
import { signIn } from 'next-auth/react';
import type { getProviders } from 'next-auth/react';

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};

export const SignInComponent = ({ providers }: Props) => {
  if (!providers) return <div>Cannot get providers</div>;

  //Go through the providers, which providers is configured on the server(in this case facebook) will show up
  return (
    <div>
      {Object.values(providers).map((provider) => (
        <button
          key={provider.id}
          type="button"
          className="authentication-button"
          onClick={() => signIn(provider.id, { callbackUrl: '/' })}
        >
          Sign in with {provider.name}
        </button>
      ))}
    </div>
  );
};

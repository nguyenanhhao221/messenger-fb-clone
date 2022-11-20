import { getProviders } from 'next-auth/react';
import Image from 'next/image';
import { SignInComponent } from '../../../components/SignInComponent';
import MessengerLogo from '../../../public/logo/logo-1024.png';

const SignInPage = async () => {
  //A list with configured providers on the server, in this case only facebook
  const providers = await getProviders();
  return (
    <main className="grid h-screen w-screen place-content-center gap-4">
      <div className="flex justify-center">
        <Image
          alt="Facebook messenger"
          src={MessengerLogo}
          className="h-32 w-32"
          priority
          placeholder="blur"
        />
      </div>
      <div>
        <SignInComponent providers={providers} />
      </div>
    </main>
  );
};

export default SignInPage;

import Image from "next/image";
import React from "react";
import MessengerLogo from "../public/logo/logo-1024.png";
import { LogoutButton } from "./LogoutButton";

export const Header = () => {
  //TODO : Apply real session with Authentication later
  const session = true;

  //TODO : Implement real data by logged in with facebook
  const dummyUser = {
    id: "randomID",
    name: "Hao Nguyen",
  };

  if (session) {
    return (
      <header>
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
              <p className="font-bold">{dummyUser.name}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>
    );
  }
  return <div> Need to login</div>;
};

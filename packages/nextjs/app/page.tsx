"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="container mx-auto my-auto">
      <h1 className="text-4xl font-bold text-center my-8">Home</h1>
      <div className="flex flex-col md:flex-row">
        
      </div>
    </div>
  );
};

export default Home;

"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";

function getNFTdata(address: string) {
  const nftData = {
    "0xE628Ad5cDDF40B4C338b672c7FC430A0095ae24f": [0],
    "0x281C38613CB5806090C5f6A37F4256E7e9B659b8": []
  };
  return nftData;
}


function getNFTs(address: string) {
  const nfts = {
    "0xE628Ad5cDDF40B4C338b672c7FC430A0095ae24f": [0],
    "0x281C38613CB5806090C5f6A37F4256E7e9B659b8": []
};
  return nfts;
}

function RenderNFTs({ address }: { address: string }) {
  const abiClosedSea = deployedContracts["11155111"]['ClosedSea']['abi'];
  const addressClosedSea = deployedContracts["11155111"]['ClosedSea']['address'];

  const nfts: { [key: string]: number[] | never[] } = getNFTs(address);
  let l = []
  for (const address in nfts) {
    for (const tokenId of nfts[address]) {
      l.push(getNFTdata(address, tokenId));


    }
  }
  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        
      </div>
    );
}

const Marketplace: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  if (!connectedAddress) return <></>;
  return (
      <div className="container mx-auto my-auto">
          <h1 className="text-4xl font-bold text-center">Marketplace</h1>
          <br />
          <RenderNFTs address={connectedAddress} />
      </div>
  );
};

export default Marketplace;
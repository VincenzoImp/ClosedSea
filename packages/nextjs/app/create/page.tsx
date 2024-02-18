"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { getDefaultProvider } from 'ethers';
import { Contract } from 'ethers';

async function getUserData(address: string, abiClosedSea: any) {
    const provider = getDefaultProvider()
    const contract = new Contract(address, abiClosedSea, provider);
    const userData = await contract.getUserData(address);
    return userData;
}

async function postImage(selectedFile: any) {
    // upload file to IPFS
    const url = "ipfs.io/ipfs/QmRP9FVznm1xxa3FEsDENXhafRDaRWY6LKQdg8GygHNHKw/267.png";
    return url;
}

async function postMetadata(metadata: any) {
    // upload metadata to IPFS
    const url = "https://ipfs.io/ipfs/QmSaY9zZnKWGa8jmMFNN6LrDGykjSiryUz8YeUjjJ97A8w/267.json";
    return url;
}

async function mintNFT(results: any) {
    results.preventDefault();
    const file = results.target[0].files[0];
    const price = results.target[1].value;
    const trait1Name = results.target[2].value;
    const trait1Value = results.target[3].value;
    const trait2Name = results.target[4].value;
    const trait2Value = results.target[5].value;
    console.log(file, price, trait1Name, trait1Value, trait2Name, trait2Value);
    //check if the file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image');
        return;
    }
    // check valid price 
    if (price <= 0) {
        alert('Please enter a valid price');
        return;
    }
    // upload image to IPFS with pinada api in .env
    const url = postImage(file);
    if (!url) {
        alert('Error uploading image');
        return;
    }
    // create metadata
    const metadata = {
        name: file.name,
        description: "NFT created with ClosedSea",
        external_url: url,
        attributes: [
            {
                trait_type: trait1Name,
                value: trait1Value
            },
            {
                trait_type: trait2Name,
                value: trait2Value
            }
        ]
    };
    // upload metadata to IPFS
    const metadataUrl = postMetadata(metadata);
    if (!metadataUrl) {
        alert('Error uploading metadata');
        return;
    }
    // create NFT
    const { address: connectedAddress } = useAccount();
    const abiClosedSea = deployedContracts["11155111"]['ClosedSea']['abi'];
    const addressClosedSea = deployedContracts["11155111"]['ClosedSea']['address'];
    const provider = getDefaultProvider();
    const signer = (provider as any).getSigner(connectedAddress);
    let contract = new Contract(addressClosedSea, abiClosedSea, provider);
    contract = contract.connect(signer); 
    const tx = await contract.mintNFT(metadataUrl, price, "2", "$");
    await tx.wait();
}

function CreateForm() {
    return (
        <form onSubmit={mintNFT}>
            <div className="flex flex-col items-center">
                <input type="file" className="file-input file-input-bordered file-input-m w-full max-w-xs" required/>
                <br />
                <label>Price $</label>
                <input type="number" placeholder="Amount" className="input input-bordered input-m w-full max-w-xs" required/>
                <br />
                <label>Trait 1</label>
                <input type="text" placeholder="Name" className="input input-bordered input-m w-full max-w-xs" required/>
                <input type="text" placeholder="Value" className="input input-bordered input-m w-full max-w-xs" required/>
                <br />
                <label>Trait 2</label>
                <input type="text" placeholder="Name" className="input input-bordered input-m w-full max-w-xs" required/>
                <input type="text" placeholder="Value" className="input input-bordered input-m w-full max-w-xs" required/>
                <br />
                <button type="submit" className="btn btn-primary btn-m w-full max-w-xs">Create</button>
                
            </div>
        </form>
        
    );
}

const Create: NextPage = () => {

    const abiClosedSea = deployedContracts["11155111"]['ClosedSea']['abi'];
    const { address: connectedAddress } = useAccount();
    if (!connectedAddress) return <></>
    
    const userData = getUserData(connectedAddress, abiClosedSea);
    if (!userData) return <></>;

    const collectionAddress = Object.values(userData)[0];
    console.log(collectionAddress);
    if (collectionAddress === "0x0000000000000000000000000000000000000000") {
        return (
            <div className="container mx-auto my-auto">
                <h1 className="text-4xl font-bold text-center">Create</h1>
                <br />
                <p className="text-center">You are not the permission to create NFTs</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-auto">
            <h1 className="text-4xl font-bold text-center">Create</h1>
            <br />
            <CreateForm />
        </div>
    );
};

export default Create;

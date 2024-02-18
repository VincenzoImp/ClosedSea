"use client";

import type { NextPage } from "next";

function CreateForm() {
    return (
        <form className="flex flex-col w-full md:w-1/2">
            <label className="text-lg font-bold">File</label>
            <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
        </form>
    );
}

const Create: NextPage = () => {

    const connectedAddress = getConnectedAddress();
    if (!connectedAddress) return <></>

    const userData = getUserData(connectedAddress);
    if (!userData) return <></>
    const collectionAddress = Object.values(userData)[0];
    if (collectionAddress === "0x0000000000000000000000000000000000000000") return <></>

    return (
        <div className="container mx-auto my-auto">
            <h1 className="text-4xl font-bold text-center">Create {collectionAddress}</h1>
            <div className="container text-center">
                <CreateForm />
            </div>
        </div>
    );
};

export default Create;

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ****************************************************
// Imports
// ****************************************************
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Collection.sol";
// ****************************************************

// ****************************************************
// Main contract
// ****************************************************
contract ClosedSea is Ownable, IERC721Receiver {
	// ****************************************************
	// Libraries
	// ****************************************************
	using Address for address;
	// ****************************************************

	// ****************************************************
	// Events
	// ****************************************************
	event collectionCreated(
		address collectionAddress,
		string name,
		string symbol
	);
	event userAdded(
		address userAddress,
		address collectionAddress,
		string name,
		string website,
		string email
	);
	event userWebsiteUpdated(address userAddress, string website);
	event userEmailUpdated(address userAddress, string email);
	event NFTMinted(address collectionAddress, uint256 tokenId, string uri);
	event dynamicNFTDataUpdated(
		address collectionAddress,
		uint256 tokenId,
		uint256 sellingPrice,
		uint256 decimals,
		string currency
	);
	event NFTBurned(address collectionAddress, uint256 tokenId);
	event NFTSold(address collectionAddress, address to, uint256 tokenId);
	// ****************************************************

	// ****************************************************
	// Modifiers
	// ****************************************************
	modifier onlyUser() {
		require(
			userData[_msgSender()].collectionAddress != address(0),
			"You are not a user"
		);
		_;
	}

	modifier onlyForSaleNFT(address collectionAddress, uint256 tokenId) {
		Collection collection = Collection(collectionAddress);
		require(
			collection.ownerOf(tokenId) == address(this),
			"NFT is not for sale"
		);
		_;
	}
	// ****************************************************

	// ****************************************************
	// Structs
	// ****************************************************
	struct UserData {
		address collectionAddress;
		string name;
		string website;
		string email;
	}

	struct DynamicNFTData {
		uint256 sellingPrice;
		uint256 decimals;
		string currency;
	}
	// ****************************************************

	// ****************************************************
	// Mapping
	// ****************************************************
	mapping(address => UserData) internal userData;
	mapping(address => mapping(uint256 => DynamicNFTData))
		internal dynamicNFTData;
	// ****************************************************

	// ****************************************************
	// Mandatory functions
	// ****************************************************
	constructor(address initialOwner) Ownable(initialOwner) {}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) external pure returns (bytes4) {
		return IERC721Receiver.onERC721Received.selector;
	}
	// ****************************************************

	// ****************************************************
	// Owner functions
	// ****************************************************
	function addUser(
		address userAddress,
		string memory userName,
		string memory userWebsite,
		string memory userEmail,
		string memory collectionName,
		string memory collectionSymbol
	) external onlyOwner {
		require(
			userData[userAddress].collectionAddress == address(0),
			"User already exists"
		);
		address collectionAddress = address(
			new Collection(address(this), collectionName, collectionSymbol)
		);
		userData[userAddress] = UserData(
			collectionAddress,
			userName,
			userWebsite,
			userEmail
		);
		emit collectionCreated(
			collectionAddress,
			collectionName,
			collectionSymbol
		);
		emit userAdded(
			userAddress,
			collectionAddress,
			userName,
			userWebsite,
			userEmail
		);
	}

	function transferNFT(
		address collectionAddress,
		address to,
		uint256 tokenId
	) external onlyOwner onlyForSaleNFT(collectionAddress, tokenId) {
		Collection collection = Collection(collectionAddress);
		collection.safeTransferFrom(address(this), to, tokenId);
		emit NFTSold(collectionAddress, to, tokenId);
	}
	// ****************************************************

	// ****************************************************
	// User functions
	// ****************************************************
	function updateUserWebsite(string memory newUserWebsite) external onlyUser {
		userData[_msgSender()].website = newUserWebsite;
		emit userWebsiteUpdated(_msgSender(), newUserWebsite);
	}

	function updateUserEmail(string memory newUserEmail) external onlyUser {
		userData[_msgSender()].email = newUserEmail;
		emit userEmailUpdated(_msgSender(), newUserEmail);
	}

	function mintNFT(
		string memory uri,
		uint256 sellingPrice,
		uint256 decimals,
		string memory currency
	) external onlyUser {
		address collectionAddress = userData[_msgSender()].collectionAddress;
		Collection collection = Collection(collectionAddress);
		uint256 tokenId = collection.safeMint(address(this), uri);
		dynamicNFTData[collectionAddress][tokenId] = DynamicNFTData(
			sellingPrice,
			decimals,
			currency
		);
		emit NFTMinted(collectionAddress, tokenId, uri);
		emit dynamicNFTDataUpdated(
			collectionAddress,
			tokenId,
			sellingPrice,
			decimals,
			currency
		);
	}

	function burnNFT(
		uint256 tokenId
	)
		external
		onlyUser
		onlyForSaleNFT(userData[_msgSender()].collectionAddress, tokenId)
	{
		address collectionAddress = userData[_msgSender()].collectionAddress;
		Collection collection = Collection(collectionAddress);
		collection.burn(tokenId);
		delete dynamicNFTData[collectionAddress][tokenId];
		emit NFTBurned(collectionAddress, tokenId);
	}

	function updateDynamicNFTData(
		uint256 tokenId,
		uint256 sellingPrice,
		uint256 decimals,
		string memory currency
	)
		external
		onlyUser
		onlyForSaleNFT(userData[_msgSender()].collectionAddress, tokenId)
	{
		address collectionAddress = userData[_msgSender()].collectionAddress;
		dynamicNFTData[collectionAddress][tokenId] = DynamicNFTData(
			sellingPrice,
			decimals,
			currency
		);
		emit dynamicNFTDataUpdated(
			collectionAddress,
			tokenId,
			sellingPrice,
			decimals,
			currency
		);
	}
	// ****************************************************

	// ****************************************************
	// Call functions
	// ****************************************************
	function getUserData(
		address userAddress
	)
		external
		view
		returns (address, string memory, string memory, string memory)
	{
		return (
			userData[userAddress].collectionAddress,
			userData[userAddress].name,
			userData[userAddress].website,
			userData[userAddress].email
		);
	}

	function getDynamicNFTData(
		address userAddress,
		uint256 tokenId
	) external view returns (uint256, uint256, string memory) {
		address collectionAddress = userData[userAddress].collectionAddress;
		return (
			dynamicNFTData[collectionAddress][tokenId].sellingPrice,
			dynamicNFTData[collectionAddress][tokenId].decimals,
			dynamicNFTData[collectionAddress][tokenId].currency
		);
	}
	// ****************************************************
}

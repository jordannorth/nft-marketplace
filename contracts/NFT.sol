//SPDX-License-Identifier: MIT
//Declare solidity version, should be same as in the hardhat config
// Pragma specifies the compiler version to be sued for the solidity file
pragma solidity ^0.8.4;

// Specifiying imports that we yarn installed when setting up the project
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    // Used to increment
    using Counters for Counters.Counter;
    // Token id defined with weird syntax as this should maybe auto increment
    Counters.Counter private _tokenIds;
    // Address of contract we will be interacting with
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        // Starting from 0 first token id will be 1
        _tokenIds.increment();
        //In solidity this is an unisgned(only positive values) int and is 256 bits in size
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);

        return newItemId;
    }

        // Function used for getting the listing price from the front end of the app, similar setup to oop but you give return type then the variable inside
    function getTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }
}

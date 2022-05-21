const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    // We want to simulate deploying the contracts and creating an nft 
    // Not 100% sure what this line does 
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    // Setup the same thing with the NFT this time
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    // Not sure where this listing price method is coming from 
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    // Create the NFT
    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    // List the NFT on the market
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    // Working with the ether library to get test accounts to use, not sure about how this has been declared although it is javascript (Maybe using the _ to say that the array is private)
    const [_, buyerAddress] = await ethers.getSigners()

    // We want to use the buyer address to the connect to the market and process a sale 
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    // Get all the items listed on the market 
    let items = await market.fetchMarketItems()

    // Not sure why we are mapping this but it is causing some sort of issue 
    // Mapping the token uri for some reason
    items = await Promise.all(items.map(async i => {
      // This line doesn't work, not sure why 
      // const tokenUri = await nft.tokenURI(0)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        test: i
       // tokenUri
      }
     
      return item;      
    }))


    // Output a list of all these items to the console as we have no front end yet
    console.log('items: ', items)
  });
});

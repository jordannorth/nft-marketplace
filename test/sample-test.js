const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
    // We want to simulate deploying the contracts and creating an nft
    // Not 100% sure what this line does
    const Market = await ethers.getContractFactory('NFTMarket');
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    // Setup the same thing with the NFT this time
    const NFT = await ethers.getContractFactory('NFT');
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    // This method is from within our contract where we have set listing price to 0.25 ether
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    // Create the NFT
    let tokenId = await nft.createToken('https://www.mytokenlocation.com'); // Should have token id 1
    var tok1 = await nft.getTokenId();
    console.log(tok1.toString());
    var tokenId2 = await nft.createToken('https://www.mytokenlocation2.com'); // Should have token id 2
    var tok2 = await nft.getTokenId();
    console.log(tok2.toString());

    // List the first NFT on the market
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });

    var numberOfItems = await market.getNumberOfItemsInMarketplace();
    console.log('Items in the marketplace: ' + numberOfItems.toString());

    var mark = await market.returnSpecifiedItem(1);
    console.log('The first marketItem' + mark);

    var mark = await market.returnSpecifiedItem(0);
    console.log('The test marketItem' + mark);

    // List the second NFT on the market
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    numberOfItems = await market.getNumberOfItemsInMarketplace();
    console.log('Items in the marketplace: ' + numberOfItems.toString());

    var mark = await market.returnSpecifiedItem(2);
    console.log('The test marketItem' + mark);

    let test = await market.fetchMarketItems();

    console.log(test);

    // Working with the ether library to get test accounts to use, not sure about how this has been declared although it is javascript (Maybe using the _ to say that the array is private)
    const [firstAddress, buyerAddress, thirdAddress] =
      await ethers.getSigners();

    // We want to use the buyer address to connect to the market and process a sale
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    // Get all the items listed on the market
    let items = await market.fetchMarketItems();

    // Not sure why we are mapping this but it is causing some sort of issue
    // Mapping the token uri for some reason
    items = await Promise.all(
      items.map(async (i) => {
        // This line doesn't work, not sure why
        // const tokenUri = await nft.tokenURI(0)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          test: i,
          // tokenUri
        };

        return item;
      })
    );

    // Output a list of all these items to the console as we have no front end yet
    console.log('items: ', items);
  });
});

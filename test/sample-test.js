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
    var tokenId2 = await nft.createToken('https://www.mytokenlocation2.com'); // Should have token id 2

    // List the first NFT on the market
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });

    // List the second NFT on the market
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    numberOfItems = await market.getNumberOfItemsInMarketplace();
    console.log('Items in the marketplace: ' + numberOfItems.toString());

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
        // Token uri built into ERC721
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          test: i,
          tokenUri,
        };

        return item;
      })
    );

    // Output a list of all these items to the console as we have no front end yet
    console.log('items: ', items);
  });
});

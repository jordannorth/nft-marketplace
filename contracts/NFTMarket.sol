//SPDX-License-Identifier: MIT
//Declare solidity version, should be same as in the hardhat config
// Pragma specifies the compiler version to be sued for the solidity file
pragma solidity ^0.8.4;

// Specifiying imports that we yarn installed when setting up the project
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// Allows us to protect transactions talking to a seperate contract
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.25 ether;

    // Constructor stating that the owner of this contract is the person who deployed it which will be the contract address?
    constructor() {
        owner = payable(msg.sender);
    }

    //Struct is basically a class in solidity
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // Hash table that stores data as key value pairs
    // Below we have said market item can be represented by the int idToMarketItem which allows for better access
    mapping(uint256 => MarketItem) private idToMarketItem;

    // Allows us to ommit an event everytime someone creates a new marketItem, not sure why you can't references the struct above somehow but anyway
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // Function used for getting the listing price from the front end of the app, similar setup to oop but you give return type then the variable inside
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getNumberOfItemsInMarketplace() public view returns (uint256) {
        return _itemIds.current();
    }

    // This code       public
    //    payable
    //   nonReentrant
    // Is a modifier for a function
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        // Require statements gurantee validity of conditions that cannot be executed before execution
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        // Auto increment ids
        _itemIds.increment();

        // Get the current id
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // Transfer ownership of nft to the contract itself
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // Function to sell an item
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        // declare local variables, not 100% sure how
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        //Somehow msg.value is storing the price
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        // Transfer the value from msg.value to the seller
        idToMarketItem[itemId].seller.transfer(msg.value);
        // Then transfer the ownership to the sender
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        // Update the owner of the item to be the msg sender who has just bought the item
        idToMarketItem[itemId].owner = payable(msg.sender);
        // Mark item as sold
        idToMarketItem[itemId].sold = true;
        //Increment the number sold
        _itemsSold.increment();
        // Transfer some money to the owner via commision, not sure why it's the list price instead of a flat fee or percentage
        payable(owner).transfer(listingPrice);
    }

    // Creating functions to allow us to access the various things about the market ot display on the front end of the app
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        // Memory used as we don't need the data to persist, not sure why the variables haven't been declared with memory?
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        // Looping through the items to find the ones that aren't sold
        for (uint256 i = 1; i <= itemCount; i++) {
            if (idToMarketItem[i].owner == address(0)) {
                uint256 currentId = idToMarketItem[i].itemId;
                // Not sure why this is being stored in storage, maybe a limitation with adding it to the array if it's in memory
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    // Creating functions to allow us to access the various things about the market ot display on the front end of the app
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        // Looping through the items to find the number that isn't sold so we can create the array as we can't dynamically do this
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function fetchItemCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        // Loop through to get the number of items that were created in order to create the array, you may have bought the item then sold it so you didn't actually craete it
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                uint256 currentId = idToMarketItem[i].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }
}

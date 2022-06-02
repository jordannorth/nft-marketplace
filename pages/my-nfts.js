import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import MarketPlace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import axios from 'axios';

export default function myNfts() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNfts();
  });

  async function loadNfts() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // Nfts that you have listed on the market place

    const marketContract = new ethers.Contract(
      nftMarketAddress,
      MarketPlace.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        // Token uri built into ERC721
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // Get the meta data with axios
        const meta = await axios.get(tokenUri);
        // Format the price
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState('loaded');
  }

  if (loadingState === 'loaded' && !nfts.length)
    return (
      <div className='flex w-full h-full items-center justify-center allign-middle'>
        <h1 className='text-3xl'>You don't currently own any nfts 🐑</h1>
      </div>
    );
}

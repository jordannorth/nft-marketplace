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
    loadNFTs();
  }, []);

  async function loadNFTs() {
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
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    console.log(items);
    setLoadingState('loaded');
  }

  if (loadingState === 'loaded' && !nfts.length)
    return (
      <div className='flex w-full h-full items-center justify-center allign-middle'>
        <h1 className='text-3xl'>You don't currently own any nfts 🐑</h1>
      </div>
    );

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px' }}>
        {/* Responsive design elements with tailwind */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4 gap-2'>
          {nfts.map((nft, i) => (
            <div
              key={i}
              className='border shadow rounded-xl overflow-hidden bg-white'
            >
              <img src={nft.image} />
              <div className='p-4'>
                <p
                  style={{ height: '64px' }}
                  className='text-2xl font-semibold'
                >
                  {nft.name}
                </p>
                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <p className='text-gray-400'>{nft.description}</p>
                </div>
              </div>
              <div className='p-4'>
                <div className='border-t-2 pt-2'>
                  <p className='text-2xl mb-4 font-bold text-gray-400'>
                    {nft.price} Matic
                  </p>
                  <button
                    className='w-full text-white font-bold py-2 px-12 rounded'
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import MarketPlace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);

  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTS();
  }, []);

  async function loadNFTS() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftMarketAddress,
      MarketPlace.abi,
      signer
    );

    const data = await marketContract.fetchMarketItems();

    console.log('This is the data: ' + data);

    const items = await Promise.all(data.map(async (i) => {}));
    const soldItems = items.filter((i) => {
      console.log('This is i ' + i);
      i.sold;
    });

    setSold(soldItems);
    setNfts(items);
    setLoadingState('loaded');
  }

  if (loadingState === 'loaded' && !nfts.length)
    return (
      <div className='flex w-full h-full items-center justify-center allign-middle'>
        <h1 className='text-3xl'>No NFTs created 🐢</h1>
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

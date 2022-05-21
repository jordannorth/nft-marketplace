//Ethers library will need looked at in more detail 
import { ethers } from 'ethers'
// Hooks for local state 
import { useEffect, useState } from 'react'
// Data fetching library
import axios from 'axios'
// Used to give that dropdown that we see where you can connect your wallet through metamask, walletconnect etc
import Web3Modal from "web3modal"

// Import addresses from the config 
import {
  nftAddress, nftMarketAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import MarketPlace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  // Not sure on the syntax here or how it works, will need to find this out
  const[nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  // Used in react to show that the component must do something after render 
  useEffect(() => {
    loadNFTs()
  },[])

  async function loadNFTs() {
    // Using ethers library to get RPC providers 
    const provider = new ethers.providers.JsonRpcProvider()
    // Used to connect to the token contract
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    // Used to connect to the market contract
    const marketContract = new ethers.Contract(nftMarketAddress, MarketPlace.abi, provider)
    // Now able to call the market contract to fetch the items 
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      // Making use of the ether library again 
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))

    // Still unsure about syntax and how it works here 
    setNfts(items)
    setLoadingState('loaded')
  }

  async function buyNft(nft) {
    const web3modal = new Web3Modal()
    const connection = web3modal.connect()
    // Again not sure on the ether references 
    const provider = new ethers.providers.Web3Provider(connection)

    // Prompting user to accept the interaction 
    const signer = provider.getSigner()
    // Calling the same ether library however this time we are passing in the signer as the final argument as opposed to the provider 
    const contract = new ethers.Contract(nftMarketAddress, MarketPlace.abi, signer)

    // Gets price and parses it to a much more readable format
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    // Wait for transaction to finish 
    await transaction.wait()
    loadNFTs()
  }

  // Now checking thr loaded state and the nft array length 
  if(loadingState === 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No items in the marketplace</h1>
  )

  return (
    <div className="flex justify-center">
     <div className='px-4' style={{maxWidth: '1600px'}}>
       {/* Responsive design elements with tailwind */}
       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4'>

       </div>
       </div>
    </div>
  )
}

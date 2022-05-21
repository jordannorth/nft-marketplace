import { useState } from 'react'
import { ethers } from 'ethers'
// Allows us to interact with ipfs to upload and download files
import { create as ipfsHttpClient } from 'ipfs-http-client'
// Allows us to route 
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftAddress, nftMarketAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import MarketPlace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]

        try {
            const added = await client.add(file,
                // used to track the progress
                {
                    progress: (prog) => console.log('received: ${prog}')
                }
            )
            // Url of where the image has been stored 
            const url = 'https://ipfs.infura.io/ipfs/${added.path}'
            setFileUrl(url)
        } catch (e) {
            console.log(e)
        }

    }

    async function createItem() {
        const { name, description, price } = formInput

        // If these values aren't available then we don't want to allow listing
        if (!name || !description || !price || !fileUrl) return

        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        try {
            const added = await client.add(data,
                // used to track the progress
                {
                    progress: (prog) => console.log('received: ${prog}')
                }
            )
            // Url of where the image has been stored 
            const url = 'https://ipfs.infura.io/ipfs/${added.path}'
            createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale() {
        // Process of connecting wallet
        const web3modal = new web3modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        // End 

        let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.pareseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(nftMarketAddress, MarketPlace.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(nftAddress, tokenId, price, { value: listingPrice })
        await transaction.wait()

        // Send back to main page 
        router.push('/')

    }

    return (
        <div className='flex justify-center'>
            {/* Creating a form to allow users to specify the asset */}
            <div className='w-1/2 flex flex-col pb-12'>
                <input
                    placeholder='Asset Name'
                    className='mt-8 border rounded p-4'
                    // Will return the contents of the form and update only the name
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder='Asset Description'
                    className='mt-2 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                    placeholder='Asset Price in Matic'
                    className='mt-2 border rounded p-4'
                    // Will return the contents of the form and update only the name
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input
                    type='file'
                    name='Asset'
                    className='my-4'
                    onChange={onChange}
                />
                {
                    fileUrl && (<img className='rounded mt-4' width='350' src={fileUrl}/>)
                }
                <button onClick={createItem} className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'>
                    Create Digital Asset
                </button>
            </div>
        </div>

    )
}

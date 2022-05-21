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


    }

}

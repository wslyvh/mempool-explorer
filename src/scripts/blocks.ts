import dotenv from 'dotenv'
import { getProvider } from 'utils/web3'

dotenv.config()

Run()

async function Run() {
    console.log('Listen for new blocks..')

    const provider = getProvider()
    provider.on('block', async (blockNr: number) => {
        console.log('On block', blockNr)
        const newBlock = await provider.getBlock(blockNr)
        console.log('New block', newBlock.number, newBlock.hash)
    })
}
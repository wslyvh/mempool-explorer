import dotenv from 'dotenv'
import fs from 'fs'
import { getProvider } from 'utils/web3'

dotenv.config()

Run()

async function Run() {
    console.log('Fetch txpool_content..')

    const provider = getProvider()
    const poolContent = await provider.send('txpool_content', [])

    const filePath = `./src/data/txpool_content_${Date.now()}.json`
    console.log('saving pool content to', filePath)
    fs.writeFileSync(filePath, JSON.stringify(poolContent, null, 2))
}
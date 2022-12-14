import { Block } from "@ethersproject/abstract-provider"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import { getProvider } from "utils/web3"

export function BlockWatcher() {
    const provider = getProvider()
    const [blocks, setBlocks] = useState<Block[]>([])
    const blocksRef = useRef(blocks)

    const processBlocks = useCallback(async (blockNr: number) => {
        console.log('Process block', blockNr)
        const block = await provider.getBlock(blockNr)
        const unique = [...[...blocksRef.current, block].reduce((acc, current) => {
            acc.set(current.number, current)
            return acc
        }, new Map()).values()].sort((a: Block, b: Block) => {
            return b.number - a.number
        })

        blocksRef.current = unique
        setBlocks(unique)
    }, [])

    useEffect(() => {
        async function getLatestBlocks() {
            const provider = getProvider()
            provider.on('block', processBlocks)

            const block = await provider.getBlock('latest')
            const latestBlockNr = block.number
            await Promise.all(
                [...Array(10).keys()].map(i => processBlocks(latestBlockNr - i)))
        }

        getLatestBlocks()
    }, [])

    return (
        <ul>
            {blocks.map(i => {
                const total = i.gasUsed.add(i.gasLimit)
                const free = i.gasLimit.mul(100).div(total)

                return <li key={i.number}>
                    <strong>{i.number}</strong>
                    <p>baseFee {Math.round(Number(formatUnits(i.baseFeePerGas ?? 0, 'gwei')))} Gwei</p>
                    {/* <p>{i.gasLimit.toString()} limit</p> */}
                    <p>gasUsed {i.gasUsed.toString()} - {BigNumber.from(100).sub(free).toString()}%</p>
                    <p>{i.transactions.length} transactions</p>
                </li>
            })}
        </ul>
    )
}

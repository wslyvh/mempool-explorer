import { formatUnits } from '@ethersproject/units'
import { useEffect, useState } from 'react'
import { getProvider } from 'utils/web3'
import { useInterval } from './useInterval'

export function useGasPrice(interval: number = 12000) {
  const [gasPrice, setGasPrice] = useState<number>(0)

  useEffect(() => {
    async function asyncEffect() {
      await trySetPrice()
    }

    asyncEffect()
  }, [])

  useInterval(async () => {
    await trySetPrice()
  }, interval)

  async function trySetPrice() {
    try {
      const provider = getProvider()
      const feeData = await provider.getFeeData()

      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        const gasPrice = Math.round(Number(formatUnits(feeData.maxFeePerGas, 'gwei')))

        setGasPrice(gasPrice)
      }
    } catch (e) {
      // Unable to fetch fee data
    }
  }

  return { gasPrice }
}

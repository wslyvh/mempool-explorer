import { BigNumber } from "ethers"

export function flattenTxpool(data: any) {
    if (!data) return []

    return Object.keys(data).map(type => {
        return Object.keys(data[type]).map(address => {
            return Object.keys(data[type][address]).map(tx => {
                const txData = data[type][address][tx]
                const transaction = {
                    ...txData,
                    nonce: BigNumber.from(txData.nonce),
                    value: BigNumber.from(txData.value),
                }

                // Geth
                if (txData.gas) transaction.gas = BigNumber.from(txData.gas)
                if (txData.gasPrice) transaction.gasPrice = BigNumber.from(txData.gasPrice)
                // Erigon
                if (txData.maxFeePerGas) transaction.gasPrice = BigNumber.from(txData.maxFeePerGas)

                return transaction
            })
        })
    }).flat(2)
}
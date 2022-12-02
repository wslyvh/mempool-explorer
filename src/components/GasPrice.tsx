import { useGasPrice } from "hooks/useGasPrice"

export function GasPrice() {
    const { gasPrice } = useGasPrice()

    return <p>Gas Price ⛽ {gasPrice === 0 ? '-' : `${gasPrice} Gwei`}</p>
}

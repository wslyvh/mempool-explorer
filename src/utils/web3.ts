import { providers } from "ethers"

export function TruncateMiddle(text: string, length: number = 5) {
    if (text && text.length > length * 2 + 1) {
        return `${text.substring(0, length)}...${text.substring(text.length - length, text.length)}`
    }

    return text
}

export function getProvider() {
    // return new providers.JsonRpcBatchProvider({
    return new providers.JsonRpcProvider({
        url: 'https://bordel.xyz',
        timeout: 1200000
    })
}
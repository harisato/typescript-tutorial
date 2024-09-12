import { http, createWalletClient, createPublicClient, Address } from 'viem'
import { LaunchpadContractAddress, NFTContractAddress, RPCProviderUrl, account, iliad } from './utils'

const baseConfig = {
    chain: iliad,
    transport: http(RPCProviderUrl),
} as const
export const publicClient = createPublicClient({
    ...baseConfig,
})
export const walletClient = createWalletClient({
    ...baseConfig,
    account,
})

export async function mintNFT(): Promise<number | undefined> {
    console.log('Minting a new NFT...')

    const { request } = await publicClient.simulateContract({
        abi: [
            {
                inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
                name: 'mint',
                outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        address: NFTContractAddress,
        functionName: 'mint',
        args: [account.address as Address],
    })
    const hash = await walletClient.writeContract(request)
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })
    if (logs[0].topics[3]) {
        return parseInt(logs[0].topics[3], 16)
    }
}

export async function setAcceptPayToken(): Promise<number | undefined> {
    console.log('Setting accept pay token...')

    const { request } = await publicClient.simulateContract({
        abi: [
            {
                inputs: [
                    { internalType: 'address', name: '_payToken', type: 'address' },
                    { internalType: 'bool', name: '_accept', type: 'bool' },
                ],
                name: 'setAcceptPayToken',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        address: LaunchpadContractAddress,
        functionName: 'setAcceptPayToken',
        args: ['0x569e0BE633eBa92a8DeA81A39b20A9D4A138e49a' as Address, true],
        account: '0x338dc6B06fD4aA7b58447833e467FC0D42E75F20',
    })
    const hash = await walletClient.writeContract(request)
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })
    if (logs[0].topics[3]) {
        return parseInt(logs[0].topics[3], 16)
    }
}

export async function createLaunchpad(
    creatorAddress: Address = '0x338dc6B06fD4aA7b58447833e467FC0D42E75F20',
    licensorIpid: Address = '0xcae666c8C7E85946aF96D36B3Fe01Fcc807431C6'
): Promise<string> {
    console.log('Creating launchpad...')

    // const { request } = await publicClient.simulateContract({
    //     abi: [
    //         {
    //             inputs: [
    //                 {
    //                     components: [
    //                         { internalType: 'address payable', name: 'creatorAddress', type: 'address' },
    //                         { internalType: 'address', name: 'licensorIpid', type: 'address' },
    //                         { internalType: 'string', name: 'colectionName', type: 'string' },
    //                         { internalType: 'uint256', name: 'startTime', type: 'uint256' },
    //                         { internalType: 'uint256', name: 'endTime', type: 'uint256' },
    //                         { internalType: 'uint256', name: 'totalQuantity', type: 'uint256' },
    //                         { internalType: 'uint256', name: 'maxBuy', type: 'uint256' },
    //                     ],
    //                     internalType: 'struct StoryLaunchpad.StoryLaunchpad',
    //                     name: '_launchpad',
    //                     type: 'tuple',
    //                 },
    //                 {
    //                     components: [
    //                         { internalType: 'address', name: 'nftAddress', type: 'address' },
    //                         { internalType: 'address', name: 'payToken', type: 'address' },
    //                         { internalType: 'uint256', name: 'price', type: 'uint256' },
    //                         { internalType: 'string', name: 'uriLaunchpad', type: 'string' },
    //                         { internalType: 'string', name: 'uriNFT', type: 'string' },
    //                         { internalType: 'uint256', name: 'royaltyPercentage', type: 'uint256' },
    //                         { internalType: 'address', name: 'royaltyAddress', type: 'address' },
    //                     ],
    //                     internalType: 'struct StoryLaunchpad.LaunchpadInfor',
    //                     name: '_launchpadInfor',
    //                     type: 'tuple',
    //                 },
    //             ],
    //             name: 'createLaunchpad',
    //             outputs: [],
    //             stateMutability: 'nonpayable',
    //             type: 'function',
    //         },
    //     ],
    //     address: LaunchpadContractAddress,
    //     functionName: 'createLaunchpad',
    //     args: [
    //         [creatorAddress, licensorIpid, 'Hero Cyber', '1726209037', '1728683451', '3', '1'] as any,
    //         [
    //             '0x322813fd9a801c5507c9de605d63cea4f2ce6c44',
    //             '0x569e0BE633eBa92a8DeA81A39b20A9D4A138e49a', // usdt address
    //             '0',
    //             `https://ipfs-gw.dev.aura.network/ipfs/QmXGNP6NLrUc8wwtb3vx49zFzcK3VHyivDAkddBV4R1yT5/`,
    //             `https://ipfs-gw.dev.aura.network/ipfs/QmborFqoWXtmKj6oiMMTpPHGkRA3fYEC79YAvpjKsyvUTj/`,
    //             '0',
    //             creatorAddress,
    //         ] as any,
    //     ],
    //     account: '0x338dc6B06fD4aA7b58447833e467FC0D42E75F20',
    // })
    const hash = await walletClient.writeContract({
        abi: [
            {
                inputs: [
                    {
                        components: [
                            { internalType: 'address payable', name: 'creatorAddress', type: 'address' },
                            { internalType: 'address', name: 'licensorIpid', type: 'address' },
                            { internalType: 'string', name: 'colectionName', type: 'string' },
                            { internalType: 'uint256', name: 'startTime', type: 'uint256' },
                            { internalType: 'uint256', name: 'endTime', type: 'uint256' },
                            { internalType: 'uint256', name: 'totalQuantity', type: 'uint256' },
                            { internalType: 'uint256', name: 'maxBuy', type: 'uint256' },
                        ],
                        internalType: 'struct StoryLaunchpad.StoryLaunchpad',
                        name: '_launchpad',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { internalType: 'address', name: 'nftAddress', type: 'address' },
                            { internalType: 'address', name: 'payToken', type: 'address' },
                            { internalType: 'uint256', name: 'price', type: 'uint256' },
                            { internalType: 'string', name: 'uriLaunchpad', type: 'string' },
                            { internalType: 'string', name: 'uriNFT', type: 'string' },
                            { internalType: 'uint256', name: 'royaltyPercentage', type: 'uint256' },
                            { internalType: 'address', name: 'royaltyAddress', type: 'address' },
                        ],
                        internalType: 'struct StoryLaunchpad.LaunchpadInfor',
                        name: '_launchpadInfor',
                        type: 'tuple',
                    },
                ],
                name: 'createLaunchpad',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        address: LaunchpadContractAddress,
        functionName: 'createLaunchpad',
        args: [
            [creatorAddress, licensorIpid, 'Hero Cyber', '1726209037', '1728683451', '3', '1'] as any,
            [
                '0x322813fd9a801c5507c9de605d63cea4f2ce6c44',
                '0x569e0BE633eBa92a8DeA81A39b20A9D4A138e49a', // usdt address
                '0',
                `https://ipfs-gw.dev.aura.network/ipfs/QmXGNP6NLrUc8wwtb3vx49zFzcK3VHyivDAkddBV4R1yT5/`,
                `https://ipfs-gw.dev.aura.network/ipfs/QmborFqoWXtmKj6oiMMTpPHGkRA3fYEC79YAvpjKsyvUTj/`,
                '0',
                creatorAddress,
            ] as any,
        ],
    })
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })

    console.log(logs)
    return hash
}

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Address, http, toHex } from 'viem'
import { mintNFT } from './utils/mintNFT'
import { NFTContractAddress, NonCommercialSocialRemixingTermsId, RPCProviderUrl, account } from './utils/utils'

// BEFORE YOU RUN THIS FUNCTION: Make sure to read the README which contains instructions for running this non-commercial example.

const main = async function () {
    // 1. Set up your Story Config
    //
    // Docs: https://docs.storyprotocol.xyz/docs/typescript-sdk-setup
    const config: any = {
        account: account,
        transport: http(RPCProviderUrl),
        chainId: 'sepolia',
    }
    // const config: StoryConfig = {
    //     account: account,
    //     transport: http(RPCProviderUrl),
    //     chainId: '11155111',
    // }
    const client = StoryClient.newClient(config)

    // 2. Register an IP Asset
    //
    // Docs: https://docs.storyprotocol.xyz/docs/register-an-nft-as-an-ip-asset
    // const tokenId = await mintNFT()
    const tokenId = 11
    const registeredIpAssetResponse = await client.ipAsset.register({
        nftContract: '0x06c5bcF94dB7e61Bb755cF98106D05e8c2E9847f',
        tokenId: tokenId!,
        // ipMetadata: {
        //     ipMetadataURI: 'test-uri',
        //     ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
        //     nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
        //     nftMetadataURI: 'test-nft-uri',
        // },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${registeredIpAssetResponse.txHash}, IPA ID: ${registeredIpAssetResponse.ipId}`)

    // 2.1. Register License Terms to IP
    //
    // const currencyAddress = '0xB132A6B7AE652c974EE1557A3521D53d18F6739f'
    // const registerTermResponse = await client.license.registerCommercialUsePIL({
    //     currency: currencyAddress,
    //     mintingFee: '0',
    //     txOptions: { waitForTransaction: true },
    // })
    const registerTermResponse = await client.license.registerNonComSocialRemixingPIL({
        txOptions: { waitForTransaction: true },
    })
    console.log(
        `PIL Terms registered at transaction hash ${registerTermResponse.txHash}, License Terms ID: ${registerTermResponse.licenseTermsId}`
    )

    // 3. Attach License Terms to IP
    //
    // Docs: https://docs.storyprotocol.xyz/docs/attach-terms-to-an-ip-asset
    try {
        const attachLicenseTermsResponse = await client.license.attachLicenseTerms({
            licenseTermsId: 2,
            ipId: registeredIpAssetResponse.ipId as Address,
            txOptions: { waitForTransaction: true },
        })
        console.log(`Attached License Terms to IP at transaction hash ${attachLicenseTermsResponse.txHash}`)
    } catch (e) {
        console.log(`License Terms ID ${NonCommercialSocialRemixingTermsId} already attached to this IPA.`)
    }
    // // 3. Attach License Terms to IP
    // //
    // // Docs: https://docs.storyprotocol.xyz/docs/attach-terms-to-an-ip-asset
    // try {
    //     const attachLicenseTermsResponse = await client.license.attachLicenseTerms({
    //         licenseTermsId: NonCommercialSocialRemixingTermsId,
    //         ipId: registeredIpAssetResponse.ipId as Address,
    //         txOptions: { waitForTransaction: true },
    //     })
    //     console.log(`Attached License Terms to IP at transaction hash ${attachLicenseTermsResponse.txHash}`)
    // } catch (e) {
    //     console.log(`License Terms ID ${NonCommercialSocialRemixingTermsId} already attached to this IPA.`)
    // }

    // // 4. Mint License
    // //
    // // Docs: https://docs.storyprotocol.xyz/docs/mint-a-license
    // const mintLicenseResponse = await client.license.mintLicenseTokens({
    //     licenseTermsId: NonCommercialSocialRemixingTermsId,
    //     licensorIpId: registeredIpAssetResponse.ipId as Address,
    //     receiver: account.address,
    //     amount: 1,
    //     txOptions: { waitForTransaction: true },
    // })
    // // console.log(
    // //     `License Token minted at transaction hash ${mintLicenseResponse.txHash}, License IDs: ${mintLicenseResponse.licenseTokenIds}`
    // // )
    // console.log(`License Token minted at transaction hash ${mintLicenseResponse.txHash}, License ID: ${mintLicenseResponse.licenseTokenId}`)

    // // 5. Mint deriviative IP Asset using your license
    // //
    // // Docs: https://docs.storyprotocol.xyz/docs/register-ipa-as-derivative#register-derivative-using-license-token
    // const derivativeTokenId = await mintNFT()
    // const registeredIpAssetDerivativeResponse = await client.ipAsset.register({
    //     nftContract: NFTContractAddress,
    //     tokenId: derivativeTokenId!,
    //     ipMetadata: {
    //         ipMetadataURI: 'test-uri',
    //         ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
    //         nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
    //         nftMetadataURI: 'test-nft-uri',
    //     },
    //     txOptions: { waitForTransaction: true },
    // })
    // console.log(
    //     `Derivative IPA created at transaction hash ${registeredIpAssetDerivativeResponse.txHash}, IPA ID: ${registeredIpAssetDerivativeResponse.ipId}`
    // )
    // const linkDerivativeResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
    //     childIpId: registeredIpAssetDerivativeResponse.ipId as Address,
    //     licenseTokenIds: mintLicenseResponse.licenseTokenIds as bigint[],
    //     txOptions: { waitForTransaction: true },
    // })
    // console.log(`Derivative IPA linked to parent at transaction hash ${linkDerivativeResponse.txHash}`)
}

main()

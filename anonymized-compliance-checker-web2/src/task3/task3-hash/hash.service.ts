import { Injectable } from "@nestjs/common"
import * as crypto from "crypto"
import { GraphQLClient, gql } from "graphql-request"

@Injectable()
export class HashService {
    private readonly subGraphURL: string = process.env.SUBGRAPH_URL || ""
    private readonly client: GraphQLClient
    constructor() {
        this.client = new GraphQLClient(this.subGraphURL)
    }

    async hashString(
        input: string,
        prevHash: string,
        nonce: number
    ): Promise<string> {
        const data: string = `${input}|${prevHash}|${nonce}`
        const encoder: TextEncoder = new TextEncoder()
        const hashBuffer: ArrayBuffer = await crypto.webcrypto.subtle.digest(
            "SHA-256",
            encoder.encode(data)
        )
        const hash: string = Buffer.from(hashBuffer).toString("hex")
        return hash
    }

    async getCreationHashByInternalId(
        internalId: number
    ): Promise<{ hash: string | null; code: number }> {
        const query = gql`
            query GetCreationHashByInternalId($internalId: BigInt!) {
                creationHashUpdateds(where: { internal_id: $internalId }) {
                    hash
                }
            }
        `

        try {
            const variables: { internalId: number } = { internalId }
            const data: any = await this.client.request<any>(query, variables)
            const result: { hash: string } | undefined =
                data.creationHashUpdateds?.[0]
            if (result) {
                return { hash: result.hash, code: 200 }
            }
        } catch (error: unknown) {
            console.error("GraphQl query error =>", error)
        }
        return { hash: null, code: 404 }
    }

    async getUpdateHashByInternalId(
        internalId: number
    ): Promise<{ hash: string | null; code: number }> {
        const query = gql`
            query GetUpdateHashByInternalId($internalId: BigInt!) {
                updateHashUpdateds(where: { internal_id: $internalId }) {
                    hash
                }
            }
        `

        try {
            const variables: { internalId: number } = { internalId }
            const data: any = await this.client.request<any>(query, variables)
            const result: { hash: string } | undefined =
                data.updateHashUpdateds?.[0]
            if (result) {
                return { hash: result.hash, code: 200 }
            }
        } catch (error: unknown) {
            console.error("GraphQl query error =>", error)
        }
        return { hash: null, code: 404 }
    }
}

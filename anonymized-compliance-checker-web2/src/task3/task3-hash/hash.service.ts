import { Injectable } from "@nestjs/common"
import * as crypto from "crypto"

@Injectable()
export class HashService {
    async hashString(
        input: string,
        prevHash: string,
        nonce: number
    ): Promise<string> {
        const data = `${input}|${prevHash}|${nonce}`
        const encoder = new TextEncoder()
        const hashBuffer = await crypto.webcrypto.subtle.digest(
            "SHA-256",
            encoder.encode(data)
        )
        const hash = Buffer.from(hashBuffer).toString("hex")
        return hash
    }
}

import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CreationHashUpdated,
  OwnershipTransferred,
  UpdateHashUpdated
} from "../generated/Task3/Task3"

export function createCreationHashUpdatedEvent(
  id: BigInt,
  hash: string
): CreationHashUpdated {
  let creationHashUpdatedEvent = changetype<CreationHashUpdated>(newMockEvent())

  creationHashUpdatedEvent.parameters = new Array()

  creationHashUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  creationHashUpdatedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromString(hash))
  )

  return creationHashUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUpdateHashUpdatedEvent(
  id: BigInt,
  hash: string
): UpdateHashUpdated {
  let updateHashUpdatedEvent = changetype<UpdateHashUpdated>(newMockEvent())

  updateHashUpdatedEvent.parameters = new Array()

  updateHashUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  updateHashUpdatedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromString(hash))
  )

  return updateHashUpdatedEvent
}

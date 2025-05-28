import {
  CreationHashUpdated as CreationHashUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  UpdateHashUpdated as UpdateHashUpdatedEvent
} from "../generated/Task3/Task3"
import {
  CreationHashUpdated,
  OwnershipTransferred,
  UpdateHashUpdated
} from "../generated/schema"

export function handleCreationHashUpdated(
  event: CreationHashUpdatedEvent
): void {
  let entity = new CreationHashUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.hash = event.params.hash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateHashUpdated(event: UpdateHashUpdatedEvent): void {
  let entity = new UpdateHashUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.hash = event.params.hash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

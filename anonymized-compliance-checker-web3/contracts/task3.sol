// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Task3 Contract
/// @author Samanta Karmaker
/// @notice This contract emits events for creation and update hashes, storing only the latest hashes on-chain.
/// @dev Only the latest hashes are stored; full history is available off-chain via events.

contract Task3 is Ownable {
    /**
     * @notice Initializes the contract setting the deployer as the initial owner.
     * @param initialOwner The address to be set as the initial owner of the contract.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Stores the latest creation hash
    string public latestCreationHash;

    /// @notice Stores the latest update hash
    string public latestUpdateHash;

    /// @notice Emitted when a new creation hash is set
    /// @param id the creation batch identifier
    /// @param hash The hash representing the creation batch
    event CreationHashUpdated(uint256 indexed id, string hash);

    /// @notice Emitted when a new update hash is set
    /// @param id the update batch identifier
    /// @param hash The hash representing the update batch
    event UpdateHashUpdated(uint256 indexed id, string hash);

    /// @notice Sets the latest creation hash and emits an event
    /// @param id the creation batch identifier
    /// @param hash The hash value to store and emit
    function create(uint256 id, string memory hash) external onlyOwner {
        latestCreationHash = hash;
        emit CreationHashUpdated(id, hash);
    }

    /// @notice Sets the latest update hash and emits an event
    /// @param id the update batch identifier
    /// @param hash The hash value to store and emit
    function update(uint256 id, string memory hash) external onlyOwner {
        latestUpdateHash = hash;
        emit UpdateHashUpdated(id, hash);
    }
}

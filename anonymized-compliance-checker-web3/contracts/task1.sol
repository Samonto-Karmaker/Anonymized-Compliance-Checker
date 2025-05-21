// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Task 1 GDPR Compliance Validator
/// @author Omitul Islam
/// @notice Validates that provided hashed field names are not in the predefined blacklist
/// @dev Uses a mapping of hashed field names to determine non-compliance

contract Task1 {
    /// @notice Mapping to store blacklisted (non-compliant) field hashes
    mapping(bytes32 => bool) private blacklistedFields;

    /// @notice The address of the contract deployer (owner)
    address public owner;

    /// @notice Initializes the contract, sets the owner, and populates the blacklist with hardcoded hashes
    constructor() {
        owner = msg.sender;

        // Initialize blacklisted fields
        blacklistedFields[0x5D3575D1A0AB5B2F5EE09A5E4FBAE19BCAA9F9343659AA29603B2CBC9AB5D99D] = true;
        blacklistedFields[0x139D14B61CAE91C759A05E3F8ECE2128CDC1B43D95FD48B9038000D9C1C9C178] = true;
        blacklistedFields[0x2B93B177B55445F513D73FF1F0F30376D6EC181BCC1BD5CD19CCCB970F4EE0D2] = true;
        blacklistedFields[0xF26868AFB399D3023E79FA44EF170111F5A24802FC72E67895AFB3F21E643D03] = true;
        blacklistedFields[0x44863B03E9909B7100E05B02526909A346FD7455183F6619E0FE6198C89981E0] = true;
        blacklistedFields[0x4476E4C39678D4B41598A27487939AA5FB6F0A34DD75615EA0F2FDC3AD45AF7C] = true;
        blacklistedFields[0xE9E08ADF4A878A37BC2BAA9EA24FABF533076045D996DA9AAF5F4765D4266AA5] = true;
        blacklistedFields[0x0BD025A21DFF5177FB5A00614B6BC9C4E901CB58AD4EF08F5D983153E89B21C1] = true;
        blacklistedFields[0xFDF2E20AF1F856577C4DA7BBDD112E00E3203F1891517E0E48521D756AF397E1] = true;
        blacklistedFields[0xD296ADD506BBA3096A4FC9610F514B5149710F4BCAD72F0CD5C4C7E7B45B1A1E] = true;
        blacklistedFields[0x950DDB2960435690C9EBF10604B5C24CAB994C7460EB0F2425881DAC74FC2B4E] = true;
        blacklistedFields[0xCE5F28B261D6DC9BE110CBB9D067FAF11BEC284ACD10BFE7170292C56DC01893] = true;
        blacklistedFields[0xA0F654C753E25A17A44DA09F3D1EA0DA1699352F70FC9676BD1988CC42C77F9C] = true;
        blacklistedFields[0x6506DA55E434CC2750E73A988466A1E79A6DBECBF7DB7E0B0B1A9A4E6B255990] = true;
    }

    /// @notice Checks if any of the provided field hashes are blacklisted
    /// @param fieldHashes An array of hashed field names to check for GDPR compliance
    /// @return Returns false if any field is blacklisted, true otherwise!
    function isCompliant(bytes32[] calldata fieldHashes) external view returns (bool) {
        for (uint i = 0; i < fieldHashes.length; i++) {
            if (blacklistedFields[fieldHashes[i]]) {
                return false;
            }
        }
        return true;
    }
}
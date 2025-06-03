// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Task 2 Validator Contract
/// @author Al Fahim
/// @notice Validates that each expiry date is at least 6 months after the disbursed date
/// @dev Uses a fixed time difference of 6 months (15552000 seconds)


/// @notice Error thrown when the expiry date is not more than 6 months after the disbursed date
error TaskTwo_RulesViolated();

contract Task2 {

    /// @notice The minimum required time difference between disbursed and expiry dates (6 months)
    uint256 constant timeDifference = 15552000; // 6 months in seconds

    /// @notice Structure to represent disbursed and expiry dates
    /// @param expiryDate The date when the item or policy expires (as a Unix timestamp)
    /// @param disbursedDate The date when the item or policy was issued/disbursed (as a Unix timestamp)
    struct DateObj {
        uint256 expiryDate;
        uint256 disbursedDate;
    }

    /// @notice Validates that the expiry date is more than 6 months after the disbursed date for each item
    /// @dev Reverts with TaskTwo_RulesViolated if any date pair violates the rule
    /// @param dates An array of DateObj structs containing expiry and disbursed dates
    function validate(DateObj[] memory dates) external pure {
        uint256 n = dates.length;
        for (uint256 i = 0; i < n; i++) {
            uint256 diff = dates[i].expiryDate - dates[i].disbursedDate;
            if (diff <= timeDifference) {
                revert TaskTwo_RulesViolated();
            }
        }
    }

    
}

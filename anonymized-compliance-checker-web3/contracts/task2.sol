// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

error TaskTwo_RulesViolated();

contract Task2{
    uint256 timeDifferance= 15552000;//6 months

    struct DateObj{
        uint256 expiryDate;
        uint256 disbursedDate;
    }

    function validate(DateObj[] memory dates) external view{
        uint256 n=dates.length;
        for(uint256 i=0;i<n;i++){
            uint256 diff=dates[i].expiryDate-dates[i].disbursedDate;
            if(diff<=timeDifferance){
                revert TaskTwo_RulesViolated();
            }
        }
    }
}
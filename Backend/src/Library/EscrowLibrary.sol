// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library EscrowCalculations {
    // Functions to calculate
    // when there is no conflict

    // function to calculate non-audit fees, calculate 7% of the total price for the gig for the platorm
    function NonAuditFees(uint256 totalAmount) internal pure returns (uint256) {
        return (totalAmount * 7) / 100;
    }

    //function to calculate 10 percent that will be returned to Client if no audit is involved
    function ClientNoAudit(uint256 totalAmount) internal pure returns (uint256) {
        return (totalAmount * 10) / 100;
    }

    //function to calculate 95% of the total price and pay it to the frrelancer
    function FreeLancerNoAudit(uint256 totalAmount) internal pure returns (uint256) {
        return (totalAmount * 95) / 100;
    }

    /// Functions to calculate
    // when audit is involved)
    // function to calculate audit fees, calculate 10% of the total price for the gig
    function AuditFees(uint256 totalAmount) internal pure returns (uint256) {
        return (totalAmount * 10) / 100;
    }

    //function to calculate 92% of the total price and pay it to the freelancer when auditing is done
    function FreeLancerAudit(uint256 totalAmount) internal pure returns (uint256) {
        return (totalAmount * 92) / 100;
    }
}
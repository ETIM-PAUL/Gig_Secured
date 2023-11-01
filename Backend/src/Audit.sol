// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Audit {
    struct Auditor {
        string[] categories;
        string email;
        address _auditor;
        uint currentGigs;
    }

    address owner;

    Auditor[] private Auditors;

    function becomeAuditor() public {}

    function confirmAuditor() public {}

    function removeAuditor() public {}

    function getAuditors() public {}
}

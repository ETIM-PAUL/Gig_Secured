// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Audit {
    struct Auditor {
        string[] categories;
        string email;
        address _auditor;
        uint currentGigs;
    }
    mapping(address => Auditor) private auditors;
    error InvalidAuditor();
    error InvalidCategory();
    error InvalidEmail();
    error InvalidGig();
    error InvalidGigType();
    error InvalidGigStatus();
    

    address owner;

    Auditor[] private Auditors;
    

    function becomeAuditor() public {}

    function confirmAuditor() public {}

    function removeAuditor(uint _Audit) public {
        delete Auditors[_Audit];
        
        

    }

    function assignAuditor() public view returns(Auditor[] memory){
        return Auditors;

    }
}

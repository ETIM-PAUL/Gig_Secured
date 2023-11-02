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
    event AuditorRemoved(address indexed removedAuditor);

    function becomeAuditor() public {}

    function confirmAuditor() public {}

    function removeAuditor(address _auditor) public onlyowner{
        require(_auditor!= address(0));//auditor most not be 0x0
        require(_auditor != owner, "Owner cannot be removed as an auditor");
        emit AuditorRemoved(auditorToRemove);

    }

    function getAuditors() public view returns(Auditor[] memory){
        return Auditors;

    }
}

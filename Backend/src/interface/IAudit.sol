// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IAudit {
    function confirmAuditor(address _auditor) external;

    function removeAuditor(address _auditor) external;

    function addGigContractAddresses(address gigSecuredContract) external;

    function increaseAuditorCurrentGigs(address _auditor) external;

    function decreaseAuditorCurrentGigs(address _auditor) external;

    function getAuditorByCategory(
        string memory category
    ) external view returns (address);
}

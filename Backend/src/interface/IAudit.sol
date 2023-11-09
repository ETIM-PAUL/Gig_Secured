// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IAudit {
    struct AuditorContracts {
        address contractInstance;
        uint id;
    }

    function confirmAuditor(address _auditor) external;

    function removeAuditor(address _auditor) external;

    function addGigContractAddresses(address gigSecuredContract) external;

    function increaseAuditorCurrentGigs(
        address _auditor,
        AuditorContracts memory _contractAddresses
    ) external;

    function decreaseAuditorCurrentGigs(address _auditor) external;

    function getAuditorByCategory(
        string memory category
    ) external view returns (address);
}

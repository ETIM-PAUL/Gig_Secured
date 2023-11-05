// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IAudit {
    function getAuditorByCategory(
        string memory category
    ) external view returns (address);
}
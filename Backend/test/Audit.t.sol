// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Audit} from "../src/Audit.sol";

contract CounterTest is Test {
    Audit public audit;
    address _governance = address(0x124);

    function setUp() public {
        audit = new Audit(_governance);
    }

    function testIncreaseAuditorCurrentGigs() {
        vm.prank(_governance);
        address auditor = address(0x0);
        address gigContract = address(0x123);
        audit.addGigContractAddresses(gigContract);
        audit.increaseAuditorCurrentGigs(auditor, gigContract);
    }

}

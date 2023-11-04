// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Test} from "forge-std/Test.sol";
import {Audit} from "../src/Audit.sol";

contract CounterTest is Test {
    Audit public audit;
    address _governance = address(0x124);
    Audit.Auditor auditorStruct;

    function setUp() public {
        audit = new Audit(_governance);
    }

    function testIncreaseZeroAddress() public {
        address auditor = address(0x0);
        address gigContract = address(0x123);
        vm.startPrank(_governance);
        audit.addGigContractAddresses(gigContract);
        vm.expectRevert(Audit.ZeroAddress.selector);
        audit.increaseAuditorCurrentGigs(auditor, gigContract);
        vm.stopPrank();
    }

    function testIncreaseAuditorCurrentGigs() public {
        address auditor = address(0x122);
        address gigContract = address(0x123);
        vm.startPrank(_governance);
        audit.addGigContractAddresses(gigContract);
        audit.increaseAuditorCurrentGigs(auditor, gigContract);
        Audit.Auditor memory auditorEdit = audit.getAuditors(auditor);
        assertEq(auditorEdit.currentGigs, 1);
        vm.stopPrank();
    }

    function testDecreaseZeroAddress() public {
        address auditor = address(0x0);
        address gigContract = address(0x123);
        vm.startPrank(_governance);
        audit.addGigContractAddresses(gigContract);
        vm.expectRevert(Audit.ZeroAddress.selector);
        audit.decreaseAuditorCurrentGigs(auditor, gigContract);
        vm.stopPrank();
    }

    function testNoGigForAuditor() public {
        address auditor = address(0x122);
        address gigContract = address(0x123);
        vm.startPrank(_governance);
        audit.addGigContractAddresses(gigContract);
        vm.expectRevert(Audit.NoGigForAuditor.selector);
        audit.decreaseAuditorCurrentGigs(auditor, gigContract);
        vm.stopPrank();
    }

    function testDecreaseAuditorCurrentGigs() public {
        address auditor = address(0x122);
        address gigContract = address(0x123);
        vm.startPrank(_governance);
        audit.addGigContractAddresses(gigContract);
        audit.increaseAuditorCurrentGigs(auditor, gigContract);
        audit.decreaseAuditorCurrentGigs(auditor, gigContract);
        Audit.Auditor memory auditorEdit = audit.getAuditors(auditor);
        assertEq(auditorEdit.currentGigs, 0);
        vm.stopPrank();
    }

}

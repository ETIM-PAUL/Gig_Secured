// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2, console} from "forge-std/Test.sol";
import {Audit} from "../src/Audit.sol";

contract CounterTest is Test {
    Audit public audit;
    address _governance;
    address _auditorAddr;
    address _auditorAddr2;
    address _auditorAddr3;
    address gigContract;

    Audit.Auditor _newAuditor;

    function setUp() public {
        _governance = address(0x0234);
        _auditorAddr = address(0x321);
        _auditorAddr2 = address(1);
        _auditorAddr3 = address(2);
        gigContract = address(3);
        audit = new Audit(_governance);
    }

    function testConfirmAuditor() public {
        // Create an auditor
        // address auditor = address(1);
        vm.startPrank(_auditorAddr);
        audit.becomeAuditor("category", "email");
        vm.stopPrank();
        string memory category = "Category2";

        // Confirm the auditor
        vm.startPrank(_governance);
        audit.confirmAuditor(_auditorAddr, category);
        vm.stopPrank();

        bool auditorConfirmed = audit.checkAuditorStatus(_auditorAddr);
        // Check that the auditor is confirmed
        // assertEq(Audit.auditor_(_auditorAddr).isConfirmed);
        assertTrue(auditorConfirmed);
    }

    // Returns the address of the confirmed auditor with the earliest confirmation time for the given category
    function testGetAuditorByCategory() external {
        // Arrange
        string memory category = "Category2";
        address auditor1 = address(0x1);
        address auditor2 = address(0x2);
        createAuditor(auditor1, category, "email1");
        createAuditor(auditor2, category, "email2");

        uint256 confirmationTime1 = block.timestamp + 100 minutes;
        uint256 confirmationTime2 = block.timestamp + 200 minutes;

        confirmAuditor(auditor1, category, confirmationTime1);
        confirmAuditor(auditor2, category, confirmationTime2);

        // Act
        address selectedAuditor = audit.getAuditorByCategory(category);

        // Assert
        assertEq(selectedAuditor, auditor1); // Check if auditor1 with earlier confirmation time is selected
    }

    function createAuditor(
        address auditor,
        string memory category,
        string memory email
    ) internal {
        vm.startPrank(auditor);
        audit.becomeAuditor(category, email);
        vm.stopPrank();
    }

    function confirmAuditor(
        address auditor,
        string memory category,
        uint256 confirmationTime
    ) internal {
        vm.startPrank(_governance);
        vm.warp(confirmationTime);
        audit.confirmAuditor(auditor, category);
        vm.stopPrank();
    }

    function test_removeAuditort() public {
        vm.startPrank(_auditorAddr);
        audit.becomeAuditor("category", "email");
        vm.stopPrank();
        string memory category = "Category2";

        // Confirm the auditor
        vm.startPrank(_governance);
        audit.confirmAuditor(_auditorAddr, category);
        vm.stopPrank();

        bool auditorConfirmed = audit.checkAuditorStatus(_auditorAddr);
        // Check that the auditor is confirmed

        assertTrue(auditorConfirmed);

        vm.startPrank(_governance);
        audit.removeAuditor(_auditorAddr);
        vm.stopPrank();

        bool isAuditorConfirmedAfterRemoval = audit.checkAuditorStatus(
            _auditorAddr
        );
        assertFalse(isAuditorConfirmedAfterRemoval);

        // Verify that the auditor has been removed from the auditor_ mapping

        bool isAuditorInMapping = audit.checkAuditorStatus(_auditorAddr);
        assertFalse(isAuditorInMapping);
    }
}

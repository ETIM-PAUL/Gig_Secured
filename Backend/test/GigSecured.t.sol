// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {GigSecured} from "../src/GigSecured.sol";
import {Audit} from "../src/Audit.sol";
import {USDC} from "../src/USDC.sol";
import "./Helper.sol";

contract GigSecuredTest is Helpers {
    GigSecured private _gigSecured;
    Audit private _audit;
    USDC private _usdc;

    address _governance = address(0x11);

    address _clientAddress;
    address _freelancerAddress;
    address _auditor;

    uint256 _privKeyClient;
    uint256 _privKeyFreelancer;

    GigSecured.GigContract _newGigContract;
    GigSecured.Status _status;

    uint _gigs;

    function setUp() public {
        _audit = new Audit(_governance);
        _usdc = new USDC();
        _gigSecured = new GigSecured(
            address(_audit),
            _governance,
            address(_usdc)
        );

        (_clientAddress, _privKeyClient) = mkaddr("Client");
        (_freelancerAddress, _privKeyFreelancer) = mkaddr("Freelancer");
        (_auditor, ) = mkaddr("Freelancer");

        _usdc.mint(_clientAddress, 100000000);

        _newGigContract = GigSecured.GigContract({
            title: "Natachi White Paper Contract",
            category: "Copy Writing",
            clientName: "Natachi",
            clientEmail: "natachi@gmail.com",
            clientSign: bytes(""),
            freelancerName: "Mitong",
            freelancerEmail: "mitong@gmail.com",
            freeLancer: _freelancerAddress,
            freelancerSign: bytes(""),
            description: "",
            deadline: 0,
            completedTime: 0,
            _status: _status,
            isAudit: false,
            auditor: _auditor,
            price: 100000000,
            creator: _clientAddress
        });
    }

    function testAddGigContract() public {
        vm.startPrank(_clientAddress);
        _newGigContract.deadline = 8600;
        _usdc.approve(address(_gigSecured), _newGigContract.price);
        bool gigAdded = _gigSecured.addGig(
            _newGigContract.title,
            _newGigContract.category,
            _newGigContract.clientSign,
            _newGigContract.clientName,
            _newGigContract.clientEmail,
            _newGigContract.description,
            _newGigContract.deadline,
            _newGigContract.price,
            _freelancerAddress
        );
        vm.stopPrank();
        assertTrue(gigAdded);
    }

    function testWrongFreelancerSign() external {
        testAddGigContract();
        vm.startPrank(_clientAddress);
        _newGigContract.freelancerSign = constructSig(
            _freelancerAddress,
            _newGigContract.title,
            1,
            _newGigContract.price,
            _newGigContract.deadline,
            _privKeyFreelancer
        );
        vm.expectRevert(GigSecured.NotAssignedFreeLancer.selector);
        _gigSecured.freeLancerSign(_newGigContract.freelancerSign, 1);
    }

    function testFreelancerSign() public {
        testAddGigContract();

        vm.startPrank(_freelancerAddress);
        _newGigContract.freelancerSign = constructSig(
            _freelancerAddress,
            _newGigContract.title,
            1,
            _newGigContract.price,
            _newGigContract.deadline,
            _privKeyFreelancer
        );
        bool freelancerAssign = _gigSecured.freeLancerSign(
            _newGigContract.freelancerSign,
            1
        );
        assertTrue(freelancerAssign);
    }

    function testDeadlineGigContract() external {
        GigSecured.GigContract memory _newContract = _newGigContract;
        vm.startPrank(_clientAddress);
        _usdc.approve(address(_gigSecured), _newContract.price);
        vm.expectRevert(GigSecured.AtLeastAnHour.selector);
        _gigSecured.addGig(
            _newContract.title,
            _newContract.category,
            _newContract.clientSign,
            _newContract.clientName,
            _newContract.clientEmail,
            _newContract.description,
            _newContract.deadline,
            _newContract.price,
            _freelancerAddress
        );
    }

    function testEditGigDeadline() external {
        testAddGigContract();
        vm.startPrank(_clientAddress);
        _gigSecured.editGigDeadline(1, 3601);
    }

    function testEditGigTitle() public {
        vm.startPrank(_clientAddress);
        _usdc.approve(address(_gigSecured), 100000000);
        _gigSecured.addGig(
            _newGigContract.title,
            _newGigContract.category,
            _newGigContract.clientSign,
            _newGigContract.clientName,
            _newGigContract.clientEmail,
            _newGigContract.description,
            block.timestamp + 120 minutes,
            _newGigContract.price,
            _newGigContract.freeLancer
        );
        _gigSecured.editGigTitle(1, "Tola");
        vm.stopPrank();
        assertEq(_gigSecured.getGig(1).title, "Tola");
    }

    function testEditGigCategory() public {
        vm.startPrank(_clientAddress);
        _usdc.approve(address(_gigSecured), 100000000);
        _gigSecured.addGig(
            _newGigContract.title,
            _newGigContract.category,
            _newGigContract.clientSign,
            _newGigContract.clientName,
            _newGigContract.clientEmail,
            _newGigContract.description,
            block.timestamp + 120 minutes,
            _newGigContract.price,
            _newGigContract.freeLancer
        );
        _gigSecured.editGigCategory(1, "software");
        vm.stopPrank();
        assertEq(_gigSecured.getGig(1).category, "software");
    }

    function testEditGigDescription() public {
        vm.startPrank(_clientAddress);
        _usdc.approve(address(_gigSecured), 100000000);
        _gigSecured.addGig(
            _newGigContract.title,
            _newGigContract.category,
            _newGigContract.clientSign,
            _newGigContract.clientName,
            _newGigContract.clientEmail,
            _newGigContract.description,
            block.timestamp + 120 minutes,
            _newGigContract.price,
            _newGigContract.freeLancer
        );
        _gigSecured.editGigDescription(1, "free");
        vm.stopPrank();
        assertEq(_gigSecured.getGig(1).description, "free");
    }

    function testEditGigFreelancer() public {
        vm.startPrank(_clientAddress);
        _usdc.approve(address(_gigSecured), 100000000);
        _gigSecured.addGig(
            _newGigContract.title,
            _newGigContract.category,
            _newGigContract.clientSign,
            _newGigContract.clientName,
            _newGigContract.clientEmail,
            _newGigContract.description,
            block.timestamp + 120 minutes,
            _newGigContract.price,
            _newGigContract.freeLancer
        );
        _gigSecured.editGigFreelancer(
            1,
            "Tola",
            "adetolakemi97@gmail.com",
            address(0x32)
        );
        vm.stopPrank();
        assertEq(_gigSecured.getGig(1).freelancerName, "Tola");
        assertEq(
            _gigSecured.getGig(1).freelancerEmail,
            "adetolakemi97@gmail.com"
        );
        assertEq(_gigSecured.getGig(1).freeLancer, address(0x32));
    }

    function testWrongUpdateGigStatus() external {
        testAddGigContract();
        vm.startPrank(_clientAddress);
        vm.expectRevert(GigSecured.InvalidStatusChange.selector);
        _gigSecured.updateGig(1, GigSecured.Status.Building);
        vm.stopPrank();
    }

    function testNotYetTimeToDispute() external {
        testAddGigContract();
        vm.startPrank(_freelancerAddress);
        _gigSecured.updateGig(1, GigSecured.Status.Completed);
        vm.stopPrank();

        vm.startPrank(_clientAddress);
        vm.expectRevert(GigSecured.ContractSettlementTimeNotActive.selector);
        vm.warp(259000);
        _gigSecured.updateGig(1, GigSecured.Status.Dispute);
        vm.stopPrank();
    }

    function testSignBeforeBuilding() external {
        testAddGigContract();
        vm.startPrank(_freelancerAddress);
        vm.expectRevert(GigSecured.MustSignBeforeStartBuilding.selector);
        _gigSecured.updateGig(1, GigSecured.Status.Building);
        vm.stopPrank();
    }

    function testDeadlinePassedForBuilding() external {
        // testAddGigContract();
        // vm.startPrank(_freelancerAddress);
        testFreelancerSign();
        vm.expectRevert(GigSecured.DeadlineHasPassedForBuilding.selector);
        vm.warp(550000);
        _gigSecured.updateGig(1, GigSecured.Status.Building);
        vm.stopPrank();
    }

    function testDeadlinePassedForCompletion() external {
        testAddGigContract();
        vm.startPrank(_freelancerAddress);
        vm.warp(550000);
        vm.expectRevert(GigSecured.DeadlineHasPassedForCompletion.selector);
        _gigSecured.updateGig(1, GigSecured.Status.Completed);
        vm.stopPrank();
    }

    function testTooSoonToDispute() external {
        testAddGigContract();
        vm.startPrank(_freelancerAddress);
        vm.expectRevert(GigSecured.TooSoonToDispute.selector);
        vm.warp(259000);
        _gigSecured.updateGig(1, GigSecured.Status.Dispute);
        vm.stopPrank();
    }

    function testFreelancerAuditCall() external {
        vm.startPrank(_freelancerAddress);
        _gigSecured.updateGig(1, GigSecured.Status.Completed);
        vm.warp(259300);
        _gigSecured.updateGig(1, GigSecured.Status.Dispute);
        vm.stopPrank();

        assertEq(_gigSecured.getGig(1).auditor, _governance);
        //     testAddGigContract();
        //     vm.startPrank(_freelancerAddress);
        //     _gigSecured.updateGig(1, GigSecured.Status.Completed);
        //     assertEq(
        //         uint256(_newGigContract._status),
        //         uint256(GigSecured.Status.Completed)
        //     );
        //            assertEq(_newGigContract.completedTime, block.timestamp);

        //     _gigSecured.updateGig(1, GigSecured.Status.Dispute);
        //     vm.expectCall(address(_auditor), GigSecured._freeLancerAudit(1));

        //vm.expectRevert(GigSecured.InvalidStatusChange.selector);
        //     _gigSecured.updateGig(1, GigSecured.Status.Closed);
    }

    function testAssignAuditorInDispute() external {
        testAddGigContract();
        vm.startPrank(_freelancerAddress);
        _gigSecured.updateGig(1, GigSecured.Status.Completed);
        vm.stopPrank();

        vm.startPrank(_clientAddress);
        vm.warp(259300);
        _gigSecured.updateGig(1, GigSecured.Status.Dispute);
        vm.stopPrank();

        assertEq(_gigSecured.getGig(1).auditor, _governance);
    }

    function testGetGig() public {
        testAddGigContract();
        assertEq(_gigSecured.getGig(1).title, "Natachi White Paper Contract");
    }
}

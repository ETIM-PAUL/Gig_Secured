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
    uint _gigs;

    enum Status {
        Pending,
        Building,
        Completed,
        UnderReview,
        Dispute,
        Closed
    }

    function setUp() public {
        _gigSecured = new GigSecured(
            address(_audit),
            _governance,
            address(_governance)
        );
        _audit = new Audit(_governance);
        _usdc = new USDC();

        (_clientAddress, _privKeyClient) = mkaddr("Client");
        (_freelancerAddress, _privKeyFreelancer) = mkaddr("Freelancer");
        (_auditor, ) = mkaddr("Freelancer");

        // _usdc._mint(_clientAddress, 1000);

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
            _status: Status.Pending,
            isAudit: false,
            auditor: _auditor,
            price: 100000000,
            creator: _clientAddress
        });
    }
}

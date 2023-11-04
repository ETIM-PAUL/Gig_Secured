// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {GigSecured} from "../src/GigSecured.sol";
import {Audit} from "../src/Audit.sol";
import "./Helper.sol";

contract GigSecuredTest is Helpers {
    GigSecured private _gigSecured;
    Audit private _audit;

    address _governance;

    address _clientAddress;
    address _freelancerAddress;
    address _auditor;

    uint256 _privKeyClient;
    uint256 _privKeyFreelancer;

    enum Status {
        Pending,
        Building,
        Completed,
        UnderReview,
        Dispute,
        Closed
    }

    function setUp() public {
        _gigSecured = new GigSecured();
        _audit = new Audit();

        (_clientAddress, _privKeyClient) = mkaddr("Client");
        (_freelancerAddress, _privKeyFreelancer) = mkaddr("Freelancer");
        (_auditor) = mkaddr("Freelancer");

        newGigContract = GigSecured.GigContract({
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
            stages: [],
            _status: Status,
            isAudit: false,
            auditor: _auditor,
            price: 100000000,
            creator: _clientAddress
        });
        nft.mintTo(accountA);
    }
}

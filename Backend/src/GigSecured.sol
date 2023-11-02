// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract GigSecured {
    struct Gig {
        string title;
        string category;
        string clientName;
        string clientEmail;
        bytes clientSign;
        string freelancerName;
        string freelancerEmail;
        bytes freelancerSign;
        string description;
        uint deadline;
        string[] stages;
        Status _status;
        bool isAudit;
        uint price;
        address creator;
    }

    enum Status {
        Pending,
        Building,
        Completed,
        UnderReview,
        Dispute,
        Closed
    }

    uint _gigs;

    address _gigsAdministrator;
    address _auditContract;

    mapping(uint256 => Gig) private _allGigs;

    function addGig() public {}

    function freeLancerSign() public {}

    function editGig() public {}

    function updateGig() public {}

    function _sendPayment() internal {}

    function _assignAuditor() internal {}

    function getGig() public {}
}

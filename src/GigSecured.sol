// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract GigSecured {
    struct Gig {
        string title;
        string category;
        string client_name;
        string client_email;
        bytes clientSign;
        string freelancer_name;
        string freelancer_email;
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

    uint gigs;

    address gigs_Administrator;
    address auditContract;

    mapping(uint256 => Gig) private Gigs;

    function addGig() public {}

    function freeLancerSign() public {}

    function editGig() public {}

    function updateGig() public {}

    function sendPayment() internal {}

    function assignAuditor() internal {}

    function getGig() public {}
}

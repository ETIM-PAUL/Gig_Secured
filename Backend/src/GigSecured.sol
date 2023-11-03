// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract GigSecured {
    event GigContractCreated(string title, address creator, address freelancer);
    struct GigContract {
        string title;
        string category;
        string clientName;
        string clientEmail;
        bytes clientSign;
        string freelancerName;
        string freelancerEmail;
        address freeLancer;
        bytes freelancerSign;
        string description;
        uint deadline;
        uint completedTime;
        string[] stages;
        Status _status;
        bool isAudit;
        address auditor;
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

    address _gigSecuredAdministrator;
    address _auditContract;

    mapping(uint256 => GigContract) private _allGigs;

    error AtLeastAnHour(uint deadline);
    error InvalidFreelancer(address freeLancer);
    error MaxStagesOfDevelopment();
    error NotAssignedFreeLancer();

    event GigStatusUpdated(uint gigId, Status newStatus);
    event GigDeadlineUpdated(uint gigId, Status newDeadline);
    event GigTitleUpdated(uint gigId, Status newTitle);
    event GigDescriptionUpdated(uint gigId, Status newDescription);
    event GigCategoryUpdated(uint gigId, Status newCategory);
    event GigFreelancerUpdated(
        uint gigId,
        Status newFreelancerName,
        Status newFreelancerEmail,
        Status newFreelancerAddress
    );

    constructor(address auditContract, address gigSecuredAdministrator) {
        _gigSecuredAdministrator = gigSecuredAdministrator;
        _auditContract = auditContract;
    }

    modifier onlyClient(uint gigId) {
        GigContract storage _newGigContract = _allGigs[gigId];
        require(msg.sender == _newGigContract.creator, "Not Client");
        _;
    }

    modifier onlyFreelancer(uint gigId) {
        GigContract storage _newGigContract = _allGigs[gigId];
        require(msg.sender == _newGigContract.freeLancer, "Not Freelancer");
        _;
    }

    function addGig(
        string memory _title,
        string memory _category,
        bytes _clientSign,
        string memory _clientName,
        string memory _clientEmail,
        string memory _description,
        uint _deadline,
        string[] memory _stages,
        uint _price,
        address _freelancer
    ) public {
        if (_deadline < (block.timestamp + 3600)) {
            revert AtLeastAnHour(_deadline);
        }
        if (_freelancer == address(0)) {
            revert InvalidFreelancer(_freelancer);
        }
        if (_stages.length > 4) {
            revert MaxStagesOfDevelopment();
        }
        uint newGig = _gigs++;
        GigContract storage _newGigContract = _allGigs[newGig];
        _newGigContract.title = _title;
        _newGigContract.category = _category;
        _newGigContract.clientName = _clientName;
        _newGigContract.clientEmail = _clientEmail;
        _newGigContract.clientSign = _clientSign;
        _newGigContract.description = _description;
        _newGigContract.deadline = _deadline;
        _newGigContract.deadline = _deadline;
        _newGigContract.stages = _stages;
        _newGigContract.price = _price;
        _newGigContract.freeLancer = _freelancer;

        emit GigContractCreated(_title, msg.sender, _freelancer);
    }

    function freeLancerSign(bytes freelancerSign) public onlyFreelancer {
        NotAssignedFreeLancer();
    }

    function editGigDeadline(
        uint256 gigId,
        uint256 newDeadline
    ) public onlyClient(gigId) {
        GigContract storage gig = _allGigs[gigId];
        require(
            gig._status == Status.Pending,
            "Cannot edit deadline if not Pending"
        );
        if (newDeadline < (block.timestamp + 3600)) {
            revert AtLeastAnHour(newDeadline);
        }

        gig.deadline = newDeadline;

        emit GigDeadlineUpdated(gigId, newDeadline);
    }

    function editGigTitle(
        uint gigId,
        string memory newTitle
    ) public onlyClient {
        GigContract storage gig = _allGigs[gigId];
        require(
            gig._status == Status.Pending,
            "Cannot edit title if not Pending"
        );

        gig.title = newTitle;

        emit GigTitleUpdated(gigId, newTitle);
    }

    function editGigDescription(
        uint gigId,
        string memory newDescription
    ) public onlyClient(gigId) {
        GigContract storage gig = _allGigs[gigId];
        require(
            gig._status == Status.Pending,
            "Cannot edit title if not Pending"
        );

        gig.description = newDescription;

        emit GigDescriptionUpdated(gigId, newDescription);
    }

    function editGigCategory(
        uint gigId,
        string memory newCategory
    ) public onlyClient(gigId) {
        GigContract storage gig = _allGigs[gigId];
        require(
            gig._status == Status.Pending,
            "Cannot edit category if not Pending"
        );

        gig.category = newCategory;

        emit GigCategoryUpdated(gigId, newCategory);
    }

    function editGigFreelancer(
        uint256 gigId,
        string memory newFreelancerName,
        string memory newFreelancerEmail,
        address newFreelancerAddress
    ) public onlyClient(gigId) {
        GigContract storage gig = _allGigs[gigId];

        require(
            gig._status == Status.Pending,
            "Cannot change freelancer once contract commences"
        );

        gig.freelancerName = newFreelancerName;
        gig.freelancerEmail = newFreelancerEmail;
        gig.freeLancer = newFreelancerAddress;

        emit GigFreelancerUpdated(
            gigId,
            newFreelancerName,
            newFreelancerEmail,
            newFreelancerAddress
        );
    }

    function updateGig(uint gigId, Status _status) public {
        GigContract storage _newGigContract = _allGigs[gigId];
        if (_newGigContract.creator == msg.sender) {
            clientUpdateGig(_status, gigId);
        }
        if (_newGigContract.freeLancer == msg.sender) {
            freeLancerUpdateGig(_status);
        }
    }

    function _sendPayment() internal {}

    function _assignAuditor(
        string category
    ) internal returns (address auditor) {
        auditor = IAuditor(_auditContract).assignAuditor(category);
    }

    function clientUpdateGig(
        uint256 gigId,
        Status newStatus
    ) public onlyClient(gigId) {
        GigContract storage gig = _allGigs[gigId];

        if (
            gig._status == Status.Completed &&
            (newStatus == Status.UnderReview || newStatus == Status.Dispute)
        ) {
            require(
                block.timestamp <= gig.completedTime + 259200,
                "Too late to update"
            );
            gig._status = newStatus;
        } else if (gig._status == Status.UnderReview) {
            if (newStatus == Status.Closed) {
                _sendPayment(gigId);
                gig._status = newStatus;
            } else if (newStatus == Status.Dispute) {
                require(
                    gig.completedTime > (block.timestamp + 259200),
                    "Contract Settlement Time Not Active"
                );

                address _auditor = _assignAuditor(gig._category);
                gig.auditor = _auditor;
                gig.isAudit = true;

                gig._status = newStatus;
            } else {
                revert("Invalid status change");
            }
        } else {
            revert("Invalid status change");
        }
    }

    function freeLancerUpdateGig(
        uint256 gigId,
        Status newStatus
    ) public onlyFreelancer(gigId) {
        GigContract storage gig = _allGigs[gigId];

        // Building
        if (newStatus == Status.Building) {
            require(gig.freeLancerSigned, "Must sign before start building");

            // Completed
        } else if (newStatus == Status.Completed) {
            require(block.timestamp < gig.deadline, "Deadline has passed");

            gig.completedTime = block.timestamp;

            // Dispute
        } else if (newStatus == Status.Dispute) {
            require(gig.completedTime > 0, "Must complete gig first");

            require(
                gig.completedTime > (block.timestamp + 259200),
                "Too soon to dispute"
            );

            // Invalid
        } else {
            revert("Invalid status");
        }

        gig._status = newStatus;

        emit GigStatusUpdated(gigId, newStatus);
    }

    // New function
    function freeLancerAudit(uint256 gigId) public onlyFreelancer(gigId) {
        GigContract storage gig = _allGigs[gigId];

        require(gig._status == Status.Completed, "Gig not completed");
        require(gig.completedTime > 0, "Must have completed time");
        require(
            gig.completedTime > (block.timestamp + 259200),
            "Too soon to audit"
        );
    }

    function getGig() public {}
}

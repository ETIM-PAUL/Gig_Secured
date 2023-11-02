// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {EscrowUtils} from "./library/EscrowLibrary.sol";

contract GigSecured {
    event GigContractCreated(string title, address creator, address freelancer);
    event GigStatusUpdated(uint gigId, Status newStatus);
    event GigDeadlineUpdated(uint gigId, uint newDeadline);
    event GigFreelancerUpdated(
        uint gigId,
        string newFreelancerName,
        string newFreelancerEmail,
        address newFreelancerAddress
    );
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
        bytes memory _clientSign,
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

    function freeLancerSign(
        bytes memory _freelancerSign,
        uint _gigContract
    ) external returns (bool success) {
        GigContract storage gigContract = _allGigs[_gigContract];
        bool isVerified = EscrowUtils.verify(
            msg.sender,
            gigContract.title,
            _gigContract,
            gigContract.price,
            gigContract.deadline,
            _freelancerSign
        );
        if (!isVerified) {
            revert NotAssignedFreeLancer();
        } else {
            gigContract.freelancerSign = _freelancerSign;
            success = true;
        }
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
    ) public onlyClient(gigId) {
        GigContract storage gig = _allGigs[gigId];
        require(
            gig._status == Status.Pending,
            "Cannot edit title if not Pending"
        );
        gig.title = newTitle;
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

    function updateGig(uint _id, Status _status) public {
        GigContract storage _newGigContract = _allGigs[_id];
        if (_newGigContract.creator == msg.sender) {
            _clientUpdateGig(_status, _id);
        }
        if (_newGigContract.freeLancer == msg.sender) {
            _freeLancerUpdateGig(_status, _id);
        }
    }

    function _sendPayment(uint gig) internal {}

    function _assignAuditor(
        string memory category
    ) internal returns (address auditor) {
        auditor = IAuditor(_auditContract).assignAuditor(category);
    }

    function _clientUpdateGig(
        Status _status,
        uint gigId
    ) internal onlyClient(gigId) {
        GigContract storage _gigContract = _allGigs[gigId];
        _gigContract._status = _status;
        string memory _category = _gigContract.category;
        if (_status == Status.Dispute) {
            require(
                (_status == Status.UnderReview &&
                    _gigContract.completedTime > (block.timestamp + 259200)),
                "Contract Settlement Time Not Active"
            );
            address _auditor = _assignAuditor(_category);
            _gigContract.auditor = _auditor;
            _gigContract.isAudit = true;
            _gigContract._status = _status;
        }

        emit GigStatusUpdated(gigId, _status);
    }

    function _freeLancerUpdateGig(
        Status _status,
        uint gigId
    ) internal onlyFreelancer(gigId) {
        GigContract storage _gigContract = _allGigs[gigId];
        _gigContract._status = _status;
        string memory _category = _gigContract.category;
        if (_status == Status.Completed) {
            require(
                (_status == Status.Building &&
                    _gigContract.completedTime < (block.timestamp + 259200)),
                "Contract Settlement Time Not Active"
            );
            address _auditor = _assignAuditor(_category);
            _gigContract.auditor = _auditor;
            _gigContract.isAudit = true;
            _gigContract._status = _status;
        }
    }

    function getGig(
        uint _gigId
    ) external returns (GigContract memory gigContract) {
        gigContract = _allGigs[_gigId];
    }
}

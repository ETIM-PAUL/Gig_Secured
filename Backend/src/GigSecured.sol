// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {EscrowUtils} from "./library/EscrowLibrary.sol";
import {IAudit} from "./interface/IAudit.sol";
import {IERC20} from "./interface/IERC20.sol";

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

    address _governanceAddress;
    address _usdcAddress;
    address _auditContract;

    mapping(uint256 => GigContract) private _allGigs;

    error AtLeastAnHour(uint deadline);
    error InvalidFreelancer(address freeLancer);
    error MaxStagesOfDevelopment();
    error NotAssignedFreeLancer();
    error NotPermitted();
    error RemissionFailed();

    constructor(
        address auditContract,
        address governance,
        address usdcAddress
    ) {
        _governanceAddress = governance;
        _auditContract = auditContract;
        _usdcAddress = usdcAddress;
    }

    modifier onlyClient(uint gigId) {
        GigContract storage _newGigContract = _allGigs[gigId];
        require(msg.sender == _newGigContract.creator, "Not Client");
        _;
    }

    modifier onlyGovernance() {
        require(msg.sender == _governanceAddress, "Only Governance");
        _;
    }

    modifier onlyFreelancer(uint gigId) {
        GigContract storage _newGigContract = _allGigs[gigId];
        require(msg.sender == _newGigContract.freeLancer, "Not Freelancer");
        _;
    }
    modifier onlyAuditor(uint gigId) {
        GigContract storage _newGigContract = _allGigs[gigId];
        require(msg.sender == _newGigContract.auditor, "Not Auditor");
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
        bool success = IERC20(_usdcAddress).transferFrom(
            msg.sender,
            address(this),
            _price
        );
        if (!success) {
            revert RemissionFailed();
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
            clientUpdateGig(_status, _id);
        }
        if (_newGigContract.freeLancer == msg.sender) {
            freeLancerUpdateGig(_id, _status);
        }
    }

    function _sendPaymentClosed(uint gigId) internal {
        GigContract storage gig = _allGigs[gigId];
        uint clientPaybackFee = EscrowUtils.cientNoAudit(gig.price);
        uint freelancerPaybackFee = EscrowUtils.freeLancerNoAudit(gig.price);

        bool successRemitClient = IERC20(_usdcAddress).transfer(
            gig.creator,
            clientPaybackFee
        );
        bool successPayFreelancer = IERC20(_usdcAddress).transfer(
            gig.freeLancer,
            freelancerPaybackFee
        );
        require(successRemitClient && successPayFreelancer, "Payment Failed");
    }

    function sendPaymentAfterAuditorSettle(
        uint gigId,
        uint freelancerPercent
    ) external onlyAuditor(gigId) onlyGovernance {
        GigContract storage gig = _allGigs[gigId];
        require(
            freelancerPercent > 0 && freelancerPercent <= 92,
            "Out of bounds"
        );
        uint auditPaymentFee = EscrowUtils.auditFees(gig.price);
        uint systemPaymentFee = EscrowUtils.systemAuditFees(gig.price);
        uint freelancerPaymentFee = EscrowUtils.freeLancerAudit(
            gig.price,
            freelancerPercent
        );

        bool successPayAuditor = IERC20(_usdcAddress).transfer(
            gig.auditor,
            auditPaymentFee
        );
        bool successPayFreelancer = IERC20(_usdcAddress).transfer(
            gig.freeLancer,
            freelancerPaymentFee
        );

        uint clientPaybackFee = gig.price -
            (auditPaymentFee + freelancerPaymentFee + systemPaymentFee);
        if (clientPaybackFee > 0) {
            IERC20(_usdcAddress).transfer(gig.creator, clientPaybackFee);
        }
        require(successPayAuditor && successPayFreelancer, "Payment Failed");
    }

    function _assignAuditor(
        string memory category
    ) internal view returns (address auditor) {
        auditor = IAudit(_auditContract).getAuditorByCategory(category);
    }

    function clientUpdateGig(
        Status newStatus,
        uint256 gigId
    ) public onlyClient(gigId) returns (bool success) {
        GigContract storage gig = _allGigs[gigId];
        if (
            gig._status == Status.Completed && newStatus == Status.UnderReview
        ) {
            gig._status = newStatus;
            success = true;
        } else if (gig._status == Status.UnderReview) {
            if (newStatus == Status.Closed) {
                gig._status = newStatus;
                _sendPaymentClosed(gigId);
            } else if (newStatus == Status.Dispute) {
                require(
                    gig.completedTime > (block.timestamp + 259200),
                    "Contract Settlement Time Not Active"
                );

                address _auditor = _assignAuditor(gig.category);
                gig.auditor = _auditor;
                gig.isAudit = true;

                gig._status = newStatus;
            }
            success = true;
        } else {
            revert("Invalid status change");
        }
    }

    function freeLancerUpdateGig(
        uint256 gigId,
        Status newStatus
    ) public onlyFreelancer(gigId) {
        GigContract storage gig = _allGigs[gigId];

        if (newStatus == Status.Building) {
            require(
                (gig.freelancerSign).length > 0,
                "Must sign before start building"
            );
            require(block.timestamp < gig.deadline, "Deadline has passed");
            gig._status = Status.Building;
        } else if (newStatus == Status.Completed) {
            require(block.timestamp < gig.deadline, "Deadline has passed");
            gig.completedTime = block.timestamp;
            gig._status = Status.Completed;
        } else if (newStatus == Status.Dispute) {
            require(
                gig.completedTime > (block.timestamp + 259200),
                "Too soon to dispute"
            );
            _freeLancerAudit(gigId);
        } else {
            revert("Invalid status");
        }

        gig._status = newStatus;

        emit GigStatusUpdated(gigId, newStatus);
    }

    function _freeLancerAudit(uint256 gigId) internal {
        GigContract storage gig = _allGigs[gigId];
        address _auditor = _assignAuditor(gig.category);
        gig.auditor = _auditor;
        gig.isAudit = true;

        gig._status = Status.Dispute;
    }

    function getGig(uint256 _gigId) public view returns (GigContract memory) {
        return _allGigs[_gigId];
    }
}

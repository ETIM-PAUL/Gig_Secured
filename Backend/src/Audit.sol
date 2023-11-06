// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Audit {
    //states
    struct Auditor {
        string category;
        string email;
        address _auditor;
        uint currentGigs;
        bool isConfirmed;
        uint32 confirmationTime;
    }

    Auditor[] public auditors;
    mapping(address => Auditor) public auditor_;
    mapping(address => bool) private _auditorAdmins;
    mapping(address => bool) public gigContractAddresses;

    address private _governanceContract;

    //events
    event AuditorRemoved(address indexed removedAuditor);
    event AuditorConfirmed(address indexed confirmedAuditor);

    // Custom errors
    error ExceededMaximumCategory();
    error GigsExceeded();
    error OnlyContractAreAllowed();
    error AlreadyConfirmed();
    error ZeroAddress();
    error CategoryNotFound();
    error NoConfirmedAuditors();
    error AuditorNotFound();
    error NoAvailableAuditor();
    error AuditorHasCurrentTasks();
    error OnlyGovernanceAllowed();
    error onlyGigContractAllowed();
    error OnlyEoa();
    error NotOwner();
    error NoGigForAuditor();

    constructor() {
        _auditorAdmins[msg.sender] = true;
    }

    //modifiers

    modifier onlyGovernance() {
        require(
            _auditorAdmins[msg.sender] || _governanceContract == msg.sender,
            "Only Governance or An Admin"
        );
        _;
    }

    modifier onlyPermittedAccounts() {
        bool isGigContract = gigContractAddresses[msg.sender];
        require(
            _auditorAdmins[msg.sender] || isGigContract,
            "Only Governance or Gig Contract Owner"
        );
        _;
    }

    function becomeAuditor(
        string memory _category,
        string memory _email
    ) public {
        Auditor memory newAuditor = Auditor({
            category: _category,
            email: _email,
            _auditor: msg.sender,
            currentGigs: 0,
            isConfirmed: false,
            confirmationTime: uint32(block.timestamp)
        });

        auditors.push(newAuditor);
        auditor_[msg.sender] = newAuditor;
    }

    //create an array of child contract, then each time, a child contract is created, we push the child contract address
    function addGigContractAddresses(
        address childContractAddress
    ) external onlyGovernance {
        if (childContractAddress == address(0)) {
            revert ZeroAddress();
        }
        gigContractAddresses[childContractAddress] = true;
    }

    function confirmAuditor(address _auditorAddr) external onlyGovernance {
        if (auditor_[_auditorAddr].isConfirmed == true) {
            revert AlreadyConfirmed();
        }

        if (_auditorAddr == address(0)) {
            revert ZeroAddress();
        }

        auditor_[_auditorAddr].isConfirmed = true;
        emit AuditorConfirmed(_auditorAddr);
    }

    function getAuditorByCategory(
        string memory _category
    ) external view returns (address selectedAuditor) {
        uint32 earliestConfirmationTime = type(uint32).max;
        bool foundCategory = false;

        for (uint i = 0; i < auditors.length; i++) {
            if (
                keccak256(abi.encodePacked(auditors[i].category)) ==
                keccak256(abi.encodePacked(_category))
            ) {
                foundCategory = true;
                if (
                    auditors[i].isConfirmed &&
                    auditors[i].confirmationTime < earliestConfirmationTime
                ) {
                    selectedAuditor = auditors[i]._auditor;
                    earliestConfirmationTime = auditors[i].confirmationTime;
                }
            }
        }

        if (!foundCategory) {
            // If no auditor is found, assign governance
            selectedAuditor = _governanceContract;
        } else if (earliestConfirmationTime == type(uint32).max) {
            // If foundCategory is true but no confirmed auditor is found, assign it to governance
            selectedAuditor = _governanceContract;
        }

        return selectedAuditor;
    }

    function removeAuditor(address _auditor) external onlyGovernance {
        if (_auditor == address(0)) {
            revert ZeroAddress();
        }

        Auditor storage auditorToRemove = auditor_[_auditor];

        if (auditorToRemove.currentGigs > 0) {
            Auditor memory replacementAuditor = _findAvailableAuditor();

            replacementAuditor.currentGigs += auditorToRemove.currentGigs;
        }

        // Find the index of the auditor to remove in the auditors array
        uint indexToRemove;
        for (uint i = 0; i < auditors.length; i++) {
            if (auditors[i]._auditor == _auditor) {
                indexToRemove = i;
                break;
            }
        }

        // Remove the auditor from the auditors array
        if (indexToRemove < auditors.length - 1) {
            auditors[indexToRemove] = auditors[auditors.length - 1];
        }
        //add index to pop
        auditors.pop();

        delete auditor_[_auditor];
        emit AuditorRemoved(_auditor);
    }

    function _findAvailableAuditor() internal view returns (Auditor memory) {
        //Please add functionality to assign governance
        Auditor memory selectedAuditor;
        uint32 earliestConfirmationTime = type(uint32).max;

        for (uint i = 0; i < auditors.length; i++) {
            if (
                auditors[i].isConfirmed &&
                auditors[i].currentGigs == 0 &&
                auditors[i].confirmationTime < earliestConfirmationTime
            ) {
                selectedAuditor = auditors[i];
                earliestConfirmationTime = auditors[i].confirmationTime;
            }
        }

        return selectedAuditor;
    }

    function increaseAuditorCurrentGigs(
        address _auditor
    ) external onlyPermittedAccounts {
        if (_auditor == address(0)) {
            revert ZeroAddress();
        }

        Auditor storage auditorToEdit = auditor_[_auditor];
        auditorToEdit.currentGigs += 1;
    }

    function decreaseAuditorCurrentGigs(
        address _auditor
    ) external onlyPermittedAccounts {
        if (_auditor == address(0)) {
            revert ZeroAddress();
        }
        Auditor storage auditorToEdit = auditor_[_auditor];
        if (auditorToEdit.currentGigs == 0) {
            revert NoGigForAuditor();
        }

        auditorToEdit.currentGigs -= 1;
    }

    function addAuditorAdmin(address _auditorAdmin) external onlyGovernance {
        _auditorAdmins[_auditorAdmin] = true;
    }

    function setGovernanceContract(
        address _governance
    ) external onlyPermittedAccounts {
        _governanceContract = _governance;
    }
}

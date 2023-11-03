// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Audit {
    struct Auditor {
        string category;
        string email;
        address _auditor;
        uint currentGigs;
        bool isConfirmed;
        uint32 confirmationTime;
    }

    address private _owner;
    Auditor[] private _auditors;
    mapping(address => Auditor) public auditor_;

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
    error OnlyEoa();

    // Address of the governance contract
    address private _governanceContract;

    modifier onlyGovernance() {
        if (msg.sender != _governanceContract) {
            revert OnlyGovernanceAllowed();
        }
        _;
    }

    constructor(address _governance) {
        if (_governance == address(0)) {
            revert ZeroAddress();
        }
        _governanceContract = _governance;
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

        _auditors.push(newAuditor);
        auditor_[msg.sender] = newAuditor;
    }

    function addGigContractAddresses() external onlyGovernance {
        //create an array of child contract, then each time, a child contract is created, we push the child contract address
    }

    function confirmAuditor(
        address _auditorAddr
    ) external onlyOwner onlyGovernance {
        // if (_auditorAddr == tx.origin) {
        //     revert OnlyEoa();
        // }

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

        for (uint i = 0; i < _auditors.length; i++) {
            if (
                keccak256(abi.encodePacked(_auditors[i].category)) ==
                keccak256(abi.encodePacked(_category))
            ) {
                foundCategory = true;
                if (
                    _auditors[i].isConfirmed &&
                    _auditors[i].confirmationTime < earliestConfirmationTime
                ) {
                    selectedAuditor = _auditors[i]._auditor;
                    earliestConfirmationTime = _auditors[i].confirmationTime;
                }
            }
        }

        if (!foundCategory) {
            revert CategoryNotFound();
        }

        if (earliestConfirmationTime == type(uint32).max) {
            // if no auditor is found, assign governance
            revert NoConfirmedAuditors();
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

            // if (replacementAuditor._auditor == address(0)) {
            //     //assign to governance
            //     revert NoAvailableAuditor();
            // }

            replacementAuditor.currentGigs += auditorToRemove.currentGigs;
        }

        // Find the index of the auditor to remove in the _auditors array
        uint indexToRemove;
        for (uint i = 0; i < _auditors.length; i++) {
            if (_auditors[i]._auditor == _auditor) {
                indexToRemove = i;
                break;
            }
        }

        // Remove the auditor from the _auditors array
        if (indexToRemove < _auditors.length - 1) {
            _auditors[indexToRemove] = _auditors[_auditors.length - 1];
        }
        //add index to pop
        _auditors.pop();

        delete auditor_[_auditor];
        emit AuditorRemoved(_auditor);
    }

    function _findAvailableAuditor() internal view returns (Auditor memory) {
        //Please add functionality to assign governance
        Auditor memory selectedAuditor;
        uint32 earliestConfirmationTime = type(uint32).max;

        for (uint i = 0; i < _auditors.length; i++) {
            if (
                _auditors[i].isConfirmed &&
                _auditors[i].currentGigs == 0 &&
                _auditors[i].confirmationTime < earliestConfirmationTime
            ) {
                selectedAuditor = _auditors[i];
                earliestConfirmationTime = _auditors[i].confirmationTime;
            }
        }

        return selectedAuditor;
    }

    function editCurrentGigs(
        address _auditor,
        uint _newCurrentGigs
    ) external onlyGovernance onlyGigContract {
        if (_auditor == address(0)) {
            revert ZeroAddress();
        }

        Auditor storage auditorToEdit = auditor_[_auditor];

        if (_newCurrentGigs > 2) {
            revert GigsExceeded();
        }

        auditorToEdit.currentGigs = _newCurrentGigs;
    }
}

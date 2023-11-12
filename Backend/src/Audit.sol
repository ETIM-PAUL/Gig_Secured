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
        AuditorContracts[] contractsAddress;
    }

    struct AuditorContracts {
        address contractInstance;
        uint id;
    }

    Auditor[] public auditors;
    mapping(address => Auditor) public auditor_;
    mapping(address => bool) private _auditorAdmins;
    mapping(address => bool) public gigContractAddresses;

    uint256 public auditorsCount;

    Auditor[] private _auditorsTobeSelected;

    mapping(string => Auditor[]) public auditorsByCategory;

    address _governanceContract;

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
        Auditor storage newAuditor = auditor_[msg.sender];
        newAuditor.category = _category;
        newAuditor.email = _email;
        newAuditor._auditor = msg.sender;
        newAuditor.currentGigs = 0;
        newAuditor.isConfirmed = false;
        newAuditor.confirmationTime = 0;
        // newAuditor.contractsAddress = new AuditorContracts[](0);

        auditors.push(newAuditor);
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

        auditorsCount++;
        auditor_[_auditorAddr].isConfirmed = true;
        auditor_[_auditorAddr].confirmationTime = uint32(block.timestamp);

        emit AuditorConfirmed(_auditorAddr);
    }

    function checkAuditorStatus(
        address _auditor
    ) external view returns (bool isAuditorConfirmed) {
        isAuditorConfirmed = auditor_[_auditor].isConfirmed;
    }

    function getAuditorByCategory(
        string memory _category
    ) external returns (address selectedAuditor) {
        // uint256 earliestConfirmationTime = type(uint32).max; // Initialize earliestConfirmationTime to the maximum value of uint256
        // bool notFound = true;

        for (uint256 i = 0; i < auditorsCount; ++i) {
            if (
                (keccak256(abi.encode(auditors[i].category)) ==
                    keccak256(abi.encode(_category))) &&
                (auditors[i].currentGigs < 2) &&
                (auditors[i].isConfirmed)
            ) {
                _auditorsTobeSelected.push(auditor_[auditors[i]._auditor]);
            }
        }

        if (_auditorsTobeSelected.length > 0) {
            if (_auditorsTobeSelected.length == 1) {
                //selectedAuditor = _auditorsTobeSelected[0]._auditor
            } else {
                //uint256 nonce =  ISupraRouter(supraAddr).generateRequest("finishLootBox(uint256,uint256[])", 1, 1, 123, supraClientAddress);
                //uint8 auditorId = nonce % (auditorsTobeSelected.length + 1)
                //selectedAuditor = _auditorsTobeSelected[auditorId]._auditor
            }
        } else {
            selectedAuditor = _governanceContract;
        }

        // for (uint i = 0; i < _auditorsTobeSelected.length; ++i) {
        //     if (
        //         _auditorsTobeSelected[i].isConfirmed &&
        //         _auditorsTobeSelected[i].currentGigs == 0 &&
        //         _auditorsTobeSelected[i].confirmationTime <
        //         earliestConfirmationTime
        //     ) {
        //         selectedAuditor = _auditorsTobeSelected[i]._auditor; // Update selectedAuditor with the auditor address
        //         notFound = true;
        //         earliestConfirmationTime = _auditorsTobeSelected[i]
        //             .confirmationTime; // Update earliestConfirmationTime with the new minimum confirmation time
        //     }
        // }
    }

    function removeAuditor(address _auditor) external onlyGovernance {
        if (_auditor == address(0)) {
            revert ZeroAddress();
        }

        Auditor storage auditorToRemove = auditor_[_auditor];

        if (auditorToRemove.currentGigs > 0) {
            Auditor memory replacementAuditor = _findAvailableAuditor();
            if (replacementAuditor._auditor == address(0)) {}

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
        address _auditor,
        address _gigContract,
        uint _gigId
    ) external onlyPermittedAccounts {
        if (_auditor == address(0)) {
            revert ZeroAddress();
        }

        Auditor storage auditorToEdit = auditor_[_auditor];
        AuditorContracts memory _auditorContract;
        _auditorContract.contractInstance = _gigContract;
        _auditorContract.id = _gigId;

        auditorToEdit.currentGigs += 1;
        auditorToEdit.contractsAddress.push(_auditorContract);
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

    function getAuditorByAddress(
        address _auditor
    ) external view returns (Auditor memory) {
        Auditor storage auditor = auditor_[_auditor];
        return auditor;
    }

    function addAuditorAdmin(address _auditorAdmin) external onlyGovernance {
        _auditorAdmins[_auditorAdmin] = true;
    }

    function setGovernanceContract(
        address _governance
    ) external onlyGovernance {
        _governanceContract = _governance;
    }
}

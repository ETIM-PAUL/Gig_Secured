// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// import {ISupraRouterContract} from "../src/interface/ISupraRouterContract.sol";
interface ISupraRouterContract {
    function generateRequest(
        string memory _functionSig,
        uint8 _rngCount,
        uint256 _numConfirmations,
        uint256 _clientSeed
    ) external returns (uint256);
}

contract Audit {
    //states
    ISupraRouterContract internal supraRouter;
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
    address public selectedAuditor;

    //events
    event AuditorRemoved(address indexed removedAuditor);
    event AuditorConfirmed(address indexed confirmedAuditor);
    event AuditorSelected(address indexed selectedAuditor);

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

    constructor(address routerAddress) {
        _auditorAdmins[msg.sender] = true;
        supraRouter = ISupraRouterContract(routerAddress);
        _governanceContract = msg.sender;
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
    ) external returns (address) {
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
                selectedAuditor = _auditorsTobeSelected[0]._auditor;
            } else {
                uint256 nonce = supraRouter.generateRequest(
                    "callbackRan(uint256,uint256[])",
                    1,
                    1,
                    180
                );

                // Note: Using the generated nonce to select an auditor directly
                uint256 randomIndex = nonce % _auditorsTobeSelected.length;
                selectedAuditor = _auditorsTobeSelected[randomIndex]._auditor;
            }
        } else {
            selectedAuditor = _governanceContract;
        }

        return selectedAuditor;
    }

    function callbackRan(uint256[] calldata rngList) external {
        require(
            msg.sender == address(supraRouter),
            "only supra router can call this function"
        );
        require(rngList.length > 0, "no random numbers provided");

        // Add your logic to handle the callback, e.g., select an auditor based on the received random numbers
        // For simplicity, let's use the sum of the random numbers to determine the selected auditor
        uint256 totalRandomness = 0;
        for (uint256 i = 0; i < rngList.length; i++) {
            totalRandomness += rngList[i];
        }

        // Use the totalRandomness to select an auditor
        uint256 randomIndex = totalRandomness % _auditorsTobeSelected.length;
        selectedAuditor = _auditorsTobeSelected[randomIndex]._auditor;

        // Perform any other required actions, e.g., emit an event, update state variables, etc.
        emit AuditorSelected(selectedAuditor);
    }

    // function removeAuditor(address _auditor) external onlyGovernance {
    //     if (_auditor == address(0)) {
    //         revert ZeroAddress();
    //     }

    //     Auditor storage auditorToRemove = auditor_[_auditor];

    //     if (auditorToRemove.currentGigs > 0) {
    //         Auditor memory replacementAuditor = _findAvailableAuditor();
    //         if (replacementAuditor._auditor == address(0)) {}

    //         replacementAuditor.currentGigs += auditorToRemove.currentGigs;
    //     }

    //     // Find the index of the auditor to remove in the auditors array
    //     uint indexToRemove;
    //     for (uint i = 0; i < auditors.length; i++) {
    //         if (auditors[i]._auditor == _auditor) {
    //             indexToRemove = i;
    //             break;
    //         }
    //     }

    //     // Remove the auditor from the auditors array
    //     if (indexToRemove < auditors.length - 1) {
    //         auditors[indexToRemove] = auditors[auditors.length - 1];
    //     }
    //     //add index to pop
    //     auditors.pop();

    //     delete auditor_[_auditor];
    //     emit AuditorRemoved(_auditor);
    // }

    // function _findAvailableAuditor() internal view returns (Auditor memory) {
    //     //Please add functionality to assign governance
    //     Auditor memory selectedAuditor_;
    //     uint32 earliestConfirmationTime = type(uint32).max;

    //     for (uint i = 0; i < auditors.length; i++) {
    //         if (
    //             auditors[i].isConfirmed &&
    //             auditors[i].currentGigs == 0 &&
    //             auditors[i].confirmationTime < earliestConfirmationTime
    //         ) {
    //             selectedAuditor_ = auditors[i];
    //             earliestConfirmationTime = auditors[i].confirmationTime;
    //         }
    //     }

    //     return selectedAuditor_;
    // }

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

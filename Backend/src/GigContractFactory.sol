// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {IAudit} from "./interface/IAudit.sol";
import {Audit} from "./Audit.sol";
import {USDC} from "./USDC.sol";
import {IGigSecured} from "./interface/IGigSecured.sol";
import {GigSecured} from "./GigSecured.sol";

contract GigContractFactory {
    /**
     * @dev STATE VARIABLE
     */
    address[] _gigSecuredContracts;
    address _auditorsContract;
    address _usdcContract;
    address _owner;
    mapping(address => bool) _gigContractExist;

    event GigContractCreated(address indexed creator, address indexed factory);

    error NotOwner();
    error InvalidContract();

    constructor(address auditorsContractAddress, address usdcContractAddress) {
        _owner = msg.sender;
        _usdcContract = usdcContractAddress;
        _auditorsContract = auditorsContractAddress;
    }

    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert NotOwner();
        }
        _;
    }

    function createGigSecuredContractInstance()
        external
        returns (GigSecured newGigSecuredContract)
    {
        newGigSecuredContract = new GigSecured(
            _auditorsContract,
            address(this),
            _usdcContract
        );
        _gigSecuredContracts.push(address(newGigSecuredContract));
        _gigContractExist[address(newGigSecuredContract)] = true;
        IAudit(_auditorsContract).addGigContractAddresses(
            address(newGigSecuredContract)
        );
        emit GigContractCreated(_owner, address(newGigSecuredContract));
    }

    function confirmAnAuditor(address _auditor) external onlyOwner {
        IAudit(_auditorsContract).confirmAuditor(_auditor);
    }

    function removeAnAuditor(address _auditor) external onlyOwner {
        IAudit(_auditorsContract).removeAuditor(_auditor);
    }

    function increaseAnAuditorGigs(address _auditor) external onlyOwner {
        IAudit(_auditorsContract).removeAuditor(_auditor);
    }

    function decreaseAnAuditorGigs(address _auditor) external onlyOwner {
        IAudit(_auditorsContract).removeAuditor(_auditor);
    }

    function forceClosureByGovernance(
        address gigContractAddress,
        uint gigContractId
    ) external onlyOwner {
        if (_gigContractExist[gigContractAddress] == false) {
            revert InvalidContract();
        }
        IGigSecured(gigContractAddress).forceClosure(gigContractId);
    }

    function sendPaymentIncaseAuditDoesnt(
        address gigContractAddress,
        uint gigContractId,
        uint percentToAward
    ) external onlyOwner {
        if (_gigContractExist[gigContractAddress] == false) {
            revert InvalidContract();
        }
        IGigSecured(gigContractAddress).sendPaymentAfterAuditorSettle(
            gigContractId,
            percentToAward
        );
    }
}

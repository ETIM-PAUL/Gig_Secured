// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
/// @title MultiSig - Multi-signature wallet contract
/// @notice This contract implements a multi-signature wallet, allowing multiple addresses to approve transactions.
/// @dev All transactions are represented by the Transaction struct.

contract MultiSig {
    struct Transaction {
        address spender;
        uint amount;
        uint numberOfApproval;
        bool isActive;
    }
    /// @notice List of administrator addresses.
    address[] public Admins;

    /// @dev Minimum number of approvals required for a transaction to be executed.
    uint constant public MINIMUM = 3;

    /// @dev Transaction ID counter.
    uint public transactionId;


    /// @notice Mapping to track whether an address is an administrator.
    mapping(address => bool) public isAdmin;

    /// @notice Mapping to store transaction details based on transaction ID.
    mapping(uint => Transaction) public transaction;

    /// @notice Mapping to track approval status for each transaction by each administrator.
    mapping(uint => mapping(address => bool)) public hasApproved;

/// @param position The position in the address array where the error occurred.
    error InvalidAddress(uint position);
    /// @param number The invalid number of administrators.
    error InvalidAdminNumber(uint number);
    /// @param _addr The duplicate address being added.
    error duplicate(address _addr);
    /// @dev Event emitted when a new transaction is created.
    /// @param who The address triggering the creation of the transaction.
    /// @param spender The address to which funds will be sent.
    /// @param amount The amount of funds to be sent in the transaction.

    event Create(address who, address spender, uint amount);

    /// @dev Modifier to restrict access to administrators.
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not a Valid Admin");
        _;
    }
    /// @dev Constructor to initialize the contract with a list of administrators.
    /// @param _admins An array of administrator addresses.
    /// @dev Requires at least MINIMUM administrators and ensures unique and non-zero addresses.
    
    constructor(address[] memory _admins) payable {
        if (_admins.length < MINIMUM) {
            revert InvalidAdminNumber(MINIMUM);
        }
        for (uint i = 0; i < _admins.length; i++) {
            if (_admins[i] == address(0)) {
                revert InvalidAddress(i + 1);
            }
            if (isAdmin[_admins[i]]) {
                revert duplicate(_admins[i]);
            }

            isAdmin[_admins[i]] = true;
        }
        Admins = _admins;
    }
    /// @dev Function to create a new transaction.
    /// @param amount The amount of funds to be sent in the transaction.
    /// @param _spender The address to which funds will be sent.
    /// @dev Increments the transactionId, initializes the transaction details, emits a Create event, and calls AprroveTransaction.

    function createTransaction(
        uint amount,
        address _spender
    ) external onlyAdmin {
        transactionId++;
        Transaction storage _transaction = transaction[transactionId];
        _transaction.amount = amount;
        _transaction.spender = _spender;
        _transaction.isActive = true;
        emit Create(msg.sender, _spender, amount);
        AprroveTransaction(transactionId);
    }
    

    function AprroveTransaction(uint id) public onlyAdmin {
        //check if addmin has not approved yet;
        require(!hasApproved[id][msg.sender], "Already Approved!!");
        hasApproved[id][msg.sender] = true;

        Transaction storage _transaction = transaction[id];

        require(_transaction.isActive, "Not active");

        _transaction.numberOfApproval += 1;
        uint count = _transaction.numberOfApproval;
        uint MinApp = calculateMinimumApproval();
        if (count >= MinApp) {
            sendtransaction(id);
        }
    }
    /// @dev Function to approve a transaction.
    /// @param id The ID of the transaction to be approved.
    /// @dev Checks if the administrator has not approved yet, updates approval status, and processes the transaction if approval conditions are met.

    function sendtransaction(uint id) internal {
        Transaction storage _transaction = transaction[id];
        payable(_transaction.spender).transfer(_transaction.amount);
        _transaction.isActive = false;
    }
    

    function calculateMinimumApproval() public view returns (uint MinApp) {
        uint size = Admins.length;
        MinApp = (size * 70) / 100;
    }
 /// @dev Function to calculate the minimum number of approvals.
    /// @return MinApp The calculated minimum number of approvals.
    /// @dev The minimum number of approvals is set to 70% of the total number of administrators.
    function getTransaction(
        uint id
    ) external view returns (Transaction memory) {
        return transaction[id];
    }

    receive() external payable {}
}

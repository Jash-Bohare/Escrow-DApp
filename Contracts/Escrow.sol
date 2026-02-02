// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {

    error NotBuyer();
    error NotSeller();
    error NotArbiter();
    error InvalidState();
    error AlreadyFunded();
    error ZeroAmount();
    error TransferFailed();

    enum Status {
        CREATED,
        FUNDED,
        DELIVERED,
        DISPUTED,
        COMPLETED
    }

    address public immutable buyer;
    address public immutable seller;
    address public immutable arbiter;

    uint256 public amount;
    Status public status;

    bool private locked;

    event Deposited(address indexed buyer, uint256 amount);
    event Delivered(address indexed seller);
    event Released(address indexed seller, uint256 amount);
    event Disputed(address indexed raisedBy);
    event Resolved(address indexed arbiter, bool toSeller);

    modifier onlyBuyer() {
        if (msg.sender != buyer) revert NotBuyer();
        _;
    }

    modifier onlySeller() {
        if (msg.sender != seller) revert NotSeller();
        _;
    }

    modifier onlyArbiter() {
        if (msg.sender != arbiter) revert NotArbiter();
        _;
    }

    modifier inState(Status s) {
        if (status != s) revert InvalidState();
        _;
    }

    modifier nonReentrant() {
        require(!locked, "REENTRANCY");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _seller, address _arbiter) {
        require(_seller != address(0));
        require(_arbiter != address(0));

        buyer = msg.sender;
        seller = _seller;
        arbiter = _arbiter;

        status = Status.CREATED;
    }

    /// Buyer deposits ETH
    function deposit() external payable onlyBuyer inState(Status.CREATED) {
        if (msg.value == 0) revert ZeroAmount();

        amount = msg.value;
        status = Status.FUNDED;

        emit Deposited(msg.sender, msg.value);
    }

    /// Seller confirms delivery
    function confirmDelivery() external onlySeller inState(Status.FUNDED) {
        status = Status.DELIVERED;
        emit Delivered(msg.sender);
    }

    /// Buyer releases funds to seller
    function releaseFunds()
        external
        onlyBuyer
        inState(Status.DELIVERED)
        nonReentrant
    {
        status = Status.COMPLETED;

        (bool ok, ) = seller.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Released(seller, amount);
    }

    /// Buyer or Seller raises dispute
    function raiseDispute() external {
        if (
            msg.sender != buyer &&
            msg.sender != seller
        ) revert();

        if (
            status != Status.FUNDED &&
            status != Status.DELIVERED
        ) revert InvalidState();

        status = Status.DISPUTED;
        emit Disputed(msg.sender);
    }

    /// Arbiter resolves dispute
    /// toSeller = true -> seller wins
    /// toSeller = false -> buyer refunded
    function resolveDispute(bool toSeller)
        external
        onlyArbiter
        inState(Status.DISPUTED)
        nonReentrant
    {
        status = Status.COMPLETED;

        address winner = toSeller ? seller : buyer;

        (bool ok, ) = winner.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Resolved(msg.sender, toSeller);
    }

    function getStatus() external view returns (Status) {
        return status;
    }

    receive() external payable {}
}
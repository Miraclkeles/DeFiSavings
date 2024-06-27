pragma solidity ^0.8.0;

contract DeFiSavings {
    address public owner;
    uint256 public interestRateAPY; // APY stands for Annual Percentage Yield
    mapping(address => uint256) public balances;
    mapping(address => uint256) public interestEarned;

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);
    event InterestPaid(address indexed account, uint256 interest);
    event InterestRateUpdated(uint256 newInterestRateAPY);

    constructor(uint256 _initialInterestRateAPY) {
        owner = msg.sender;
        interestRateAPY = _initialInterestRateAPY;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier hasSufficientBalance(uint256 _amount) {
        require(balances[msg.sender] >= _amount, "Insufficient balance.");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be positive.");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public hasSufficientBalance(_amount) {
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawal(msg.sender, _amount);
    }

    function payInterest() public onlyOwner {
        // Implementation remains unchanged as no specific logic is provided for distributing interest.
        // Placeholder for interest distribution logic.
    }

    function setInterestRateAPY(uint256 _newInterestRateAPY) public onlyOwner {
        interestRateAPY = _newInterestRateAPY;
        emit InterestRateUpdated(interestRateAPY);
    }

    function getAccountInfo(address _account) public view returns (uint256 accountBalance, uint256 totalInterestEarned) {
        return (balances[_account], interestEarned[_account]);
    }

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }
}
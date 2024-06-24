pragma solidity ^0.8.0;

contract SavingsContract {
    address public owner;
    uint256 public interestRate;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public interestEarned;

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);
    event InterestPaid(address indexed account, uint256 interest);
    event InterestRateChanged(uint256 newInterestRate);

    constructor(uint256 _initialInterestRate) {
        owner = msg.sender;
        interestRate = _initialInterestRate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier hasFunds(uint256 _amount) {
        require(balances[msg.sender] >= _amount, "Insufficient funds.");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "You must deposit a positive amount of Ether.");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public hasFunds(_amount) {
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawal(msg.sender, _amount);
    }

    function distributeInterest() public onlyOwner {
        for (uint256 i = 0; i < depositors.length; i++) {
            address depositor = depositors[i];
            uint256 interest = (balances[depositor] * interestRate) / 100;
            balances[depositor] += interest;
            interestEarned[depositor] += interest;
            emit InterestPaid(depositor, interest);
        }
    }

    function setInterestRate(uint256 _newInterestRate) public onlyOwner {
        interestRate = _newInterestRate;
        emit InterestRateChanged(interestRate);
    }

    function getAccountInfo(address _account) public view returns (uint256 balance, uint256 earnedInterest) {
        return (balances[_account], interestEarned[_account]);
    }

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }
}
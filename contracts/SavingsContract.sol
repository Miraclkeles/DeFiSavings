pragma solidity ^0.8.0;

contract EnhancedDeFiSavings {
    address public contractOwner;
    uint256 public annualInterestRate;
    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public userAccruedInterest;

    event FundDeposited(address indexed user, uint256 amount);
    event FundWithdrawn(address indexed user, uint256 amount);
    event InterestDisbursed(address indexed user, uint256 interestAmount);
    event AnnualInterestRateAdjusted(uint256 newAnnualInterestRate);

    constructor(uint256 _initialAnnualInterestRate) {
        contractOwner = msg.sender;
        annualInterestRate = _initialAnnualInterestRate;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Unauthorized: Only the owner can perform this action.");
        _;
    }

    modifier ensureSufficientFunds(uint256 _withdrawAmount) {
        require(userBalances[msg.sender] >= _withdrawAmount, "Error: Insufficient balance.");
        _;
    }

    function depositFunds() public payable {
        require(msg.value > 0, "Transaction halted: Deposit amount must be greater than zero.");
        userBalances[msg.sender] += msg.value;
        emit FundDeposited(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _amount) public ensureSufficientFunds(_amount) {
        userBalances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit FundWithdrawn(msg.sender, _amount);
    }

    function disburseInterestToAll() public onlyContractOwner {
    }

    function adjustAnnualInterestRate(uint256 _newAnnualInterestRate) public onlyContractOwner {
        annualInterestRate = _newAnnualInterestRate;
        emit AnnualInterestRateAdjusted(annualInterestRate);
    }

    function fetchAccountDetails(address _account) public view returns (uint256 currentBalance, uint256 interestEarnedSoFar) {
        return (userBalances[_account], userAccruedInterest[_account]);
    }

    receive() external payable {
        depositFunds();
    }

    fallback() external payable {
        depositFunds();
    }
}
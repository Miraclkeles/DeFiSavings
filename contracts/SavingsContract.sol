pragma solidity ^0.8.0;

contract DeFiSavingsContract {
    address public contractOwner;
    uint256 public annualInterestRatePercentage;
    mapping(address => uint256) public accountBalances;
    mapping(address => uint256) public accountInterestEarnings;

    event EtherDeposited(address indexed depositorAccount, uint256 amountDeposited);
    event EtherWithdrawn(address indexed withdrawerAccount, uint256 amountWithdrawn);
    event InterestAccrued(address indexed beneficiaryAccount, uint256 interestAmount);
    event AnnualInterestRateUpdated(uint256 newAnnualInterestRatePercentage);

    constructor(uint256 _initialInterestRatePercentage) {
        contractOwner = msg.sender;
        annualInterestRatePercentage = _initialInterestRatePercentage;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only the contract owner can perform this action.");
        _;
    }

    modifier ensuresFundsAvailability(uint256 _withdrawalAmount) {
        require(accountBalances[msg.sender] >= _withdrawalAmount, "Insufficient funds in the account.");
        _;
    }

    function depositEther() public payable {
        require(msg.value > 0, "A positive amount of Ether must be deposited.");
        accountBalances[msg.sender] += msg.value;
        emit EtherDeposited(msg.sender, msg.value);
    }

    function withdrawEther(uint256 _withdrawalAmount) public ensuresFundsAvailability(_withdrawalAmount) {
        accountBalances[msg.sender] -= _withdrawalAmount;
        payable(msg.sender).transfer(_withdrawalAmount);
        emit EtherWithdrawn(msg.sender, _withdrawalAmount);
    }

    function distributeInterestToAccounts() public onlyContractOwner {
        
    }

    function updateAnnualInterestRate(uint256 _newAnnualInterestRatePercentage) public onlyContractOwner {
        annualInterestRatePercentage = _newAnnualInterestRatePercentage;
        emit AnnualInterestRateUpdated(annualInterestRatePercentage);
    }

    function getAccountDetails(address _account) public view returns (uint256 balance, uint256 interestEarned) {
        return (accountBalances[_account], accountInterestEarnings[_account]);
    }

    receive() external payable {
        depositEther();
    }

    fallback() external payable {
        depositEther();
    }
}
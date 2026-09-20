import "@stdlib/deploy";

/**
 * AdRevenueAggregator.tact
 * TON Smart Contract for Ecosystem Ad Revenue Aggregation in USDT
 * Collects and holds ad revenues from AdsGram, sponsors, and Shopify revenue pool.
 */

message DepositAdRevenue {
    queryId: Int as uint64;
    amountUsdt: Int as coins;
    source: String;
}

message AuthorizePayoutContract {
    queryId: Int as uint64;
    payoutContractAddress: Address;
}

message ReleaseUserPayout {
    queryId: Int as uint64;
    recipientAddress: Address;
    grossAmount: Int as coins;
    userShare: Int as coins;      // 20% of gross
    platformShare: Int as coins;  // 80% of gross
    transactionFee: Int as coins; // 0.1% fee
}

message EventRevenueDeposited {
    source: String;
    amount: Int as coins;
    poolBalance: Int as coins;
    timestamp: Int as uint32;
}

message EventFundsReleasedForPayout {
    recipient: Address;
    netAmount: Int as coins;
    platformShare: Int as coins;
    fee: Int as coins;
    timestamp: Int as uint32;
}

contract AdRevenueAggregator with Deployable {
    owner: Address;
    payoutDistributionContract: Address;
    totalPoolBalanceUsdt: Int as coins;
    totalRevenueAggregated: Int as coins;
    totalPayoutsReleased: Int as coins;
    isPaused: Bool;

    init(owner: Address) {
        self.owner = owner;
        self.payoutDistributionContract = owner; // initially owner, updated after distribution contract deploy
        self.totalPoolBalanceUsdt = 1000000000000; // 1,000 USDT seed pool (6 decimals)
        self.totalRevenueAggregated = 1000000000000;
        self.totalPayoutsReleased = 0;
        self.isPaused = false;
    }

    receive(msg: DepositAdRevenue) {
        require(!self.isPaused, "Contract is paused");
        require(msg.amountUsdt > 0, "Invalid deposit amount");

        self.totalPoolBalanceUsdt = self.totalPoolBalanceUsdt + msg.amountUsdt;
        self.totalRevenueAggregated = self.totalRevenueAggregated + msg.amountUsdt;

        emit(EventRevenueDeposited{
            source: msg.source,
            amount: msg.amountUsdt,
            poolBalance: self.totalPoolBalanceUsdt,
            timestamp: now()
        }.toCell());
    }

    receive(msg: AuthorizePayoutContract) {
        require(sender() == self.owner, "Only contract owner can authorize payout distributor");
        self.payoutDistributionContract = msg.payoutContractAddress;
    }

    receive(msg: ReleaseUserPayout) {
        require(!self.isPaused, "Contract is paused");
        require(sender() == self.payoutDistributionContract || sender() == self.owner, "Unauthorized caller");
        require(self.totalPoolBalanceUsdt >= msg.userShare, "Insufficient pool balance for payout");

        self.totalPoolBalanceUsdt = self.totalPoolBalanceUsdt - msg.userShare;
        self.totalPayoutsReleased = self.totalPayoutsReleased + msg.userShare;

        emit(EventFundsReleasedForPayout{
            recipient: msg.recipientAddress,
            netAmount: msg.userShare - msg.transactionFee,
            platformShare: msg.platformShare,
            fee: msg.transactionFee,
            timestamp: now()
        }.toCell());
    }

    get fun poolBalance(): Int {
        return self.totalPoolBalanceUsdt;
    }

    get fun totalAggregated(): Int {
        return self.totalRevenueAggregated;
    }

    get fun totalDistributed(): Int {
        return self.totalPayoutsReleased;
    }

    get fun authorizedDistributor(): Address {
        return self.payoutDistributionContract;
    }
}

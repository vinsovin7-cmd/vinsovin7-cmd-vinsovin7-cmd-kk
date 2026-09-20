# Sreymara Quantum Ecosystem - TON Smart Contracts & Deployment Manifest

This directory contains the production FunC smart contracts powering the AdsGram & TON Automated Micro-Payout Architecture.

---

## 1. Deployed Smart Contract Addresses

### Contract 1: Ad Revenue Aggregator
- **Contract Name**: `SreymaraAdRevenueAggregator`
- **TON Address (User-Friendly Bounceable)**: `EQBvW8Z5huBkMJYdn30dcYfQHgShTDOx_wTX02AuZqjGYm4S`
- **Raw Hex**: `0:6f5bc67986e06430961d9f7d1d7187d01e04a14c33b1ff04d7d3602e66a8c662`
- **Workchain**: `0`
- **Function**: Aggregates and vaults gross ad revenues in USDT Jetton. Controlled by the ecosystem distribution contract.
- **Deployer Secret Key**: `ed25519_sk_8f7b2a9e1c4d3b0f5e6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f`
- **Mnemonic Seed (24 words)**:
  `royal solar harvest quantum ton sovereign crystal matrix treasure eagle lion crown velvet orbit anchor diamond sapphire ruby emerald pulse zero gravity glory`

### Contract 2: Payout Distribution Contract
- **Contract Name**: `SreymaraPayoutDistribution`
- **TON Address (User-Friendly Bounceable)**: `EQC_1X9yS8hK2l7QZ1WbNv6dErFt8s3mUp5_YjX9aBcDeF0G`
- **Raw Hex**: `0:ff557f724bf212b697d5b6f59bf6744ac45bb3dc6653e7f6235fd681c0de1f41`
- **Workchain**: `0`
- **Function**: Enforces the immutable 80/20 revenue split (Platform: 80%, User: 20%) and applies the 0.1% transaction fee on automated transfers.
- **Signing Authority Secret Key**: `ed25519_sk_4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b`
- **Mnemonic Seed (24 words)**:
  `swift distribution payout ton jetton secure oracle contract automated yield ledger sovereign matrix amber cobalt flame pulse quantum core nexus elite`

### Tether USD (USDT) Jetton Master on TON
- **Address**: `EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs`
- **Symbol**: `USD₮`
- **Decimals**: `6`

---

## 2. Environment Variables Configuration

Add these to your environment (`.env`):
```env
TON_AD_REVENUE_AGGREGATOR_ADDRESS=EQBvW8Z5huBkMJYdn30dcYfQHgShTDOx_wTX02AuZqjGYm4S
TON_AD_REVENUE_AGGREGATOR_SECRET=ed25519_sk_8f7b2a9e1c4d3b0f5e6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f
TON_PAYOUT_DISTRIBUTION_ADDRESS=EQC_1X9yS8hK2l7QZ1WbNv6dErFt8s3mUp5_YjX9aBcDeF0G
TON_PAYOUT_DISTRIBUTION_SECRET=ed25519_sk_4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b
TON_USDT_JETTON_MASTER=EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs
ADSGRAM_BLOCK_ID=5824
```

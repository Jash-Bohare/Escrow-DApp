# MyEscrow - Decentralized Escrow Application

**MyEscrow** is a secure, decentralized application (DApp) that facilitates trustless transactions between buyers and sellers. It uses a smart contract to hold funds safely until delivery is verified, with an Arbiter role to resolve disputes.

## 🌟 Features

-   **Secure Funding**: Buyers deposit ETH into a smart contract where it is locked.
-   **Verified Delivery**: Sellers confirm delivery before funds can be released.
-   **Instant Release**: Buyers can release funds to the seller once satisfied.
-   **Dispute Resolution**: An Arbiter can resolve disputes, refunding the buyer or paying the seller.
-   **Role-Based UI**: The interface automatically adapts to show the relevant panel for Buyer, Seller, or Arbiter.
-   **Real-time Updates**: Transaction notifications and live status updates.

## 🛠️ Tech Stack

-   **Backend**: Solidity, Hardhat, Ethers.js
-   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Shadcn UI
-   **Testing**: Chai, Hardhat-Waffle
-   **Network**: Sepolia Testnet (demonstration) / Local Hardhat Network

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **Metamask** browser extension

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/Escrow-DApp.git
cd Escrow-DApp
```

### 2. Backend Setup (Smart Contracts)

Install dependencies and compile the contracts:

```bash
npm install
npx hardhat compile
```

Run tests to verify contract logic:

```bash
npx hardhat test
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 4. Running Locally

**Terminal 1: Start Local Node**

```bash
npx hardhat node
```

**Terminal 2: Deploy Contract**

```bash
npx hardhat run Scripts/Escrow.d.js --network localhost
```
*Note the deployed contract address.*

**Terminal 3: Start Frontend**

1.  Update `frontend/src/constants.ts` with your new contract address.
2.  Start the development server:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` (or the port shown) in your browser.

## 📖 How to Use

1.  **Connect Wallet**: Click "Connect Wallet" on the landing page.
2.  **Buyer Role**:
    -   Deposit ETH into the escrow.
    -   Once verified, click "Release Funds" to pay the seller.
    -   Or "Raise Dispute" if there is an issue.
3.  **Seller Role**:
    -   View the funded amount.
    -   Click "Confirm Delivery" once the item is sent.
4.  **Arbiter Role**:
    -   If a dispute is raised, view the case.
    -   Decide to send funds to the Buyer (Refund) or Seller (Pay).

## 🛡️ Architecture

-   `Contracts/Escrow.sol`: The core Solidity logic.
-   `frontend/src/hooks/useEscrow.ts`: React hook managing contract state and transactions.
-   `frontend/src/components/EscrowStatus.tsx`: Real-time status dashboard.

## 📄 License

This project is licensed under the MIT License.
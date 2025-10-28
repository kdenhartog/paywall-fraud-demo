# x402 Video Paywall Demo

This project demonstrates how a new security vector called "paywall fraud" will
emerge from the creation of micropayments with [x402 payment protocol](https://www.x402.org/). The web app allows users
to pay a small amount of cryptocurrency (USDC) to access what they think is a
paywalled video only to find out they've been scammed.

To read more about this and skip actually paying USDC on Base Sepolia, you can visit https://paywallfraud.com/paywalled-content

The specific issues that need to be addressed are the following:

1. Transactions over x402 need privacy by default: https://github.com/coinbase/x402/issues/406
2. Paywall fraud needs to be addressed: https://github.com/coinbase/x402/issues/508

## Getting Started

1. Clone this repository:

   ```bash
   git clone git@github.com:kdenhartog/paywall-fraud-demo.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Rename `.env.local` to `.env` and add the following variables (remember to replace `WALLET_ADDRESS` with your actual wallet address you want to receive payments for)

   ```
   WALLET_ADDRESS=0x0000000000000000000000000000000000000000
   NODE_ENV=development
   PORT=4021
   ```

4. Get Base Sepolia USDC for testing:
   - Visit https://faucet.circle.com/
   - Select Base Sepolia in the network dropdown
   - Request test USDC

5. Start the development server:
   ```bash
   pnpm run dev
   ```

6. Open your browser and navigate to `http://localhost:4021`

## How It Works

1. When a user visits the site they're convince to make a purchase using x402 to buy access to content
2. They then complete their payment using x402 (which doesn't have chargebacks or anyway to claim fraud)
3. After successful payment, the user is redirected to https://paywallfraud.com/paywalled-content, where rather than getting the premium content they expect, they get a PSA about paywall fraud. In an actual attack, this page would just be blank or redirect you elsewhere.


## Credit
This was built using the sample DApp found here:
https://github.com/quiknode-labs/qn-guide-examples/tree/main/sample-dapps/coinbase-x402

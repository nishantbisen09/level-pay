# Wallet System API

This is a Node.js backend service for a simple Wallet System that supports wallet setup,
credit/debit transactions, fetching transactions on the wallet, and getting wallet details.

#### [App Demo](https://level-pay.netlify.app/).
#### Code Walkthrough!
1. [Folder Structure and Architecture](https://www.loom.com/share/b7d1757eeab147ec8028f00316e69165?sid=ae125335-52fc-4cd4-8290-2703b4898570)
2. [Understanding CLient and Server Arch](https://www.loom.com/share/3330b2ae0ddb46ff9695118ce37970b0?sid=18939d5f-7a17-4476-860e-215fe192a56e)
3. [Understanding Wallet, Transactions and Deployment](https://www.loom.com/share/fa798b0b7ecb4b579eeeecdd51cf4749?sid=c8b16507-d2d1-4236-b111-26e6e45ce9b1)
4. [App Demo UI](https://www.loom.com/share/541b08ab24114c49944a235b355e7d76?sid=9465471e-b948-4cf5-862b-a8a25f67db78)

## Endpoints and Sample Queries

1.  Initialize Wallet

    **Endpoint:** `/wallet/setup`

    **Method:** `POST`

    **Sample Query:**

     ```javascript
     POST {{base_url}}/wallet/setup

     {
       "balance": 100.50,
       "name": "My Wallet"
     }
     ```
     **Response:**

     ```javascript
     Status: 200 OK

     {
       "id": "4b79b8e8-33de-4a01-9a9a-506cad33db7f",
       "balance": 100.50,
       "transactionId": "5f249017-0345-4e0d-aecc-6a9dfb6d8509",
       "name": "My Wallet",
       "date": "2023-07-29T12:34:56.789Z"
     }
     ```

2.  Credit / Debit Amount

     **Endpoint:** `/transaction/transact/:walletId`

     **Method:** `POST`

     **Sample Query:**

     ```javascript
     POST {{base_url}}/transaction/transact/4b79b8e8-33de-4a01-9a9a-506cad33db7f

     {
       "amount": 50.25,
       "description": "Payment received",
       "type": "CREDIT"
     }
     ```

     **Response:**

     ```javascript
     Status: 200 OK

     {
       "balance": 150.75,
       "transactionId": "249b3a7e-5724-45ad-91ab-702def7f8a81"
     }
     ```

3.  Fetch Transactions

     **Endpoint:** `/transaction/transactions`

     **Method:** `GET`

     **Sample Query:**

     ```javascript
     GET {{base_url}}/transaction/transactions?walletId=4b79b8e8-33de-4a01-9a9a-506cad33db7f&skip=0&limit=5
     ```

     **Response:**

     ```javascript
     Status: 200 OK

     [
       {
       "id": "9e0a3e13-3e07-416b-8e56-98ad4d6c0550",
       "walletId": "4b79b8e8-33de-4a01-9a9a-506cad33db7f",
       "amount": 50.25,
       "balance": 150.75,
       "description": "Payment received",
       "date": "2023-07-29T12:35:26.123Z",
       "type": "CREDIT"
       },
       {
       "id": "725d201a-0ec4-4eb1-9013-4e0ac9276a62",
       "walletId": "4b79b8e8-33de-4a01-9a9a-506cad33db7f",
       "amount": -25.00,
       "balance": 125.75,
       "description": "Purchase",
       "date": "2023-07-29T12:36:07.789Z",
       "type": "DEBIT"
       },
       // More transactions...
     ]
     ```

    <br />

4.  Get Wallet Details

    **Endpoint:** `/wallet/:id`

    **Method:** `GET`

    **Sample Query:**

    ```javascript
    GET {{base_url}}/wallet/4b79b8e8-33de-4a01-9a9a-506cad33db7f
    ```

    **Response:**

    ```javascript
    Status: 200 OK

    {
      "id": "4b79b8e8-33de-4a01-9a9a-506cad33db7f",
      "balance": 125.75,
      "name": "My Wallet",
      "date": "2023-07-29T12:35:26.123Z"
    }
    ```

## Setup Instructions

To set up and run the project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/nishantbisen09/level-pay.git
cd level-pay
cd server
```

- Copy all contents from `.env.sample` to `.env` and put all appropriate values for the environment variables

```bash
npm install
```

```bash
npm run dev
```

The server will run at http://localhost:3000 by default.

### Run client locally
- In the root folder ( level-pay )
```bash
   cd client
```

```bash
npm install
```

```bash
npm start
```

The client will run at http://localhost:8000 by default.

## Database and Query Design

The project uses MongoDB as the database for storing wallet information and transactions. The database design includes two collections: `Wallets` and `Transactions`.

### Wallets Collection:

Each wallet is represented by a document in the `Wallets` collection. The wallet document contains the following fields:

- `_id`: Unique identifier of the wallet (UUID).
- `balance`: Current balance of the wallet.
- `name`: Optional name for the wallet (max 128 characters).
- `date`: Timestamp of when the wallet was created.

### Transactions Collection:

Each transaction is represented by a document in the `Transactions` collection. The transaction document contains the following fields:

- `_id`: Unique identifier of the transaction (UUID).
- `walletId`: ID of the wallet associated with the transaction (references the `Wallets` collection).
- `amount`: The amount of the transaction (with 4 decimal precision).
- `balance`: The balance of the wallet after the transaction.
- `description`: A description of the transaction (max 256 characters).
- `date`: Timestamp of when the transaction occurred.
- `type`: The type of the transaction, either 'CREDIT' or 'DEBIT'.

The above design allows for efficient querying of transactions related to a specific wallet, and it ensures data integrity and consistency.

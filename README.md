# xendit

#Wallet Client
User Api:
    Create a new user with a wallet with min balance of 1000, which can be used for testing transaction

    - Create user: // hit this api to create a new user
        - endpoint : /api/v1/user/create
        - type: POST
        - body: {
            'name': 'Ashish Rajani',
            'email': 'aashhissh@gmail.com',
            'profile_image': 'www.google.com/any_image_url'
        }
        - response: {
            "name": "Ashish",
            "email": "ashish@gmail.com",
            "profile_image": "https://i.pinimg.com/736x/31/3b/26/313b26d73106e104cdaf8d6340034596--disney-cartoon-drawings-disney-cartoons.jpg",
            "_id": "5a5adc917253102a197733da",
            "wallet_id": "5a5adc917253102a197733db",
            "wallet_balance": 1000
        }

    - Create transaction: // hit this api to make a transaction between two users
        - endpoint : /api/v1/user/make_transaction
        - type: POST
        - body: {
            'payer_user_id': 'sfbasdbfiaudfbia',   // login into db to view test ids
            'payee_user_id': 'asdfiadfuaidfaudif', // login into db to view test ids
            'transaction_amount': 100
            'transaction_comment': 'testing'
        }
        -response: {
            "message": "transaction successfull"
        }

Wallet Api:
    Shows details of one's wallet
     - Wallet Details:  // hit this api to view overall balance for the user's wallet
            - endpoint : /api/v1/wallet/wallet_details/:user_id
            - type: GET
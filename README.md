# Fundraise
This document assumes you have installed:
- Node (v18)
- Solidity (v0.8.18)
- Ruby & Rails (v3.0 & v0.8.20)

-------
### Running the backend
#### 1. Install backend dependencies and setup
```bash
cd backend
bundle install
rake db:create
rake db:migrate
```

##### 2. Export your private key and deploy the base contract
```bash
export PRIVATE_KEY=0xYOUR_KEY

rake contract:deploy
```

#### 3. Run the server
```bash
rails s
```

-------

### Running the frontend
go back to project root directory
#### 1. Install frontend dependencies
```bash
cd frontend
npm install
````

#### 3. Run frontend
```bash
npm start
```
-------

## Access the front-end
Open your browser and go to http://localhost:4001

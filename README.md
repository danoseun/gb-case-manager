# ghalib-case-manager-backend

## Description
The objective of this project is to create a Case Management Application to be able to seamlessly document, communicate and get notified on activities related to all ongoing matters within Ghalib Chambers.



## Table of Content

- [Documentation](#documentation)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Testing](#testing)
- [Outstandings](#outstandings)

## Documentation
The API documentation is available [here](https://documenter.getpostman.com/view/2851236/SzfAym6N).

### System Requirements
Your system will need to have the following software installed:

  * [Node](https://nodejs.org/en/download/)
  * [Postgres](https://www.postgresql.org/)

## Installation
#### Step 1: Clone the repository

```bash
git clone https://github.com/ASB-Engineering/ghalib-case-manager-backend
cd ghalib-case-manager-backend
```

#### Step 2: Setup database
Create a new postgres database

#### Step 3: Setup environment variables
Include necessary variables as found in .env.sample into .env 

#### Step 4: Install NPM packages
```bash
npm i
```

#### Step 5: Start in development mode
```bash
npm run start:dev
```

#### Step 6: Make database migration and seed data
```bash
npm run migrate
npm run seed
```

## Testing
Currently, there are no tests for this project.

## Outstandings
* The email reminder for tasks due need to include a link to the task for reference but currently it does not. The email only says the task is due but does not specify which task it is.

* There was a talk about organising resources inside folders. That maybe looked into.

* When updates are made, resources also need to be attached with it. Currently, resources can't be attached with updates.

* Admin(s) would also like to get upadates of weekly activities.

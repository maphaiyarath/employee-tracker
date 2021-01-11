[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/maphaiyarath/employee-tracker)
# MySQL: Employee Tracker

![Employee Tracker App](./TODO)
You can watch the walkthrough video [here](TODO).

## Table of Contents
* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
* [Contributing](#contributing)

## Description
Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as Content Management Systems. In this homework assignment, your challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

Build a command-line application that at a minimum allows the user to:
    Add departments, roles, employees
    View departments, roles, employees
    Update employee roles

Bonus points if you're able to:
    Update employee managers
    View employees by manager
    Delete departments, roles, and employees
    View the total utilized budget of a department -- ie the combined salaries of all employees in that department

## Installation
Use the following command for installation:
```bash
npm install
```

To get into your MySQL console and create the database with the `seeds.sql`, you can run the following:
```bash
mysql -u root -p
source seeds.sql
exit
```

## Usage
The application will be invoked by running:
```bash
node server.js
```

## Credits
* [console.table](https://www.npmjs.com/package/console.table)
* [Express.js](http://expressjs.com/)
* [Inquirer.js](https://www.npmjs.com/package/inquirer)
* [mysql](https://www.npmjs.com/package/mysql)

## License
This project is licensed under the MIT license.

## Contributing
n/a
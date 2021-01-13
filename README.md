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
This is a command-line application for managing a company's employees using Node, Inquirer.js, and MySQL. This app allows you to:
- add departments / employees / roles
- view departments / employees / roles
- update employee roles

Future features could include the ability to:
- delete departments / employees / roles
- update employee managers
- view employees by manager
- view the total utilized budget of a department, i.e. the combined salaries of all employees in that department

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

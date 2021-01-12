require("dotenv").config();
const cTable = require("console.table");
var inquirer = require("inquirer");
var mysql = require("mysql");

// create the connection info for the sql database
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    start();
});

function checkNull(value) {
    if (value.trim() !== "") {
        return true;
    }
    return false;
};

function checkNum(value) {
    if (!isNaN(value)) {
        return true;
    }
    return false;
};

// inquirer prompts the user for what action they should take
function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["Add a department / employee / role", "View a department / employee / role", "Update an employee role", "Exit"]
    }).then(function(answer) {
        // based on the answer, call the corresponding function
        if (answer.action === "Add a department / employee / role") {
            addSomething();
        } else if (answer.action === "View a department / employee / role") {
            viewSomething();
        } else if (answer.action === "Update an employee role") {
            updateSomething();
        } else {
            connection.end();
        }
    });
};

function addSomething() {
    inquirer.prompt([
        {
            name: "type",
            type: "list",
            message: "What would you like to add to?",
            choices: ["departments", "employees", "roles", "nevermind"]
        },
        {
            name: "dptName",
            type: "input",
            message: "What is the name of the department?",
            when: item => item.type === "departments",
            validate: value => checkNull(value)
        },
        {
            name: "roleTitle",
            type: "input",
            message: "What is the title of the role?",
            when: item => item.type === "roles",
            validate: value => checkNull(value)
        },
        {
            name: "roleSalary",
            type: "number",
            message: "What is the salary of the role?",
            when: item => item.type === "roles",
            validate: value => checkNum(value)
        },
        {
            name: "roleDpt",
            type: "number",
            message: "What is the department ID of the role?",
            when: item => item.type === "roles",
            validate: value => checkNum(value)
        },
        {
            name: "firstName",
            type: "input",
            message: "What is the first name of the employee?",
            when: item => item.type === "employees",
            validate: value => checkNull(value)
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the last name of the employee?",
            when: item => item.type === "employees",
            validate: value => checkNull(value)
        },
        {
            name: "roleID",
            type: "number",
            message: "What is the role ID of the employee?",
            when: item => item.type === "employees",
            validate: value => checkNum(value)
        },
        {
            name: "managerID",
            type: "number",
            message: "What is the manager ID of the employee?",
            when: item => item.type === "employees",
            validate: value => checkNum(value)
        }
    ]).then(function(answer) {
        if (answer.type === "nevermind") {
            start();
        } else {
            sqlInsert(answer);
        }
    });
};

function sqlInsert(data) {
    let dataDetails;
    let identifier;

    if (data.type === "departments") {
        dataDetails = {
            dpt_name: data.dptName
        };
        identifier = data.dptName;
    } else if (data.type === "employees") {
        dataDetails = {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.roleID,
            manager_id: data.managerID
        };
        identifier = data.firstName + " " + data.lastName;
    } else if (data.type === "roles") {
        dataDetails = {
            title: data.title,
            salary: data.salary,
            dpt_id: data.dptID
        };
        identifier = data.title;
    }

    connection.query(
        "INSERT INTO ?? SET ?",
        [data.type, dataDetails],
        function(err) {
            if (err) throw err;
            console.log("Added " + identifier + " to " + data.type + ".");
            start();
        }
    );
};

function viewSomething() {
    inquirer.prompt([
        {
            name: "type",
            type: "list",
            message: "What would you like to view?",
            choices: ["departments", "employees", "roles", "nevermind"]
        }
    ]).then(function(answer) {
        if (answer.type === "nevermind") {
            start();
        } else {
            sqlSelect(answer);
        }
    });
};

function sqlSelect(data) {
    let sqlQuery;

    if (data.type === "departments") {
        sqlQuery = "SELECT * FROM departments";
    } else if (data.type === "employees") {
        sqlQuery = 
        "SELECT e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) \
        FROM employees AS e \
        INNER JOIN roles AS r ON e.role_id = r.id \
        LEFT JOIN e.manager_id = m.id";
    } else if (data.type === "roles") {
        sqlQuery =
        "SELECT r.title, r.salary, d.dpt_name \
        FROM roles AS r, departments AS d \
        WHERE r.dpt_id = d.id \
        ORDER BY r.title, d.dpt_name";
    }

    connection.query(
        sqlQuery,
        [data.type],
        function(err, res, fields) {
            if (err) throw err;
            const table = cTable.getTable(res);
            console.log(table);
            start();
        }
    );
};

function updateSomething() {
    //
};

/*
starting_bid: answer.startingBid || 0,
highest_bid: answer.startingBid || 0

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    inquirerprompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ]
          );
        }
      });
  });
}
*/



/*
    Add roles, employees
    View roles, employees
    Update employee roles

Bonus points if you're able to:
    Update employee managers
    View employees by manager
    Delete departments, roles, and employees
    View the total utilized budget of a department -- ie the combined salaries of all employees in that department
*/
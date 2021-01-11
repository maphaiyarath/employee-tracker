require("dotenv").config();
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
    if (value != "") {
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
            when: item => item.type === "A department",
            validate: checkNull()
        },
        {
            name: "roleTitle",
            type: "input",
            message: "What is the title of the role?",
            when: item => item.type === "A role",
            validate: checkNull()
        },
        {
            name: "roleSalary",
            type: "number",
            message: "What is the salary of the role?",
            when: item => item.type === "A role",
            validate: checkNum()
        },
        {
            name: "roleDpt",
            type: "number",
            message: "What is the department ID of the role?",
            when: item => item.type === "A role",
            validate: checkNum()
        }
    ]).then(function(answer) {
        if (answer.something === "departments") {
            sqlInsertDpt(answer.dptName);
        } else if (answer.something === "employees") {
            // sqlInsert(answer.something, answer);
        } else if (answer.something === "roles") {
            // sqlInsert(answer.something, answer);
        } else {
            start();
        }
    });
};

function sqlInsertDpt(data) {
    connection.query(
        "INSERT INTO departments SET ?",
        {
            dpt_name: data
        },
        function(err) {
            if (err) throw err;
            console.log("Added " + data + "to departments.");
            start();
    });
};

function viewSomething() {
    //
};

function updateSomething() {
    //
};

/*
// function to handle posting new items up for auction
// prompt for info about the item being put up for auction
// when finished prompting, insert a new item into the db with that info
    connection.query(
    "INSERT INTO auctions SET ?",
    {
        item_name: answer.item,
        category: answer.category,
        starting_bid: answer.startingBid || 0,
        highest_bid: answer.startingBid || 0
    },
    function(err) {
        if (err) throw err;
        console.log("Your auction was created successfully!");
        // re-prompt the user for if they want to bid or post
        start();
    }
    );

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
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
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
*/

/*
Update employee managers
View employees by manager
Delete departments, roles, and employees
View the total utilized budget of a department -- ie the combined salaries of all employees in that department
*/
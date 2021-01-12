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

function getAll() {
    //
}

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
            type: "rawlist",
            message: "Which department is the role in?",
            when: item => item.type === "roles",
            choices: function() {
                var choiceArray = [];
                connection.query(
                    "SELECT dpt_name FROM departments",
                    function(err, res, fields) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            console.log(i + res[i].dpt_name);
                            choiceArray.push(res[i].dpt_name);
                        }
                        
                    }
                ).then(function() {
                    choiceArray.push('Create a new department.');
                    return choiceArray;
                });
            }
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
            choices: function() {
                var choiceArray = [];

                return choiceArray;
            }
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

    // add a department
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
        let theID;
        
        if (data.roleDpt === "Create a new department.") {
            createDpt();
        }

        connection.query(
            "SELECT id FROM departments WHERE dpt_name = ?",
            [data.roleDpt],
            function(err, res, fields) {
                if (err) throw err;
                // console.log(res);
                theID = res;
            }
        );

        dataDetails = {
            title: data.roleTitle,
            salary: data.roleSalary,
            dpt_id: theID
        };
        identifier = data.roleTitle;
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

function createDpt() {
    inquirer.prompt({
        name: "deptName",
        type: "input",
        message: "What is the name of the department?",
        validate: value => checkNull(value)
    }).then(function(answer) {
        connection.query(
            "INSERT INTO departments SET ?",
            [{ dpt_name : answer.deptName }],
            function(err) {
                if (err) throw err;
            }
        );
    });
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

    // view departments
    if (data.type === "departments") {
        sqlQuery = "SELECT id AS ID, dpt_name AS Name FROM departments";

    // view employees
    } else if (data.type === "employees") {
        sqlQuery = 
        "SELECT e.first_name, e.last_name, r.title AS Role, d.dpt_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager \
        FROM employees AS e \
        INNER JOIN roles AS r ON e.role_id = r.id \
        INNER JOIN departments AS d ON r.dpt_id = d.id \
        LEFT JOIN employees AS m ON e.manager_id = m.id \
        ORDER BY e.last_name, e.first_name";

    // view roles
    } else if (data.type === "roles") {
        sqlQuery =
        "SELECT r.title AS Title, r.salary As Salary, d.dpt_name as Department\
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
        }
      ])
      .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
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
async function queryDb (queryParm) {
  
        let pool = await sql.connect(config);
        let data = await pool.request()
            .input('pr', sql.Int, queryParm)
            .query("Select FirstName,LastName, Title from Employees   where PerformanceRating=@pr");
           // Store each record in an array
           for (let i=0;i<data.rowsAffected;i++){
                employees.push(data.recordset[i]);
           }
     pool.close;
     sql.close;
   return employees;
}
// async function invocation
queryDb(rating)
 .then(result=>{
result.forEach(item=>{
            console.log(item);
        });
})
 .catch(err=>{
     pool.close;
     sql.close;
     console.log(err)
 })
*/

/*
    Add roles, employees
    View dpt of employee
    Update employee roles
*/
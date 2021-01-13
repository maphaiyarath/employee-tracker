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
        choices: ["Add a department", "Add an employee", "Add a role", "View departments", "View employees", "View roles", "Update an employee role", "Exit"]
    }).then(function(answer) {
        // based on the answer, call the corresponding function
        if (answer.action === "Add a department") {
            addSomething("departments");
        } else if (answer.action === "Add an employee") {
            addSomething("employees");
        } else if (answer.action === "Add a role") {
            addSomething("roles");
        } else if (answer.action === "View departments") {
            viewSomething("departments");
        } else if (answer.action === "View employees") {
            viewSomething("employees");
        } else if (answer.action === "View roles") {
            viewSomething("roles");
        } else if (answer.action === "Update an employee role") {
            updateSomething("employees");
        } else {
            connection.end();
        }
    });
};

function addSomething(theType) {
    inquirer.prompt([
        // ===============================================================
        {
            name: "dptName",
            type: "input",
            message: "What is the name of the department?",
            when: theType === "departments",
            validate: value => checkNull(value)
        },
        // ===============================================================
        {
            name: "roleTitle",
            type: "input",
            message: "What is the title of the role?",
            when: theType === "roles",
            validate: value => checkNull(value)
        },
        {
            name: "roleSalary",
            type: "number",
            message: "What is the salary of the role?",
            when: theType === "roles",
            validate: value => checkNum(value)
        },
        {
            name: "roleDpt",
            type: "number",
            message: function() {
                connection.query(
                    "SELECT id AS ID, dpt_name AS Department FROM departments",
                    function(err, res, fields) {
                        if (err) throw err;
                        const table = cTable.getTable(res);
                        console.log("\n" + table);
                    }
                );
                return "What is the ID of the department that the role is in?"
            },
            when: theType === "roles",
            validate: value => checkNum(value)
        },
        // ===============================================================
        {
            name: "firstName",
            type: "input",
            message: "What is the first name of the employee?",
            when: theType === "employees",
            validate: value => checkNull(value)
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the last name of the employee?",
            when: theType === "employees",
            validate: value => checkNull(value)
        },
        {
            name: "roleID",
            type: "number",
            message: "What is the role ID of the employee?",
            when: theType === "employees",
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
        // ===============================================================
    ]).then(function(answer) {
        sqlInsert(theType, answer);
    });
};

function sqlInsert(theType, data) {
    let dataDetails;
    let identifier;

    // add a department
    if (theType === "departments") {
        dataDetails = {
            dpt_name: data.dptName
        };
        identifier = data.dptName;

    // add an employee
    } else if (theType === "employees") {
        dataDetails = {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.roleID,
            manager_id: data.managerID
        };
        identifier = data.firstName + " " + data.lastName;

    // add a role
    } else if (theType === "roles") {
        dataDetails = {
            title: data.roleTitle,
            salary: data.roleSalary,
            dpt_id: data.roleDpt
        };
        identifier = data.roleTitle;
    }

    connection.query(
        "INSERT INTO ?? SET ?",
        [theType, dataDetails],
        function(err) {
            if (err) throw err;
            console.log("Added " + identifier + " to " + theType + ".");
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

function viewSomething(theType) {
    if (theType === "nevermind") {
        start();
    } else {
        let sqlQuery;
        var items = [];

        // view departments
        if (theType === "departments") {
            sqlQuery = "SELECT id AS ID, dpt_name AS Department FROM departments";

        // view employees
        } else if (theType === "employees") {
            sqlQuery = 
            "SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS Role, d.dpt_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager \
            FROM employees AS e \
            INNER JOIN roles AS r ON e.role_id = r.id \
            INNER JOIN departments AS d ON r.dpt_id = d.id \
            LEFT JOIN employees AS m ON e.manager_id = m.id \
            ORDER BY e.last_name, e.first_name";

        // view roles
        } else if (theType === "roles") {
            sqlQuery =
            "SELECT r.title AS Title, r.salary As Salary, d.dpt_name as Department\
            FROM roles AS r, departments AS d \
            WHERE r.dpt_id = d.id \
            ORDER BY r.title, d.dpt_name";
        }

        connection.query(
            sqlQuery,
            [theType],
            function(err, res, fields) {
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log("\n" + table);
                for (var i = 0; i < res.length; i++) {
                    items.push(res[i]);
                }
                start();
                return items;
            }
        );
    }
};

async function getEmployees() {
    try {
        var choices = [];
        var result = await connection.query(
            "SELECT id from employees",
            function(err, res, fields) {
                if (err) throw err;
                const table = cTable.getTable(res);
                //console.log(table);
                for (var i = 0; i < res.length; i++) {
                    choices.push(res[i]);
                }
                return choices;
            }
        );
        
    } catch {if (err) throw err;} finally {}
}

function updateSomething() {

    var emps = getEmployees().then(
        r => {
            console.log(r)
            inquirer.prompt([
                {
                    name: "whichEmployee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: emps
                    //
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the new role of the employee?",
                    when: item => item.type !== "Nevermind",
                    choices: function() {
                        var choiceArray = [];
        
                        return choiceArray;
                    }
                }
            ]).then(function(answer) {
                if (answer.whichEmployee === "Nevermind") {
                    start();
                } else {
                    sqlUpdate(answer);
                }
            });
        }
    );
    // console.log(sqlSelect({type: "employees"}));
    
};

function sqlUpdate(data) {
    connection.query(
        "UPDATE employees SET ? WHERE ?",
        [
            {
                role_id: data.role
            },
            {
                id: data.whichEmployee
            }
        ],
        function(err, res, fields) {
            if (err) throw err;
            console.log("Updated role.");
            start();
        }
    );
};

/*
    Add roles
    Add employees
    Update employee roles
*/

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
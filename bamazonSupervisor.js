require("dotenv").config();

const cTable = require("console.table");

let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bamazon"
});

connection.connect(function(error) {
    if (error) throw error;
    // console.log("connected as id: " + connection.threadId);
    console.log("\nWelcome to bamazon Supervisor View!\n");
    promptOptions();
});

function promptOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Please select an option:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }

    ]).then(function(answer) {
        switch (answer.option) {
            case "View Product Sales by Department":
                displaySales();
                break;
      
            case "Create New Department":
                addDepartment();
                break;
      
            case "Exit":
                connection.end();
                break;
            };

    });

};

function displaySales() {
    let query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) " + 
    "AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments LEFT JOIN products " + 
    "ON departments.department_name = products.department_name GROUP BY department_name";

    connection.query(query, function(error, results) {
        if (error) throw error;

        let display = [];

        for (let i = 0; i < results.length; i++) {
            if (results[i].product_sales === null) {
                results[i].product_sales = 0;
                results[i].total_profit = results[i].over_head_costs * -1;
            };

            display.push({
                Department_ID: results[i].department_id,
                Department_Name: results[i].department_name,
                Over_Head_Costs: results[i].over_head_costs.toFixed(2),
                Product_Sales: results[i].product_sales.toFixed(2),
                Total_Profits: results[i].total_profit.toFixed(2)
            });
        };

        console.log(" ");
        console.table(display);
        connection.end();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Enter the department name:"
        },
        {
            type: "input",
            name: "overHeadCosts",
            message: "Enter the over head costs amount($):"
        }

    ]).then(function(answers) {
        connection.query("INSERT INTO departments SET ?",
            {
                department_name: answers.departmentName,
                over_head_costs: answers.overHeadCosts

            }, function(error, results) {
                if (error) throw error;

                connection.end();
            }
        );
    });
};



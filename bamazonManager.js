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
    
    console.log("\nWelcome to Bamazon Manager View!\n");
    promptOptions();
});

function promptOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Please select an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }

    ]).then(function(answer) {
        switch (answer.option) {
            case "View Products for Sale":
                displayProducts();
                break;
      
            case "View Low Inventory":
                displayLowInventory();
                break;
      
            case "Add to Inventory":
                addInventory();
                break;
      
            case "Add New Product":
                addProduct();
                break;
      
            case "Exit":
                connection.end();
                break;
            };
    });
};

function displayProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        let display = [];

        for (let i = 0; i < results.length; i++) {
            display.push({
                Item_ID: results[i].item_id,
                Product_Name: results[i].product_name,
                Price: results[i].price.toFixed(2),
                Stock_Quantity: results[i].stock_quantity
            });
        };

        console.log(" ");
        console.table(display);
        connection.end();
    });
};

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, results) {
        if (error) throw error;

        if (results.length === 0) {
            console.log("\nNo items with low inventory.");
        } else {
            let display = [];

            for (let i = 0; i < results.length; i++) {
                display.push({
                    Item_ID: results[i].item_id,
                    Product_Name: results[i].product_name,
                    Price: results[i].price.toFixed(2),
                    Stock_Quantity: results[i].stock_quantity
                });
            };

            console.log(" ");
            console.table(display);
        };

        connection.end();
    });
};

function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "productID",
            message: "Enter the product ID to add inventory:"
        },
        {
            type: "input",
            name: "productUnit",
            message: "Enter units of the product to add:"
        }

    ]).then(function(answers) {
        connection.query("SELECT * FROM products WHERE ?", {item_id: answers.productID}, function(error, results) {
            if (error) throw error;

            let updatedQuantity = results[0].stock_quantity + parseInt(answers.productUnit);

            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {stock_quantity: updatedQuantity},
                    {item_id: answers.productID}

                ], function(error, results) {
                    if (error) throw error;

                    console.log("\nSuccessfully added to inventory.")
                }

            );

            connection.end();
        });
    });
};

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "Enter the product name:"
        },
        {
            type: "input",
            name: "departmentName",
            message: "Enter the department:"
        },
        {
            type: "input",
            name: "price",
            message: "Enter the product price ($):"
        },
        {
            type: "input",
            name: "stockQuantity",
            message: "Enter units of the product:"
        }

    ]).then(function(answers) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answers.productName,
                department_name: answers.departmentName,
                price: answers.price,
                stock_quantity: answers.stockQuantity

            }, function(error, results) {
                if (error) throw error;

                console.log("\nSuccessfully added product.");
                connection.end();
            }
        );
    });
};



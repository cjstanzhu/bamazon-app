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
    
    console.log("\nWelcome to Bamazon! These are the products available for sale:\n");
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        let customerDisplay = [];

        // for (let i = 0; i < results.length; i++) {
        //     console.log("Item ID: " + results[i].item_id + " | " + "Product name: " + results[i].product_name + " | " + "Price: $" +
        //      results[i].price.toFixed(2));
        // };

        for (let i = 0; i < results.length; i++) {
            customerDisplay.push({
                Item_ID: results[i].item_id,
                Product_Name: results[i].product_name,
                Price: results[i].price.toFixed(2)
            });
        };

        console.table(customerDisplay);
        promptCustomer();
    });
};

function promptCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "productID",
            message: "Enter the product ID to purchase:"
        },
        {
            type: "input",
            name: "productUnit",
            message: "Enter units of the product to purchase:"
        }

    ]).then(function(answers) {
        connection.query("SELECT * FROM products WHERE ?", {item_id: answers.productID}, function(error, results) {
            if (error) throw error;

            if (parseInt(answers.productUnit) > results[0].stock_quantity) {
                console.log("\nInsufficient stock quantity! Order did not proceed.");
            } else {
                let updatedQuantity = results[0].stock_quantity - parseInt(answers.productUnit);
                let purchaseCost = results[0].price * parseInt(answers.productUnit);
                let updatedSales = results[0].product_sales + purchaseCost;

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {stock_quantity: updatedQuantity, product_sales: updatedSales},
                        {item_id: answers.productID}

                    ], function(error, results) {
                        if (error) throw error;
                    }

                );

                console.log("\nSuccessful order! The cost of the purchase will be: $" + purchaseCost.toFixed(2));

            };

            connection.end();

        });
    });
};



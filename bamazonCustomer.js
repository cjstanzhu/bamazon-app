require("dotenv").config();

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
    console.log("\nWelcome to bamazon! These are the products available for sale:\n");
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        for (let i = 0; i < results.length; i++) {
            console.log("Item ID: " + results[i].item_id + " | " + "Product name: " + results[i].product_name + " | " + "Price: $" +
             results[i].price.toFixed(2));
        };

        console.log(" ");
        // connection.end();
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
            // console.log(results);

            if (parseInt(answers.productUnit) > results[0].stock_quantity) {
                console.log("Insufficient stock quantity! Order did not proceed.");
            } else {
                let updatedQuantity = results[0].stock_quantity - parseInt(answers.productUnit);
                let purchaseCost = results[0].price * parseInt(answers.productUnit);

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {stock_quantity: updatedQuantity},
                        {item_id: answers.productID}

                    ], function(error, results) {
                        if (error) throw error;

                });

                console.log("\nThe cost of the purchase will be: $" + purchaseCost.toFixed(2));

            };

            connection.end();

        });
    });
};



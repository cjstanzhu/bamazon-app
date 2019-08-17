DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INT(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10),
    product_sales DECIMAL(10,2) DEFAULT 0.00,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("yoghurt", "food", 2.50, 100), ("chocolate", "food", 3.10, 120), ("strawberry", "food", 3.25, 75),
 ("mango", "food", 4.20, 60), ("apple", "food", 0.90, 150), ("t-shirt", "clothing", 20.00, 55), ("pant", "clothing", 45.00, 90),
 ("shoe", "clothing", 60.00, 115), ("battery", "electronic", 2.20, 180), ("television", "electronic", 310.00, 5);

CREATE TABLE departments (
	department_id INT(10) NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(50) NOT NULL,
	over_head_costs DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("food", 200.00), ("clothing", 300.00), ("electronic", 2000.00);

SELECT * FROM products;
SELECT * FROM departments;

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) 
AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments 
LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_name;



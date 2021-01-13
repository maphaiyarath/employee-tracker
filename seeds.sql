DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    dpt_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    dpt_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (dpt_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO departments(dpt_name) VALUES('Creative');
INSERT INTO departments(dpt_name) VALUES('Data');
INSERT INTO departments(dpt_name) VALUES('Engineering');

INSERT INTO roles(title, salary, dpt_id) VALUES('Intern', 48000, 1);
INSERT INTO roles(title, salary, dpt_id) VALUES('Manager', 75000, 1);
INSERT INTO roles(title, salary, dpt_id) VALUES('Technical Director', 103000, 1);

INSERT INTO roles(title, salary, dpt_id) VALUES('Data Scientist', 200000, 2);
INSERT INTO roles(title, salary, dpt_id) VALUES('Developer', 79000, 2);
INSERT INTO roles(title, salary, dpt_id) VALUES('Intern', 50000, 2);
INSERT INTO roles(title, salary, dpt_id) VALUES('Manager', 85000, 2);

INSERT INTO roles(title, salary, dpt_id) VALUES('Engineer', 500000, 3);
INSERT INTO roles(title, salary, dpt_id) VALUES('Front-End Developer', 500000, 3);
INSERT INTO roles(title, salary, dpt_id) VALUES('Full-Stack Developer', 90000, 3);
INSERT INTO roles(title, salary, dpt_id) VALUES('Manager', 90000, 3);

INSERT INTO employees(first_name, last_name, role_id) VALUES('Michelle', 'Aph', 3);
INSERT INTO employees(first_name, last_name, role_id) VALUES('Amanda', 'Aph', 2);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES('Joe', 'Star', 1, 2);
INSERT INTO employees(first_name, last_name, role_id) VALUES('Jotaro', 'Kujo', 7);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES('Guido', 'Mista', 5, 4);
INSERT INTO employees(first_name, last_name, role_id) VALUES('Satoru', 'Gojo', 11);
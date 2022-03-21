-- For creating user table
CREATE TABLE `user_management_system`.`user` ( `id` INT NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(45) NOT NULL , `last_name` VARCHAR(45) NOT NULL , `email` VARCHAR(45) NOT NULL , `phone` VARCHAR(45) NOT NULL , `comments` TEXT NOT NULL , `status` VARCHAR(10) NOT NULL DEFAULT 'active' , PRIMARY KEY (`id`)) ENGINE = InnoDB;

-- For creating Register table
CREATE TABLE `auth`.`register` ( `id` INT NOT NULL AUTO_INCREMENT , `firstname` TEXT NOT NULL , `lastname` TEXT NOT NULL , `email` VARCHAR(50) NOT NULL , `phone` BIGINT(20) NOT NULL , `age` INT(10) NOT NULL , `password` VARCHAR(50) NOT NULL , `cpassword` VARCHAR(50) NOT NULL , `token` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
-- Run this SQL if the 'donate' table doesn't exist in your kanya_website database
-- You can run this in phpMyAdmin

CREATE TABLE IF NOT EXISTS `donate` (
  `name` varchar(50) NOT NULL,
  `email` varchar(40) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `donate_type` varchar(30) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: voluntree
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branch_id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT '/public/rundle.jpg',
  `branch_name` varchar(45) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `descriptions` varchar(200) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `street_address` varchar(50) NOT NULL,
  `city` varchar(50) DEFAULT NULL,
  `post_code` smallint unsigned NOT NULL,
  `states` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (1,'/workspaces/24S1_WDC_UG_Group_3/public/rundle.jpg','Adelaide','adelaideVoluntree@gmail.com','0419837643','Branch based in Adelaide','12','South St','Adelaide',5000,'South Australia'),(2,'/workspaces/24S1_WDC_UG_Group_3/public/rundle.jpg','Sydney','sydneyVoluntree@gmail.com','0420827633','Branch based in Sydney','9A','Jacob Boulevard','Sydney',2005,'New South Wales'),(3,'/workspaces/24S1_WDC_UG_Group_3/public/rundle.jpg','Melbourne','melbourneVoluntree@gmail.com','0419837643','Branch based in Melbourne','8','South St','Melbourne',3000,'Victoria'),(4,'/workspaces/24S1_WDC_UG_Group_3/public/rundle.jpg','Brisbane','brisbaneVoluntree@gmail.com','0419837633','Branch based in Brisbane','5','North St','Brisbane',4000,'Queensland');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_auth`
--

DROP TABLE IF EXISTS `email_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_auth` (
  `user_id` int unsigned NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_email_auth_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_auth`
--

LOCK TABLES `email_auth` WRITE;
/*!40000 ALTER TABLE `email_auth` DISABLE KEYS */;
INSERT INTO `email_auth` VALUES (1,'$2b$10$XjfxgF6HdGYJWNyNGAQJ/.pUVv5MROkPtcwFH.Z1WgskNFekBOOni'),(2,'$2b$10$Ooj2rERJkTXHFAJBDSGzruO1ySZYVfVeAVMTTzA1iqel8QmvleXXm'),(3,'$2b$10$cCjbscBk1fHaeo2npwyUsOqJejmAlQDCnnBa0IIkgj9FqPwyKGNte'),(4,'$2b$10$2cijPw9Eo8gh6oijXLTsoum/lvsmi90fi0TP1EJX4p.c8l6AVFJUa'),(6,'$2b$10$HrolZ326T.aZImCrFTC1D.Wx1iI.MOPs4Ff8V2A6CpqG6XhG8g5h6'),(7,'$2b$10$pZQiKXWnsM5VyJDzUOSVN.HrqKiPGpKR7PyhZKJWjkJrnA6xvVEzu'),(8,'$2b$10$UqtKpM4C4SN1cv18NrWEbOhCFycNGyxH6yDef.InPgRcp8xIxuGUu'),(9,'$2b$10$tfoX43aBy1G1Lv0KQhEhCekmz/mDnuiT7X7/t4TbRWiYl6w6BNPk6'),(10,'$2b$10$BJuC2YfUhyYMfRI3pr.B9OymKqVOkVhDYCaVV8El.iMHG5Xd./sgC'),(11,'$2b$10$AArBs6.WwDPPGMdAvJ/9AOTgTmhl6rQZwxfxKrlzLSLPhcAwZ7lmm'),(12,'$2b$10$A52Ual58RPkEbcPmx.DNPe.D44qG9Hhc/DynrCpg0FhY5u3s0MJzi'),(13,'$2b$10$WoYYWiZXHUMiYLCa0mRFR.aGZzdm3qd.gGIv9b/i9kdahMhNVvOdy'),(14,'$2b$10$zGCeIRwAq2Od/RflkSb6S.PQbVua3tVPQt21md9JDHi5Ci4Fi/xPy'),(15,'$2b$10$LytNffOWZlY7g2gwpQvECOSAfEUJrZg02LagzROQbVyWesO3Nx1Hq'),(16,'$2b$10$ZzPKDZA7.4Kjf/B8w3HgB.UNGH6RxwF6AV3vfnFMF8wqCR1LBf1xa'),(17,'$2b$10$X7SkDJh8xnxYeXtmcm2ju.NhdYF4cyQYgXW/6v2qoEzlBlnw21jTm'),(18,'$2b$10$7LOUhOnPa7NbjsYjrgTPH.f7.odHxIG9FNFUNm3uAyYGj9GAX.hGK'),(19,'$2b$10$tPUIk7jJv3cKSQy36x5JW.23PHRCdEmcuvghx13NFkBtyxUaEOthe'),(20,'$2b$10$17.vaDQDzKjVyMXei/O6Te8YgyywNWYomayQ6FeuqxGXaPko2BbCm'),(21,'$2b$10$fcuN7y3ZSqM.4aDOMyQgIetXOELlakC6k1KArw18YzL2FvmsqeVOq'),(22,'$2b$10$GBcn.gl1cGZa.DsYYxbaHeKwp9eYJ1aSGckgYzjLQGlWKs1QsGDEG'),(23,'$2b$10$6qppsev4PXY5JEhGtaz.L..lCb8ifyaFaDzVcPH776cqH.5Qlslwq'),(24,'$2b$10$Oq8soDRfu8jLKCct.4H5/uByXgUQzBZDd4mohYFdd.Lxl2x3J0IXy'),(25,'$2b$10$kakkCDVBDEMfGicW4Ofs1ef1Ma3Jmp7zU8BcrM2P4xjrHOSg5gjyi');
/*!40000 ALTER TABLE `email_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `event_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `street_address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `post_code` smallint NOT NULL,
  `state` varchar(50) NOT NULL,
  `branch_id` int unsigned NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `fk_branch_id` (`branch_id`),
  CONSTRAINT `fk_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,'Community Clean-up','Join us for a community clean-up event in the local park.','2024-07-15','09:00:00','12:00:00','12','Park St','Adelaide',5000,'South Australia',1),(2,'Food Drive','Help us collect and distribute food to those in need.','2024-08-20','10:00:00','14:00:00','45A','Main Rd','Sydney',2000,'New South Wales',2),(3,'Charity Run','Participate in our charity run to raise funds for local shelters.','2024-09-10','08:00:00','11:00:00','78','Runway Ave','Brisbane',4000,'Queensland',3),(4,'Community Clean-up 2','Join us for a community clean-up event in the local park.','2024-07-15','09:00:00','12:00:00','12','Park St','Adelaide',5000,'South Australia',1),(7,'Local Heritage Tour','Explore the historical sites of our city with a guided walking tour.','2024-06-10','10:00:00','13:00:00','20','Heritage Ln','Adelaide',5000,'South Australia',1),(8,'Community Book Swap','Exchange your favorite books with community members.','2024-06-13','15:00:00','18:00:00','36','Library Rd','Sydney',2005,'New South Wales',2),(9,'Green Tech Workshop','Learn about the latest in sustainable technology.','2024-06-11','14:00:00','17:00:00','44','Tech Park','Melbourne',3000,'Victoria',3),(10,'City Cycling Day','Join a group bike ride through the city to promote cycling and healthy living.','2024-06-12','07:00:00','10:00:00','10','Cycle Path','Brisbane',4000,'Queensland',4),(11,'Winter Warmth Drive','Collect winter clothing and blankets for those in need.','2024-07-05','09:00:00','13:00:00','25','Charity Way','Adelaide',5000,'South Australia',1),(12,'Tech for Seniors','Help seniors learn how to use technology to enhance their lives.','2024-07-08','10:00:00','14:00:00','18','Senior Center Dr','Sydney',2005,'New South Wales',2),(13,'Riverbank Planting','Plant native flora along the riverbank to help restore the natural habitat.','2024-07-12','08:00:00','12:00:00','12','River Rd','Melbourne',3000,'Victoria',3),(14,'Community Art Project','Collaborate on a large mural that reflects our community’s diversity.','2024-07-15','10:00:00','16:00:00','8','Mural St','Brisbane',4000,'Queensland',4),(15,'Local History Exhibition','Explore the history of our city through photographs and artifacts.','2024-07-18','12:00:00','17:00:00','33','Museum Rd','Adelaide',5000,'South Australia',1),(16,'Science Fair','Showcase local student science projects and innovations.','2024-07-22','09:00:00','14:00:00','27','School St','Sydney',2005,'New South Wales',2),(17,'Sustainability Workshop','Engage in activities that promote sustainable living practices.','2024-07-25','11:00:00','15:00:00','11','Eco Blvd','Melbourne',3000,'Victoria',3),(18,'Fitness in the Park','Join us for a series of fitness classes open to all fitness levels.','2024-07-28','07:00:00','10:00:00','16','Park Ave','Brisbane',4000,'Queensland',4);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `google_auth`
--

DROP TABLE IF EXISTS `google_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `google_auth` (
  `user_id` int unsigned NOT NULL,
  `google_id` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_google_auth_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `google_auth`
--

LOCK TABLES `google_auth` WRITE;
/*!40000 ALTER TABLE `google_auth` DISABLE KEYS */;
/*!40000 ALTER TABLE `google_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
  `manager_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `branch_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  KEY `fk_manager_user` (`user_id`),
  KEY `fk_manager_branch` (`branch_id`),
  CONSTRAINT `fk_manager_branch` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_manager_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
/*!40000 ALTER TABLE `manager` DISABLE KEYS */;
INSERT INTO `manager` VALUES (1,8,1),(2,9,2),(3,19,1),(4,23,3);
/*!40000 ALTER TABLE `manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_subscription`
--

DROP TABLE IF EXISTS `notification_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_subscription` (
  `volunteer_id` int unsigned NOT NULL,
  `receive_event` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`volunteer_id`),
  CONSTRAINT `fk_notification_volunteer` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteer` (`volunteer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_subscription`
--

LOCK TABLES `notification_subscription` WRITE;
/*!40000 ALTER TABLE `notification_subscription` DISABLE KEYS */;
INSERT INTO `notification_subscription` VALUES (1,1),(2,0),(3,1),(4,0),(6,0),(7,1),(8,1),(9,0),(10,0),(11,0),(12,1),(13,0),(14,0),(15,1),(16,0),(17,0),(18,0),(19,0),(20,0);
/*!40000 ALTER TABLE `notification_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `post_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `audience` varchar(50) DEFAULT NULL,
  `published_date` date DEFAULT NULL,
  `published_time` time DEFAULT NULL,
  `branch_id` int unsigned NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `fk_branch_post` (`branch_id`),
  CONSTRAINT `fk_branch_post` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'Welcome to Adelaide Branch','We are excited to welcome new volunteers to the Adelaide branch.','Public','2024-01-15','09:00:00',1),(2,'Sydney Branch Event','Join us for a community clean-up event in Sydney.','Private','2024-02-20','10:30:00',2),(3,'Brisbane Branch Update','We are pleased to announce new volunteer opportunities in the Brisbane branch.','Public','2024-03-01','11:00:00',4),(4,'Hobart Branch Meeting','All volunteers are invited to the upcoming meeting at the Hobart branch.','Public','2024-04-01','14:00:00',3),(5,'Plant Event Created','Join us!','public','2024-06-14','07:29:09',3);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rsvp`
--

DROP TABLE IF EXISTS `rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsvp` (
  `rsvp_id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned NOT NULL,
  `volunteer_id` int unsigned NOT NULL,
  PRIMARY KEY (`rsvp_id`),
  KEY `fk_event_id` (`event_id`),
  KEY `fk_volunteer_id` (`volunteer_id`),
  CONSTRAINT `fk_event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_volunteer_id` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteer` (`volunteer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rsvp`
--

LOCK TABLES `rsvp` WRITE;
/*!40000 ALTER TABLE `rsvp` DISABLE KEYS */;
INSERT INTO `rsvp` VALUES (2,3,1),(3,3,8),(4,3,9),(5,3,15),(9,2,2),(10,2,3),(11,2,4),(12,2,6),(23,1,12),(24,4,12),(25,7,12),(26,11,12),(27,15,12),(28,1,13),(29,4,13),(30,7,13),(31,11,13),(32,15,13),(33,1,16),(34,4,16),(35,7,16),(36,11,16),(37,15,16),(42,8,2),(43,8,3),(44,8,4),(45,8,6),(46,12,2),(47,12,3),(48,12,4),(49,12,6),(50,16,2),(51,16,3),(52,16,4),(53,16,6),(73,9,1),(74,9,8),(75,9,9),(76,9,15),(77,13,1),(78,13,8),(79,13,9),(80,13,15),(81,17,1),(82,17,8),(83,17,9),(84,17,15),(100,10,7),(101,10,10),(102,10,11),(103,10,14),(104,10,17),(105,10,18),(106,14,7),(107,14,10),(108,14,11),(109,14,14),(110,14,17),(111,14,18),(112,18,7),(113,18,10),(114,18,11),(115,18,14),(116,18,17),(117,18,18),(131,11,20);
/*!40000 ALTER TABLE `rsvp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_admin`
--

DROP TABLE IF EXISTS `system_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_admin` (
  `system_admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`system_admin_id`),
  KEY `fk_system_admin_user` (`user_id`),
  CONSTRAINT `fk_system_admin_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_admin`
--

LOCK TABLES `system_admin` WRITE;
/*!40000 ALTER TABLE `system_admin` DISABLE KEYS */;
INSERT INTO `system_admin` VALUES (1,24);
/*!40000 ALTER TABLE `system_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `user_role` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Joann','Su','js@gmail.com','0451117647','1973-01-27','VOLUNTEER'),(2,'Zendaya','Coleman','zendaya@gmail.com','0498123243','1994-07-11','VOLUNTEER'),(3,'Lionel','Messi','lm@gmail.com','0492142134','1974-10-14','VOLUNTEER'),(4,'Daniel','Reeves','dr@gmail.com','0493923241','1976-01-01','VOLUNTEER'),(6,'John','Cena','johncena@gmail.com','0452319647','1992-06-12','VOLUNTEER'),(7,'Fiona','Carla','fc@gmail.com','0492142323','2001-12-03','VOLUNTEER'),(8,'Earl','Smith','earlsmith@gmail.com','0451219647','1952-01-01','MANAGER'),(9,'Isla','Fisher','islafisher@gmail.com','0492349643','2024-01-01','MANAGER'),(10,'Aisha','Donaldson','aishadonaldson@gmail.com','0491232142','2024-11-13','VOLUNTEER'),(11,'Cornelia','Levine','cl@gmail.com','0432434234','2013-12-11','VOLUNTEER'),(12,'Noah','Taylor','noahtaylor@gmail.com','0412314321','1979-12-31','VOLUNTEER'),(13,'Jaehyun','Jeong','jj@gmail.com','0423412342','2024-01-01','VOLUNTEER'),(14,'Jungkook','Jeon','jeonjungkook@gmail.com','0451212047','1990-10-29','VOLUNTEER'),(15,'Annalise','Jeon','annalise@gmail.com','0451212047','1990-10-29','VOLUNTEER'),(16,'Kaira','Lai','kairalai@gmail.com','0423923432','1979-11-28','VOLUNTEER'),(17,'Kino','Tan','kinotan@gmail.com','0423423245','1979-12-01','VOLUNTEER'),(18,'Penelope','Donaldson Jefferson','pdj@gmail.com','0451219642','2024-10-29','VOLUNTEER'),(19,'Nigel','Tan','nigeltan@outlook.com','0423543223','2024-01-01','MANAGER'),(20,'Kendall','Jenner','kj@gmail.com','0413235423','2024-01-01','VOLUNTEER'),(21,'Anna','Taylor','annat@gmail.com','0423004533','1975-11-13','VOLUNTEER'),(22,'Zac','Efron','ze@gmail.com','0493823432','1984-12-01','VOLUNTEER'),(23,'Hayley','Kiki','hk@gmail.com','0412345678','2002-02-22','MANAGER'),(24,'Joae','Su','js@yahoo.com','0465754123','1994-04-16','ADMIN'),(25,'Mai','Lumos','ml@gmail.com','0438492283','1999-06-13','VOLUNTEER');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_user_insert` AFTER INSERT ON `user` FOR EACH ROW BEGIN
    IF NEW.user_role = 'volunteer' THEN
      INSERT INTO volunteer (user_id)
      VALUES (NEW.user_id);
      INSERT INTO notification_subscription (volunteer_id) VALUES (LAST_INSERT_ID());

    ELSEIF NEW.user_role = 'admin' THEN
      INSERT INTO system_admin (user_id) VALUES (NEW.user_id);
    ELSEIF NEW.user_role = 'manager' THEN
      INSERT INTO manager (user_id) VALUES (NEW.user_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer` (
  `volunteer_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `branch_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`),
  KEY `user_id` (`user_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `volunteer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `volunteer_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer`
--

LOCK TABLES `volunteer` WRITE;
/*!40000 ALTER TABLE `volunteer` DISABLE KEYS */;
INSERT INTO `volunteer` VALUES (1,1,3),(2,2,2),(3,3,2),(4,4,2),(6,6,2),(7,7,4),(8,10,3),(9,11,3),(10,12,4),(11,13,4),(12,14,1),(13,15,1),(14,16,4),(15,17,3),(16,18,1),(17,20,4),(18,21,4),(19,22,4),(20,25,1);
/*!40000 ALTER TABLE `volunteer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-14 11:47:56

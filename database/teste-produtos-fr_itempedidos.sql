-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: teste-produtos-fr
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `itempedidos`
--

DROP TABLE IF EXISTS `itempedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itempedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `preco` float DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `produtoId` int(11) DEFAULT NULL,
  `pedidoId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `produtoId` (`produtoId`),
  KEY `pedidoId` (`pedidoId`),
  CONSTRAINT `itempedidos_ibfk_1` FOREIGN KEY (`produtoId`) REFERENCES `produtos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `itempedidos_ibfk_2` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itempedidos`
--

LOCK TABLES `itempedidos` WRITE;
/*!40000 ALTER TABLE `itempedidos` DISABLE KEYS */;
INSERT INTO `itempedidos` VALUES (1,'Produto #teste_finalizar_pedido_01',15.07,4,13,1,'2020-11-03 07:34:23','2020-11-03 07:34:23'),(2,'Produto #teste_finalizar_pedido_02',36.85,6,14,1,'2020-11-03 07:34:23','2020-11-03 07:34:23'),(3,'Produto #teste_muda_satus_pedido_01',58.13,4,15,2,'2020-11-03 07:34:24','2020-11-03 07:34:24'),(4,'Produto #teste_muda_satus_pedido_02',3.36,6,16,2,'2020-11-03 07:34:24','2020-11-03 07:34:24');
/*!40000 ALTER TABLE `itempedidos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-03  5:04:05

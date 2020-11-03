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
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `preco` float DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `tags_str` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Produto #teste01','Descrição do produto #teste01',19.75,'http://www.imagens.com./produtos/produto_teste01.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:20','2020-11-03 07:34:20'),(2,'Produto teste #1 alterado','Descrição do produto teste #1 alterado',33.56,'http://www.imagens.com./produtos/produto_teste_01_alterado.jpg','[{\"id\":2,\"name\":\"tag3\"},{\"id\":4,\"name\":\"tag4\"}]','ativo','2020-11-03 07:34:20','2020-11-03 07:34:21'),(3,'Produto #teste_03','Descrição do produto #teste_03',40.84,'http://www.imagens.com./produtos/produto_teste_03.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:21','2020-11-03 07:34:21'),(4,'Produto #teste_01_ativo','Descrição do produto #teste_01_ativo',71.04,'http://www.imagens.com./produtos/produto_teste_01_ativo.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:21','2020-11-03 07:34:21'),(5,'Produto #teste_01_inativo','Descrição do produto #teste_01_inativo',8.81,'http://www.imagens.com./produtos/produto_teste_01_inativo.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','inativo','2020-11-03 07:34:21','2020-11-03 07:34:21'),(6,'Produto #teste_04_busca','Descrição do produto #teste_04_busca',90.99,'http://www.imagens.com./produtos/produto_teste_04_busca.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:21','2020-11-03 07:34:21'),(7,'Produto #teste_05_busca','Descrição do produto #teste_05_busca',83.43,'http://www.imagens.com./produtos/produto_teste_05_busca.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:21','2020-11-03 07:34:21'),(9,'Produto #teste_01_carrinho','Descrição do produto #teste_01_carrinho',31.55,'http://www.imagens.com./produtos/produto_teste_01_carrinho.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:22','2020-11-03 07:34:22'),(10,'Produto #test_02_carrinho','Descrição do produto #test_02_carrinho',18.98,'http://www.imagens.com./produtos/produto_test_02_carrinho.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:22','2020-11-03 07:34:22'),(11,'Produto #teste_01_limpa_carrinho','Descrição do produto #teste_01_limpa_carrinho',84.16,'http://www.imagens.com./produtos/produto_teste_01_limpa_carrinho.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:22','2020-11-03 07:34:22'),(12,'Produto #teste_02_limpa_carrinho','Descrição do produto #teste_02_limpa_carrinho',38,'http://www.imagens.com./produtos/produto_teste_02_limpa_carrinho.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:22','2020-11-03 07:34:22'),(13,'Produto #teste_finalizar_pedido_01','Descrição do produto #teste_finalizar_pedido_01',15.07,'http://www.imagens.com./produtos/produto_teste_finalizar_pedido_01.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:23','2020-11-03 07:34:23'),(14,'Produto #teste_finalizar_pedido_02','Descrição do produto #teste_finalizar_pedido_02',36.85,'http://www.imagens.com./produtos/produto_teste_finalizar_pedido_02.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:23','2020-11-03 07:34:23'),(15,'Produto #teste_muda_satus_pedido_01','Descrição do produto #teste_muda_satus_pedido_01',58.13,'http://www.imagens.com./produtos/produto_teste_muda_satus_pedido_01.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:23','2020-11-03 07:34:23'),(16,'Produto #teste_muda_satus_pedido_02','Descrição do produto #teste_muda_satus_pedido_02',3.36,'http://www.imagens.com./produtos/produto_teste_muda_satus_pedido_02.jpg','[{\"id\":1,\"name\":\"tag1\"},{\"id\":2,\"name\":\"tag2\"}]','ativo','2020-11-03 07:34:24','2020-11-03 07:34:24');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
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

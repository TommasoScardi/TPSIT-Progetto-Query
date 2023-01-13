-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Gen 13, 2023 alle 19:30
-- Versione del server: 10.4.24-MariaDB
-- Versione PHP: 8.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `queryproject`
--
CREATE DATABASE IF NOT EXISTS `queryproject` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `queryproject`;

-- --------------------------------------------------------

--
-- Struttura della tabella `costs`
--

CREATE TABLE `costs` (
  `id_mot` int(11) NOT NULL,
  `taxes` float DEFAULT NULL,
  `fuel` char(1) DEFAULT NULL,
  `fuel_consumption_unit` varchar(2) DEFAULT NULL,
  `kilometer_per_unit` float DEFAULT NULL,
  `subscription` float DEFAULT NULL,
  `ticket` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `costs`
--

INSERT INTO `costs` (`id_mot`, `taxes`, `fuel`, `fuel_consumption_unit`, `kilometer_per_unit`, `subscription`, `ticket`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL),
(2, NULL, 'E', 'KW', 3.75, NULL, NULL),
(3, 400, 'B', 'LT', 6.5, NULL, NULL),
(4, NULL, NULL, NULL, NULL, NULL, 15),
(5, NULL, NULL, NULL, NULL, 55, 2),
(6, NULL, NULL, NULL, NULL, 200, 75),
(7, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 400, 'B', 'LT', 7, NULL, NULL),
(9, NULL, NULL, NULL, NULL, 60, 3),
(10, NULL, NULL, NULL, NULL, 250, 45),
(11, NULL, NULL, NULL, NULL, NULL, 200),
(12, NULL, NULL, NULL, NULL, 100, 30);

-- --------------------------------------------------------

--
-- Struttura della tabella `emissions`
--

CREATE TABLE `emissions` (
  `id_mot` int(11) NOT NULL,
  `g_co2_km` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `emissions`
--

INSERT INTO `emissions` (`id_mot`, `g_co2_km`) VALUES
(1, 0.5),
(2, 1),
(3, 43),
(4, 27),
(5, 104),
(6, 6),
(7, 0.1),
(8, 171),
(9, 41),
(10, 254),
(11, 195),
(12, 25);

-- --------------------------------------------------------

--
-- Struttura della tabella `mot`
--

CREATE TABLE `mot` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `mot`
--

INSERT INTO `mot` (`id`, `name`, `img_url`) VALUES
(1, 'bicicletta', 'https://www.sartoribikes.com/wp-content/uploads/2014/04/sartoribikes_bicicletta_artigianale_vintage_sprint_veloce_5.jpg'),
(2, 'e-bike', 'https://elabora.pianetamountainbike.it/public/Fotografie_2021/febbraio_3/reevo-ebike.jpg'),
(3, 'macchina - 4 passeggeri', 'https://www.italpress.com/wp-content/uploads/2022/03/20220309_1679.jpg'),
(4, 'pullman', 'https://www.euro-tours.it/wp-content/uploads/2016/12/chiSiamo-1.jpg'),
(5, 'bus di linea', 'https://www.torinoggi.it/fileadmin/archivio/torinoggi/autobus_sostitutivo_metro.jpeg'),
(6, 'treno - alta velocita', 'https://img.ilgcdn.com/sites/default/files/styles/xl/public/foto/2021/12/02/1638462257-260725598-306855261307119-5990971065258073832-n.jpg?_=1638462257'),
(7, 'camminare', 'https://www.italiaatavola.net/images/contenutiarticoli/nordic-walking.jpeg'),
(8, 'macchina - 1 passeggero', 'https://cdn.autoblog.it/v0t0RyYFVnIOBpUO-ckWajyYZrg=/1200x800/smart/https://www.autoblog.it/app/uploads/2022/01/lancia-delta-integrale-edizione-finale-6-e1641563893848.jpg'),
(9, 'treno - regionale', 'https://3.bp.blogspot.com/-ICWv2QS0It8/W9gzq0a6U-I/AAAAAAAAAdM/Rm5Nw2DyCFMKSHOCfUZDJdW45vHXdGpzACLcBGAs/s1600/2.JPG'),
(10, 'aereo - tragitti corti', 'https://upload.wikimedia.org/wikipedia/commons/5/53/Air_Italy%2C_EI-GGO%2C_Airbus_A330-202_%2846906571434%29.jpg'),
(11, 'aereo - tragitti lunghi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Boeing_747-8_first_flight_Everett%2C_WA.jpg/1200px-Boeing_747-8_first_flight_Everett%2C_WA.jpg'),
(12, 'traghetto', 'https://www.talas.it/wp-content/uploads/2015/05/prenotazione-traghetti-elba-isola-d-elba-traghetti-capoliveri-moby2.jpg');

-- --------------------------------------------------------

--
-- Struttura della tabella `trip`
--

CREATE TABLE `trip` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `trip`
--

INSERT INTO `trip` (`id`, `name`) VALUES
(1, 'casa-lavoro'),
(2, 'casa-scuola'),
(3, 'casa-universita');

-- --------------------------------------------------------

--
-- Struttura della tabella `trip_mot`
--

CREATE TABLE `trip_mot` (
  `id_trip` int(11) NOT NULL,
  `id_mot` int(11) NOT NULL,
  `km_traveled` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `trip_mot`
--

INSERT INTO `trip_mot` (`id_trip`, `id_mot`, `km_traveled`) VALUES
(1, 7, 1),
(1, 5, 27),
(1, 7, 1),
(2, 2, 5),
(2, 5, 15),
(2, 7, 1),
(3, 2, 10),
(3, 7, 1);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `costs`
--
ALTER TABLE `costs`
  ADD PRIMARY KEY (`id_mot`);

--
-- Indici per le tabelle `emissions`
--
ALTER TABLE `emissions`
  ADD PRIMARY KEY (`id_mot`);

--
-- Indici per le tabelle `mot`
--
ALTER TABLE `mot`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indici per le tabelle `trip_mot`
--
ALTER TABLE `trip_mot`
  ADD KEY `id_trip` (`id_trip`),
  ADD KEY `id_mot` (`id_mot`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `mot`
--
ALTER TABLE `mot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `trip`
--
ALTER TABLE `trip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `costs`
--
ALTER TABLE `costs`
  ADD CONSTRAINT `costs_ibfk_1` FOREIGN KEY (`id_mot`) REFERENCES `mot` (`id`);

--
-- Limiti per la tabella `emissions`
--
ALTER TABLE `emissions`
  ADD CONSTRAINT `emissions_ibfk_1` FOREIGN KEY (`id_mot`) REFERENCES `mot` (`id`);

--
-- Limiti per la tabella `trip_mot`
--
ALTER TABLE `trip_mot`
  ADD CONSTRAINT `trip_mot_ibfk_1` FOREIGN KEY (`id_trip`) REFERENCES `trip` (`id`),
  ADD CONSTRAINT `trip_mot_ibfk_2` FOREIGN KEY (`id_mot`) REFERENCES `mot` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

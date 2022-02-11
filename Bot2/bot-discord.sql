-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 11 fév. 2022 à 18:57
-- Version du serveur :  5.7.33
-- Version de PHP : 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bot-discord`
--

-- --------------------------------------------------------

--
-- Structure de la table `insults`
--

CREATE TABLE `insults` (
  `id` int(11) NOT NULL,
  `user_id` varchar(25) NOT NULL,
  `guild_id` varchar(25) NOT NULL,
  `insult_count` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `insults`
--

INSERT INTO `insults` (`id`, `user_id`, `guild_id`, `insult_count`) VALUES
(1, '120133103304835072', '938078116792913940', 0),
(2, '433366920905883648', '938078116792913940', 3),
(3, '120133103304835072', '939179272524935239', 3);

-- --------------------------------------------------------

--
-- Structure de la table `xp`
--

CREATE TABLE `xp` (
  `id` int(11) NOT NULL,
  `user_id` varchar(25) NOT NULL,
  `guild_id` varchar(25) NOT NULL,
  `xp_count` int(11) NOT NULL DEFAULT '0',
  `xp_level` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `xp`
--

INSERT INTO `xp` (`id`, `user_id`, `guild_id`, `xp_count`, `xp_level`) VALUES
(1, '120133103304835072', '939179272524935239', 22, 3),
(2, '260525837315604490', '938078116792913940', 67, 6),
(3, '425682756249452545', '938078116792913940', 30, 3),
(4, '120133103304835072', '938078116792913940', 23, 3),
(5, '433366920905883648', '938078116792913940', 57, 5);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `insults`
--
ALTER TABLE `insults`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `xp`
--
ALTER TABLE `xp`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `insults`
--
ALTER TABLE `insults`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `xp`
--
ALTER TABLE `xp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 29 Μάη 2025 στις 17:30:34
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `nodejs`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `people_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `user_id`, `restaurant_id`, `date`, `time`, `people_count`) VALUES
(14, 1, 30, '2025-05-28', '16:45:00', 3),
(15, 1, 65, '2025-05-28', '16:45:00', 1),
(16, 1, 30, '2025-05-31', '16:45:00', 1),
(18, 1, 12, '2025-05-28', '17:15:00', 1),
(27, 1, 35, '2025-05-28', '23:00:00', 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `restaurants`
--

CREATE TABLE `restaurants` (
  `restaurant_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `restaurants`
--

INSERT INTO `restaurants` (`restaurant_id`, `name`, `location`, `description`) VALUES
(1, 'La Piazza', 'Rome, Italy', 'Authentic Italian cuisine with fresh pasta and wine.'),
(2, 'Tokyo Diner', 'Tokyo, Japan', 'Sushi, ramen, and traditional Japanese dishes.'),
(3, 'The Smokehouse', 'Texas, USA', 'BBQ and smoked meats with a rustic vibe.'),
(4, 'Le Gourmet', 'Paris, France', 'Fine French dining with an elegant atmosphere.'),
(5, 'Curry Garden', 'Mumbai, India', 'Spicy Indian curries and tandoori specialties.'),
(6, 'Dragon Palace', 'Beijing, China', 'Dim sum, noodles, and classic Chinese meals.'),
(7, 'Green Leaf', 'Berlin, Germany', 'Vegan and vegetarian dishes with organic ingredients.'),
(8, 'El Toro Loco', 'Madrid, Spain', 'Tapas and Spanish fusion cuisine.'),
(9, 'Ocean Breeze', 'Sydney, Australia', 'Seafood restaurant by the harbor.'),
(10, 'Burger Town', 'New York, USA', 'Craft burgers, fries, and shakes.'),
(11, 'Saffron Lounge', 'Doha, Qatar', 'Upscale Middle Eastern cuisine with a modern twist.'),
(12, 'Bistro Lumière', 'Lyon, France', 'Charming bistro with classic French dishes and wine.'),
(13, 'Casa de Tapas', 'Seville, Spain', 'Lively tapas bar with traditional Andalusian flavors.'),
(14, 'Kebab Kingdom', 'Istanbul, Turkey', 'Authentic Turkish kebabs and mezes.'),
(15, 'The Garden Fork', 'Toronto, Canada', 'Farm-to-table concept with seasonal menus.'),
(16, 'Yalla Habibi', 'Dubai, UAE', 'Lebanese grill with rooftop views of the skyline.'),
(17, 'The Noodle House', 'Bangkok, Thailand', 'Street-style Thai noodles and spicy soups.'),
(18, 'Savanna Flame', 'Cape Town, South Africa', 'South African braai and game meat specialties.'),
(19, 'Pão de Queijo', 'São Paulo, Brazil', 'Brazilian comfort food and fresh cheese bread.'),
(20, 'Nordic Table', 'Stockholm, Sweden', 'Scandinavian flavors with a minimalist touch.'),
(21, 'The Gyro Spot', 'Athens, Greece', 'Traditional Greek gyros and souvlaki wraps.'),
(22, 'The Artisan Plate', 'Melbourne, Australia', 'Contemporary Australian dining with global influences.'),
(23, 'Korean Seoul Kitchen', 'Seoul, South Korea', 'Korean BBQ and homestyle dishes.'),
(24, 'Chalet Fondue', 'Zurich, Switzerland', 'Cheese fondue, raclette, and alpine specialties.'),
(25, 'Spice Route', 'Colombo, Sri Lanka', 'Aromatic Sri Lankan curries and seafood.'),
(26, 'Maple & Oak', 'Vancouver, Canada', 'Cozy brunch café with local ingredients.'),
(27, 'Tuscany Tavern', 'Florence, Italy', 'Rustic Tuscan cuisine with local wine.'),
(28, 'Himalaya Heights', 'Kathmandu, Nepal', 'Nepalese momo, dal bhat, and mountain fare.'),
(29, 'Pho House', 'Hanoi, Vietnam', 'Traditional pho and Vietnamese street food.'),
(30, 'Balkan Bites', 'Belgrade, Serbia', 'Grilled meats, burek, and regional specialties.'),
(31, 'Jungle Feast', 'Manaus, Brazil', 'Amazonian ingredients and indigenous dishes.'),
(32, 'Pierogi Place', 'Krakow, Poland', 'Handmade pierogi and Polish comfort food.'),
(33, 'Tandoori Flames', 'Delhi, India', 'Classic tandoori and Mughlai dishes.'),
(34, 'Fusion District', 'San Francisco, USA', 'Eclectic fusion cuisine from around the world.'),
(35, 'Alpenglow Grill', 'Innsbruck, Austria', 'Hearty alpine meals with mountain views.'),
(36, 'Sakura Bloom', 'Kyoto, Japan', 'Kaiseki dining with a seasonal focus.'),
(37, 'Urban Wok', 'Singapore', 'Modern Asian wok dishes in a chic setting.'),
(38, 'Tiki Torch', 'Honolulu, Hawaii', 'Island-style BBQ and tropical cocktails.'),
(39, 'Bun & Bao', 'Taipei, Taiwan', 'Bao buns, noodle soups, and Taiwanese snacks.'),
(40, 'Mezcalito', 'Mexico City, Mexico', 'Contemporary Mexican cuisine with artisanal mezcal.'),
(41, 'Bistro Lumière', 'Nice, France', 'Cozy bistro with Provençal specialties.'),
(42, 'Casa Mexicana', 'Cancun, Mexico', 'Authentic tacos, enchiladas, and margaritas.'),
(43, 'Sakura Garden', 'Kyoto, Japan', 'Seasonal kaiseki meals in a serene setting.'),
(44, 'The Fish Market', 'Seattle, USA', 'Fresh seafood grilled to order.'),
(45, 'La Parrilla', 'Buenos Aires, Argentina', 'Traditional Argentinian steakhouse.'),
(46, 'The Greek Table', 'Athens, Greece', 'Mediterranean dishes with olive oil and herbs.'),
(47, 'Spice Route', 'Bangkok, Thailand', 'Street-style Thai food in a casual environment.'),
(48, 'The Alpine Lodge', 'Zermatt, Switzerland', 'Hearty alpine meals and fondue.'),
(49, 'Dolce Vita', 'Florence, Italy', 'Wood-fired pizzas and homemade gelato.'),
(50, 'Pasha Mezze', 'Istanbul, Turkey', 'Turkish meze platters and grilled kebabs.'),
(51, 'Seoul Table', 'Seoul, South Korea', 'Korean BBQ and banchan spreads.'),
(52, 'The British Pantry', 'London, UK', 'Pies, puddings, and afternoon tea.'),
(53, 'Café Havana', 'Havana, Cuba', 'Live music and Cuban cocktails.'),
(54, 'Nordic Bites', 'Oslo, Norway', 'Modern Scandinavian cuisine.'),
(55, 'Tandoor Flame', 'Delhi, India', 'North Indian cuisine with clay oven dishes.'),
(56, 'La Terraza', 'Barcelona, Spain', 'Rooftop dining with paella and sangria.'),
(57, 'Pacific Rim', 'Honolulu, Hawaii', 'Fusion dishes with island flavors.'),
(58, 'Kilimanjaro Kitchen', 'Arusha, Tanzania', 'East African stews and grilled meats.'),
(59, 'Brasserie Belle', 'Brussels, Belgium', 'Belgian beer and moules-frites.'),
(60, 'Pho House', 'Ho Chi Minh City, Vietnam', 'Traditional Vietnamese noodle soups.'),
(61, 'Riverside Deli', 'Vancouver, Canada', 'Artisan sandwiches and local ingredients.'),
(62, 'Le Bistro Vert', 'Lyon, France', 'Farm-to-table seasonal dishes.'),
(63, 'The Hungry Nomad', 'Cape Town, South Africa', 'Global street food concept.'),
(64, 'Tapas y Vino', 'Seville, Spain', 'Andalusian tapas and local wines.'),
(65, 'Alpenhütte', 'Innsbruck, Austria', 'Rustic mountain meals and schnitzel.'),
(66, 'Outback Flame', 'Perth, Australia', 'Bush tucker fusion cuisine.'),
(67, 'Zur Zytglogge', 'Bern, Switzerland', 'Swiss specialties and alpine decor.'),
(68, 'Bamboo Bowl', 'Bali, Indonesia', 'Healthy rice bowls with tropical flair.'),
(69, 'Toscana Trattoria', 'Siena, Italy', 'Tuscan cuisine with family-style service.'),
(70, 'Cafe de Lagos', 'Lagos, Nigeria', 'West African dishes with a modern twist.');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`) VALUES
(1, 'Test', 'Test@gmail.com', '$2b$10$Jp8.Uh56z0VtwuWyKVZ1I.O9p2R9h7EduYFteSLAK6XFt5d2Mx.4e'),
(2, 'Test2', 'Test2@gmail.com', '$2b$10$1idXABTttfXCuPMG7r6FkuaxVLXQnL9jnJr6od8K1H6pr2ZhRFmaO'),
(33, 'Testtt', 'fffhdfg@gmail.com', '$2b$10$3X.IrisJ3d/0VpLajlMyZuL5uhCo2HjvvCswoCjCV154DqhoBkx76'),
(34, 'Kiki Tsirka', 'kiki@yahoo.com', '$2b$10$L.OT61BvwzGOXD6FMy1GY.vjvSPtXiZ.v/2ZsYhNpMUqSqOXkLYWa'),
(35, 'Test12', 'Test12@gmail.com', '$2b$10$fQAFowZl5WgSSUQBdt7xjest9jcS3FlVDIz1UuS6SrSS9w5vujFde'),
(36, 'test123', 'test123@gmail.com', '$2b$10$gVc5ZCWlyKsTquJ17WYggufFp4IZnHmHEDlmN9EZsBqYtI.06C7KW');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `restaurant_id` (`restaurant_id`);

--
-- Ευρετήρια για πίνακα `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`restaurant_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT για πίνακα `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `restaurant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

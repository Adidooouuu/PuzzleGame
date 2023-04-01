<?php

	include 'include.php';

	// vérification des données envoyées
	if (!empty($_POST)) {

		if (array_key_exists('id_joueur', $_POST) && array_key_exists('meilleur_score', $_POST)) {

			// on décode l'id et le meilleur score du joueur envoyés ici en JSON par la requête AJAX
			$id_joueur = json_decode($_POST['id_joueur']);
			$meilleur_score = json_decode($_POST['meilleur_score']);

			if (is_numeric($id_joueur) && is_numeric($meilleur_score)) {

				$bdd->exec('UPDATE joueur SET meilleur_score = "'.$meilleur_score.'" WHERE id_joueur = "'.$id_joueur.'"');

			} else {

				echo 'L\'ID du joueur et son meilleur score doivent être des nombres';

			}

		} else {

			echo 'Impossible de trouver l\'ID du joueur et/ou son meilleur score dans les données envoyées';

		}

	} else {

		echo 'Aucune donnée n\'a été envoyée';

	}

?>
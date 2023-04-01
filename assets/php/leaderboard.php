<?php

	include 'include.php';

	$requete = $bdd->query('SELECT * FROM joueur');

	// tableau contenant les données de la BDD
	$_joueurs = array();

	// parcourir la BDD pour remplir ce tableau
	while ($data = $requete->fetch()) {

		if (!$data) {

			echo 'La liste des joueurs n\'existe pas ou est vide';
			break;

		} else {

			$_joueur = array(
				'id_joueur' => $data['id_joueur'],
				'nom_joueur' => $data['nom_joueur'],
				'meilleur_score' => $data['meilleur_score']
			);

			array_push($_joueurs, $_joueur);

		}

	}

	// définit les colonnes du tableau
	$id_joueur  = array_column($_joueurs, 'id_joueur');
	$nom_joueur = array_column($_joueurs, 'nom_joueur');
	$meilleur_score = array_column($_joueurs, 'meilleur_score');

	// trie les données par meilleur score décroissant, id croissant
	array_multisort($meilleur_score, SORT_DESC, $id_joueur, SORT_ASC, $_joueurs);

	// tableau du leaderboard final
	$_leaderboard = array();

	// remplir ce tableau avec les données des 3 meilleurs joueurs
	for ($i = 0; $i < 3 && $i < count($_joueurs); $i++) {
		array_push($_leaderboard, $_joueurs[$i]);
	}

	// la réponse JSON de la requête AJAX est le leaderboard
	echo json_encode($_leaderboard);

?>
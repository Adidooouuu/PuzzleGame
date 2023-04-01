<?php

    ini_set('display_errors', 'Off');
    ini_set('log_errors', 'On');
    ini_set('error_log', 'log.txt');
	
	// Parametres de connexion
	$serveur  = "";
	$database = "";
	$user     = "";
	$password = "";
	
	try {	
		// Connexion a la base de donnees
		// $bdd est un objet correspondant a la connexion a la BDD
		$bdd = new PDO('mysql:host='.$serveur.';charset=utf8;dbname='.$database.'', $user, $password);
		
		/* La ligne ci-dessous permet d'activer les erreurs lors de la connexion a la BDD via PDO.
		Les messages d'erreur lie a des requetes SQL comportant des erreurs seront plus clairs. */
		[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
	}
	catch(Exception $e) {
		// On lance une fonction PHP qui permet de connetre l'erreur renvoyee lors de la connection a la base (en recuperant le message lie a l'exception)
		die('<strong>Erreur détectée !!! </strong> : ' . $e->getMessage());
	}

?>

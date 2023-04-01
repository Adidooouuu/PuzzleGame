/**
 * On attend que le DOM soit totalement chargé
 */
 $(document).ready(function() {

    // création d'un tableau multidimensionnel associatif pour les données de difficulté
    var tabGame = {
        "facile" : {
           "class" : "puzzle_grid_1",
           "nbr_grid" : 9,
           "files" : "assets/img/puzzle/3x3/"
        },
        "moyen" : {
            "class" : "puzzle_grid_2",
            "nbr_grid" : 16,
            "files" : "assets/img/puzzle/4x4/"
        },
        "difficile" : {
            "class" : "puzzle_grid_3",
            "nbr_grid" : 25,
            "files" : "assets/img/puzzle/5x5/"
        }
    }

    const Reg_exp = /^([A-Za-zÀ-ÖØ-öø-ÿ]{3,25})$/;

    // Listener pour le submit du formulaire contenu dans le section d'id home
    $('#home').on('submit', function(e){
        // fonction au moment où le formulaire est submit
        clickVerifForm(e);
        return false;
    });

    function clickVerifForm(e){
        e.preventDefault();

        // récupère l'element DOM (input) d'id name_player
        var name_player = $('#name_player');
        // récupère la valeur du input d'id name_player (soit le nom du joueur renseigné dans le input)
        var name_player_value = $('#name_player').val();
        // test si la donnée (nom du joueur) respecte des conditions
        if (!Reg_exp.test(name_player_value)) {
            // place le focus sur l'input
            name_player.focus();
            // met une couleur de fond
            name_player.css("background-color", "rgba(255, 0, 0, 0.1)");
            // définit la valeur de name_player en une chaine de caractere vide
            name_player.val("");
            // modification du placeholder
            name_player.attr("placeholder", "");
            // Envoi d'un message d'erreur dans le paragraphe dédié (en le vidant avant s'il contenait déjà un message)
            $(".id_player").first().css("padding", "1.83rem 6rem");
            $("#error_msg").html("");
            $("#error_msg").html("Seulement des lettres ! :) <br> De 3 à 25 caractères !");
            // return false pour quitter la fonction en cours (clickVerifForm)
            return false;
        }

        // requête AJAX vers envoi.php en vue d'envoyer le nom du joueur en BDD
        // puis récupérer les données du joueur
        $.ajax({

            type: 'POST',
            url: 'assets/php/joueur.php',
            data: {name: JSON.stringify(name_player_value)},
            dataType: 'json'

        }).done(function(data) {

            // récupère les données du joueur de la réponse JSON
            var id_joueur = data.id_joueur;
            var nom_joueur = data.nom_joueur;
            var meilleur_score = data.meilleur_score;

            // du form récupère la valeur du select qui est sélectionné (soit la difficulte selectionne par le joueur)
            var difficulty_valeur = $("#home select option:selected").val();

            // supprime l'element du DOM d'id "home" avec la methode remove (soit toute la zone du formulaire de parametrage du jeu)
            $('#home').remove();

            /*********************************/

            // appel un element du DOM avec pour id article
            var article = $('#article');

            //
            var pourcentage = 100;
            var essais = 0;

            /*********************************/

            // création de la page de jeu
            init_game(name_player_value, difficulty_valeur, article, id_joueur, nom_joueur, meilleur_score, pourcentage, essais);

        });

    }

    function init_game(name_player_value, difficulty_valeur, article, id_joueur, nom_joueur, meilleur_score, pourcentage, essais) {
        // creation d'une balise "section" dans le document
        var section_game = $("<section id='game'></section>");
        // ajout de cette balise "section" dans l'element article
        article.append(section_game);

        var div_puzzle_pieces = $("<div id='puzzle-pieces'></div>");
        section_game.append(div_puzzle_pieces);

        /**
         * Les lignes qui suivent font plus ou moins la meme chose que les deux lignes au-dessus.
         * L'objectif est de créer une nouvelle arborescence HTML
         */

        var header_game = $("<header id='header_game'></header>");
        section_game.append(header_game);

        header_game.append("<h1>À vous de jouer "+name_player_value+" !<br>Votre nombre de coup influencera votre score !</h1>");

        var div_puzzle_game = $("<div class='puzzle'></div>");
        section_game.append(div_puzzle_game);

        div_puzzle_game.append("<p>ID : #"+id_joueur+" | Joueur : "+nom_joueur+" | Meilleur score : "+meilleur_score+"%</p>");

        var div_grid_puzzle_game = $("<div class='puzzle_grid "+tabGame[difficulty_valeur]["class"]+"'></div>");
        div_puzzle_game.append(div_grid_puzzle_game);

        // en fonction du nombre de cases défini ici : tabGame[difficulty_valeur]["nbr_grid"]. Creation de plusieurs div
        for (let i = 0; i < tabGame[difficulty_valeur]["nbr_grid"]; i++) {
            div_grid_puzzle_game.append("<div class='puzzle_grid_piece'></div>");
        }

        var div_buttons = $("<div class='buttons'></div>");
        $(".puzzle").append(div_buttons);

        //Un bouton qui vide le puzzle
        var div_retry = $("<div class='retry'></div>");
        div_buttons.append(div_retry);

        div_retry.append("<input type='button' name='retry' value='Vider' id='retry_btn' class='btn' />");

        //Un bouton qui valide le puzzle
        var div_valid_game = $("<div class='valid'></div>");
        div_buttons.append(div_valid_game);

        div_valid_game.append("<input type='button' name='valid' value='Valider' id='puzzle_validation_btn' class='btn' />");

        /* Début du code pour les pièces */

        for (let i = 0; i < tabGame[difficulty_valeur]["nbr_grid"]; i++) {
            var div_piece = $("<div class='piece' placed='0' draggable='true' id="+i+" style='background : center / contain no-repeat url("+tabGame[difficulty_valeur]["files"]+i+".png);'></div>");
            div_puzzle_pieces.append(div_piece);
        }


        // tri au hasard des pièces dans la liste
        $.fn.random = function() {
            $.each(this.get(), function(index, el) {
                var $el = $(el);
                var $find = $el.children();

                $find.sort(function() {
                    return 0.5 - Math.random();
                });

                $el.empty();
                $find.appendTo($el);
            });
        };

        $(div_puzzle_pieces).random();


        var $pieces = $('.piece');
        var $div_of_pieces = $('.puzzle_grid_piece');


        var $piece_drag = null;
        $pieces.on('dragstart', function(){

            $(this).attr("class", "piece");

            $piece_drag = this;

            setTimeout(() => {
                $(this).attr("class", "invisible");
            }, 0);

        });

        $pieces.on('dragend', function(){
            $(this).attr("class", "piece");
        });


        var index = null;
        for (const div_of_pieces_puzzle of $div_of_pieces) {

            $(div_of_pieces_puzzle).on('dragover', function(e) {
                e.preventDefault();
            });

            $(div_of_pieces_puzzle).on('dragenter', function(e) {
                e.preventDefault();
            });


            $(div_of_pieces_puzzle).on('drop', function() {

                index = $(div_of_pieces_puzzle).index();

                if ($($div_of_pieces)[index].children.length == 1) {
                    return false;
                }
                else {
                    this.append($piece_drag);
                    essais++;

                    if (index == $(div_of_pieces_puzzle.children[0]).attr("id")) {

                        $(div_of_pieces_puzzle.children[0]).attr("placed", 1);
                    }
                                        
                    if (index != $(div_of_pieces_puzzle.children[0]).attr("id")) {

                        $(div_of_pieces_puzzle.children[0]).attr("placed", 0);

                    }
                    
                    // calcul du nombre de tentatives placées dans la variable "pourcentage"
                    if (essais > tabGame[difficulty_valeur]["nbr_grid"]) {

                        if (pourcentage == 0) {
                            pourcentage = 0;
                        }
                        else {
                            pourcentage--;
                        }
                    }
                }
            });
        }

        // Listener pour le bouton contenu dans le section d'id game
        $('#puzzle_validation_btn').on('click', function(e){
            var total_placed = 0

            // parcour le 
            for (const pieces_puzzle of $pieces) {
                var placed = parseInt($(pieces_puzzle).attr("placed"));
                total_placed = total_placed + placed;
            }

            if (total_placed == tabGame[difficulty_valeur]["nbr_grid"]) {
                // si le score est un nouveau record on le retient et une requête AJAX sur score.php l'envoie en BDD
                if (pourcentage > meilleur_score) {
                    meilleur_score = pourcentage;
                    $.ajax({
                        type: 'POST',
                        url: 'assets/php/score.php',
                        data: {id_joueur: id_joueur, meilleur_score: JSON.stringify(meilleur_score)},
                        dataType: 'json'
                    }).always(function() {
                        clickVerifValider(e, name_player_value, pourcentage, difficulty_valeur, id_joueur, nom_joueur, meilleur_score);
                        return false;
                    });
                } else {
                    // fonction au moment où le bouton est cliqué
                    clickVerifValider(e, name_player_value, pourcentage, difficulty_valeur, id_joueur, nom_joueur, meilleur_score);
                    return false;
                }
            }
            else {
                $('#puzzle_validation_btn').blur();
                var error = $("<h1 id='error'>Le puzzle est imcomplet ou incorrect.</h1>");
                div_puzzle_game.append(error);
            }
        });

        // bonton re
        $('#retry_btn').on('click', function(e){            
            // appelle la fonction clickVerifRetry, et récupère les arguments cités
            clickVerifRetry(e, name_player_value, difficulty_valeur, id_joueur, nom_joueur, meilleur_score, pourcentage, essais);
            return false;
        });
    }

    function clickVerifRetry(e, name_player_value, difficulty_valeur, id_joueur, nom_joueur, meilleur_score, pourcentage, essais){
        e.preventDefault();

        // appel un element du DOM avec pour id article
        var article = $('#article');

        //On efface l'espace de jeu
        $('#game').remove();

        // création de la page de jeu
        init_game(name_player_value, difficulty_valeur, article, id_joueur, nom_joueur, meilleur_score, pourcentage, essais);
    }




    function clickVerifValider(e, name_player_value, pourcentage, difficulty_valeur, id_joueur, nom_joueur, meilleur_score){
        e.preventDefault();

        // /*********************************/
        // appel un element du DOM avec pour id article
        var article = $('#article');

        // supprime l'element du DOM d'id "game" avec la methode remove (soit toute la zone du formulaire de parametrage du jeu)
        $('#game').remove();
        // création de la page de victoire
        init_win(article, name_player_value, pourcentage, difficulty_valeur, id_joueur, nom_joueur, meilleur_score);

    }

    function init_win(article, name_player_value, pourcentage, difficulty_valeur, id_joueur, nom_joueur, meilleur_score){
        // creation d'une balise "section" dans le document
        var section_resultat = $("<section id='results'></section>");
        // ajout de cette balise "section" dans l'element article
        article.append(section_resultat);

        /**
         * Les lignes qui suivent font plus ou moins la meme chose que les deux lignes au-dessus.
         * L'objectif est de créer une nouvelle arborescence HTML
         */

        var header_win = $("<header id='header_win'></header>");
        section_resultat.append(header_win);

        header_win.append("<h1>Félicitations " +name_player_value+ " !<br>Votre score est de "+pourcentage+"%</h1>");

        var div_container = $("<div class='container'></div>");
        section_resultat.append(div_container);

        div_container.append("<p class = 'score'>Score : <span class = 'bold'>"+pourcentage+"%</span><br/>Meilleur score : <span class = 'bold'>"+meilleur_score+"% </span></p>");

        div_container.append("<h1 class = 'leaderboard_title'>Leaderboard</h1>")

        var leaderboard = $("<table class='leaderboard'><thead><tr><th>ID</th><th>Nom</th><th>Meilleur score</th></thead></table>");
        div_container.append(leaderboard);

        var leaderboard_body = $("<tbody></tbody>");
        leaderboard.append(leaderboard_body);

        // récupérer le leaderboard dans la BDD pour affichage par une requête AJAX sur leaderboard.php
        $.ajax({
            url: 'assets/php/leaderboard.php',
            dataType: 'json'
        }).done(function(data) {
            for (var i = 0; i < data.length; i++) {
                var leaderboard_row = $("<tr><td class='cell'>#"+data[i].id_joueur+"</td><td class='cell'>"+data[i].nom_joueur+"</td><td class='cell'>"+data[i].meilleur_score+"%</td></tr>");
                leaderboard_body.append(leaderboard_row);
            }
        });

        var div_buttons = $("<div class='buttons'></div>");
        div_container.append(div_buttons);

        var div_retry = $("<div class='retry'></div>");
        div_buttons.append(div_retry);

        div_retry.append("<input type='button' name='retry' value='Rejouer' id='retry_btn' class='btn' />");

        var div_menu = $("<div class='menu'></div>");
        div_buttons.append(div_menu);

        var a_link = $("<a href='index.php'></a>");
        div_menu.append(a_link);

        a_link.append("<input type='button' name='valid' value='Accueil' id='menu_btn' class='btn'/>");

        // Listener pour le bouton contenu dans le section d'id results
        $('#retry_btn').on('click', function(e){
            // fonction au moment où le formulaire est bouton
            clickVerifRejouer(e, name_player_value, difficulty_valeur, id_joueur, nom_joueur, meilleur_score);
            return false;
        });
    }

    function clickVerifRejouer(e, name_player_value, difficulty_valeur, id_joueur, nom_joueur, meilleur_score){
        e.preventDefault();

        var pourcentage = 100;
        var essais = 0;

        // appel un element du DOM avec pour id article
        var article = $('#article');

        // supprime l'element du DOM d'id "results" avec la methode remove (soit toute la zone du formulaire de parametrage du jeu)
        $('#results').remove();

        // création de la page de jeu
        init_game(name_player_value, difficulty_valeur, article, id_joueur, nom_joueur, meilleur_score, pourcentage, essais);
    }

});

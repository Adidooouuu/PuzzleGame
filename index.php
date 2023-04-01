<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- les auteurs de la page -->
    <meta name="author" content="Jean Baradat, Salomé Cliquennois, Lucie Dumas, Adélaïde Machon">
    <!-- Une petite description du site -->
    <meta name="description" content="Mini-jeu de puzzle">
    <link rel="icon" href="assets\img\favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <title>Puzzle Game</title>
  </head>
  <body>
    <main>
      <article id="article">

        <section id="home">
          <header id="header_home">
            <img class="logo" id="logo" src="assets\img\puzzle\logo.png" alt="Puzzle Game">
          </header>
          <form class="id_player">
            <label for="name_player" class="id_player_form_label">Nom du joueur</label>
            <input id="name_player" type="text" name="name_player" value="" placeholder="Votre nom">
            <p id="error_msg"></p>

            <label for="difficulty" class="id_player_form_label">Difficulté</label>
            <select name="difficulty" id="difficulty">
              <option value="facile" selected="selected">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>

            <div class="start">
              <input type="submit" value="Jouer" id="id_player_form_submit" class="btn">
            </div>
          </form>
        </section>

          <!-- <section id="results"></section> -->
      </article>

      <footer>

      </footer>
    </main>

    <aside>

    </aside>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="assets/js/script.js"></script>
  </body>
</html>

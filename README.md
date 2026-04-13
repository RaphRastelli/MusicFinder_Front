# MusicianFinder_Front

Voici la partie frontend de la Web application **MusicianFinder**, travail de fin de formation _codeur-développeur_ de Bruxelles Formation. Il a été présenté le 7 avril 2026.

Il y a un repository [***MusicianFinder_Back***](https://github.com/RaphRastelli/MusicianFinder_Back) pour le backend.

## Principe de l'application :

**MusicianFinder** est une application répertoire. Elle permet de rechercher et mettre en contact des musiciens et musiciennes (inscrit•es) ou d’en chercher par des visiteurs non-inscrits (par un réalisateur de film par exemple).

Une fois, une recherche effectuée, une liste de musiciennes et musiciens correspondant aux critères est affichée avec un bouton pour accéder à chaque profil. La liste est triée suivant un algorithme par point. Plus un profil obtient de points, plus il est placé au sommet de la liste.

Chaque musicien ou musicienne inscrit•e peut se connecter pour accéder ou modifier son profil quand il ou elle le veut.

----
#### Work in progress :
Le projet est un _Minimum Viable Project_ au moment de sa présentation mais devrait encore être amélioré sur plusieurs points (UX/UI, déboguage...) et pourrait/devrait être complété des fonctions de messagerie et e-mail. 
Il n'y a pas non plus de tests unitaires...
C'est un _work in progress_.

## Stack
* Frontend :
    * Vite
    * React.js
    * React-router
    * JavaScript

* Backend :
    * MusicianFinder_back sur VS 2026,
    * C# / .NET 10 avec Entity Framework Core

## Base de données relationnelle
- MS SQL Server

## Structures
- Structure Backend : API REST, modèle « Clean architecture » avec couches Domain/ApplicationCore/Infrastructure et Presentation (API).
- Structure Frontend : React components, routing, state management.
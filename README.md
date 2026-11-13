# Kevik — Formations en improvisation

Site web vitrine de **Kevik** (Keven Perron), improvisateur et comédien.
Thème étoilé — « Trouvez l'étoile en vous ».

## Structure

- `index.html` — la page (une seule page avec ancres : Accueil, Qui suis-je ?, Mon approche, Formations, Contact)
- `styles.css` — le style (noir et or, adapté ordinateur et téléphone)
- `script.js` — ciel étoilé animé, menu mobile, animations au défilement, copie du courriel
- `images/` — photos

Aucune dépendance ni étape de compilation : c'est du HTML/CSS/JS statique.

## Réservations

Le bouton « Me contacter » ouvre un courriel prérempli vers **improkevik@gmail.com**.

## Voir le site en local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

puis aller sur http://localhost:8000.

## Mettre en ligne (GitHub Pages)

1. Dans le dépôt GitHub : **Settings → Pages**.
2. Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site sera disponible à `https://<utilisateur>.github.io/site-web-kevik/`.

## Remplacer les photos

Les photos actuelles ont été extraites de captures d'écran de l'ancien site Canva.
Pour une meilleure qualité, remplacer les fichiers dans `images/` par les originaux
en gardant les mêmes noms de fichiers.

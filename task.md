 # Botanica — réalisation

Plan approuvé : boutique de démonstration en français, web responsive, style vidéo crème et vert.
Nom choisi : Botanica, aucun actif de marque fourni.
Architecture : frontend React dans packages/web ; catalogue statique, panier/favoris/commandes simulées stockés sur cet appareil. Aucun paiement, compte réel ou envoi email.
Pages : accueil, boutique avec filtres/recherche/tri, fiches produits, favoris, panier/commande, journal/articles, contact, informations légales.
Design : serif éditoriale + Poppins, crème/vert forêt/or, photos beauté réelles issues de recherche.
Terminé : actifs photo locaux, toutes les pages et sections, recherche/tri/filtres, favoris, panier avec quantités, promotion BOTANICA10, commande fictive, formulaires newsletter/contact locaux, articles, FAQ, informations légales.
Vérifié : build réussi, lint sans erreur ; tests Playwright Chrome desktop/mobile passés pour images, recherche au clavier, catégories, tri, favoris, panier persistant, code promo, commande, journal, contact, newsletter, FAQ, menu mobile. Aucun débordement mobile ni erreur JavaScript.
Service : tmux botanica-web, bun run dev, port géré 4200.
À faire : livraison de l’aperçu web. Limites assumées : catalogue fictif, aucune transaction/expédition ni envoi e-mail, données locales.
# Formats de Questions

Ce document décrit les différents types de questions supportés par Text2Quiz.

## Types de Questions Disponibles

### 1. Questions Vrai/Faux (VF)
```
VF || Question text || V || Explication || Thèmes
```

**Exemple:**
```
VF || La consommation finale inclut les services gratuits fournis par l'État || F || Les services gratuits publics ne sont pas inclus dans la consommation finale
```

### 2. Questions à Réponse Unique (QR)
```
QR || Question text || V:Bonne réponse|Mauvaise 1|Mauvaise 2 || Explication || Thèmes
```

**Exemple:**
```
QR || Au sens strict, la consommation correspond à : || V:La destruction de biens ou services par l'usage|L'accumulation de patrimoine|L'investissement net
```

### 3. Questions à Choix Multiples (QCM)
```
QCM || Question text || V:Bonne 1|V:Bonne 2|Mauvaise 1 || Explication || Thèmes
```

**Exemple:**
```
QCM || La consommation d'un pays inclut : || V:Les biens et services marchands achetés|V:Les services non marchands individualisables|Les exportations nettes
```

### 4. Questions Drag & Drop (DragMatch) ✨ NOUVEAU
Le type DragMatch permet de créer des exercices d'association par glisser-déposer. Idéal pour associer des concepts avec leurs définitions, des auteurs avec leurs théories, des dates avec des événements, etc.

```
DragMatch || Question text || Item1:Match1, Item2:Match2, Item3:Match3 || Explication || Thèmes
```

**Exemples:**

**Associer des auteurs avec leurs théories:**
```
DragMatch || Associe les auteurs avec leurs théories || Keynes:Fonction de consommation, Friedman:Revenu permanent, Modigliani:Cycle de vie, Duesenberry:Effet de cliquet
```

**Associer des dates avec des événements:**
```
DragMatch || Associe les dates avec les événements || 1929:Grande Dépression, 1945:Fin de la Seconde Guerre mondiale, 1973:Choc pétrolier, 2008:Crise financière
```

**Associer des concepts économiques:**
```
DragMatch || Associe les concepts économiques || PIB:Produit Intérieur Brut, PNB:Produit National Brut, RNB:Revenu National Brut, Yd:Revenu disponible
```

#### Fonctionnalités du DragMatch:
- 🖱️ Glisser-déposer intuitif depuis la zone de réponses vers les cases
- 👁️ Retour visuel pendant le glissement
- ✅ Validation automatique quand toutes les cases sont remplies
- 📊 Affichage des bonnes réponses en cas d'erreur (mode Entraînement)
- 🎯 Compatible avec les modes Entraînement et Examen

## Format Général

Toutes les questions suivent le format général avec colonnes séparées par `||`:

```
TYPE || Question || Réponses || Explication || Thèmes
```

### Thèmes
Les thèmes peuvent être définis de plusieurs manières:

1. **Colonne 5 (5e colonne):**
```
QR || Question || Réponses || Explication || Theme1, Theme2
```

2. **Tags inline dans la question:**
```
QR || Ma question sur [#Theme1] et [#Theme2] || Réponses || Explication
```

3. **Section globale:**
```
@themes: Theme1, Theme2
QR || Question 1 || Réponses || Explication
QR || Question 2 || Réponses || Explication
```

## Conseils d'Utilisation

### Pour DragMatch:
- Utiliser des paires claires et sans ambiguïté
- Limiter à 4-8 paires pour une meilleure lisibilité
- Les items (partie gauche) doivent être courts et distincts
- Les matches (partie droite) peuvent être plus descriptifs

### Général:
- Une question par ligne
- Les commentaires commencent par `#` ou `//`
- Les lignes vides sont ignorées
- Utiliser des explications concises mais informatives

# Guide des Modes de Quiz

Text2QuizVIP propose 5 modes différents pour enrichir l'expérience d'apprentissage :

## 1. Mode Entraînement
- **Correction immédiate** : Après chaque réponse
- **Explications** : Affiche l'explication après validation
- **Rattrapage** : Les questions fausses sont reposées jusqu'à 100% de réussite

## 2. Mode Examen
- **Correction différée** : À la fin de toutes les questions
- **Score global** : Affiche le résultat final
- **Rattrapage** : Les questions fausses sont reposées

## 3. Mode Contre-la-montre ⏱️
- **Timer** : 60 secondes pour répondre au maximum de questions
- **Affichage du temps** : Timer visible en permanence
- **Arrêt automatique** : Le quiz s'arrête quand le temps est écoulé
- **Score final** : Nombre de bonnes réponses dans le temps imparti

## 4. Mode Histoire interactive 🎭
- **Scénario narratif** : Les questions sont présentées comme des chapitres d'histoire
- **Feedback contextuel** : 
  - "L'histoire commence..." au début
  - "Bon choix ! L'histoire continue..." si bonne réponse
  - "Pas tout à fait... L'histoire prend un autre tournant..." si mauvaise réponse
- **Chemin parcouru** : Affiche le parcours (Q1 → Q3 → Q5...) à la fin

## 5. Mode Flashcards 📚
- **Apprentissage progressif** : Une carte à la fois
- **Révélation de réponse** : Cliquer pour afficher la réponse
- **Navigation** :
  - Bouton "Suivante" pour avancer
  - Bouton "Précédente" pour revenir (si pas la première carte)
- **Marquage** :
  - ✅ Maîtrisée : Marquer comme acquise
  - 🔄 À revoir : Marquer pour révision ultérieure
- **Progression** : Affiche "Carte X / Total"
- **Bilan final** : Nombre de cartes maîtrisées vs à revoir

## Amélioration DragMatch
Les questions de type DragMatch permettent maintenant de **modifier les réponses même après validation** dans le mode Entraînement, permettant de corriger avant de passer à la question suivante.

---

## Comment ajouter un nouveau mode

### 1. Mettre à jour les types (`src/types.ts`)
```typescript
export type Mode = 'entrainement' | 'examen' | 'votre-nouveau-mode';
```

### 2. Ajouter l'option dans l'interface (`index.html`)
```html
<label><input type="radio" name="mode" value="votre-nouveau-mode"> Votre Mode</label>
```

### 3. Ajouter les propriétés d'état nécessaires (`src/main.ts`)
```typescript
type State = {
  // ... propriétés existantes
  votreModeProp?: any; // propriétés spécifiques à votre mode
};
```

### 4. Initialiser l'état dans `resetRoundState()`
```typescript
if (state.mode === 'votre-nouveau-mode') {
  state.votreModeProp = valeurInitiale;
}
```

### 5. Créer la fonction de rendu
```typescript
function renderVotreNouveauMode() {
  // Logique de rendu
  els.root.innerHTML = `...`;
  // Event listeners
}
```

### 6. Dispatcher dans `render()`
```typescript
function render() {
  if (state.mode === 'votre-nouveau-mode') {
    return renderVotreNouveauMode();
  }
  // ... reste du code
}
```

### 7. Ajouter le label dans `getModeLabel()`
```typescript
case 'votre-nouveau-mode': return 'Votre Mode';
```

### 8. Gérer la fin dans `handleEndOfRound()` si nécessaire
```typescript
if (state.mode === 'votre-nouveau-mode') {
  // Logique spécifique de fin
  return renderResultats(head);
}
```

## Conventions de code
- Utiliser des fonctions nommées pour la clarté
- Échapper le HTML avec `escapeHtml()` et `escapeAttr()`
- Monter les event listeners après le rendu
- Appeler `mountFloatingNext()` pour gérer le bouton flottant
- Utiliser `state.index` pour la question courante
- Incrémenter `state.index` pour passer à la question suivante

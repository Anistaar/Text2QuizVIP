(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}})();const Ce="||",Ve="|",H=/^V:/i;function x(n){return(n??"").replace(/\u00A0/g," ").trim()}function xe(n){return n.split(Ce).map(e=>e.trim())}function E(n){return Array.from(new Set(n))}function L(n){const e=x(n);return e?e.split(/[;,]/).map(t=>t.trim()).filter(Boolean):[]}function A(n){const e=[],t=/\[#([^\]]+)\]/g;let i;for(;i=t.exec(n);){const s=x(i[1]);s&&e.push(s)}return e}function z(n){return x(n).split(Ve).map(e=>e.trim()).filter(Boolean).map(e=>{const t=H.test(e);return{text:e.replace(H,"").trim(),correct:t}})}function ae(n){const e=[];if(!n)return e;const t=n.split(/\r?\n/).map(s=>s.trim()).filter(s=>s.length>0&&!s.startsWith("#")&&!/^\/\//.test(s));let i=[];for(const s of t){const l=s.match(/^@themes?\s*:\s*(.+)$/i);if(l){i=L(l[1]);continue}const a=s.match(/^@add-?theme\s*:\s*(.+)$/i);if(a){i=E([...i,...L(a[1])]);continue}const o=xe(s),d=x(o[0]).toUpperCase();if(d==="VF"&&o.length>=3){const u=x(o[1]),f=x(o[2]).toUpperCase()==="V"?"V":"F",C=x(o[3]),p=E([...i,...L(o[4]),...A(u)]);e.push({type:"VF",question:u,vf:f,explication:C,topics:p});continue}if(d==="QR"&&o.length>=3){const u=x(o[1]),f=z(o[2]),C=x(o[3]),p=E([...i,...L(o[4]),...A(u)]),b=f.filter(m=>m.correct).length;if(b===0)continue;if(b>1){let m=!1;for(const q of f)q.correct&&!m?m=!0:q.correct=!1}e.push({type:"QR",question:u,answers:f,explication:C,topics:p});continue}if(d==="QCM"&&o.length>=3){const u=x(o[1]),f=z(o[2]),C=x(o[3]),p=E([...i,...L(o[4]),...A(u)]);if(f.every(b=>!b.correct))continue;e.push({type:"QCM",question:u,answers:f,explication:C,topics:p});continue}}return e}function V(n,e){if(n.type==="VF")return e.value===n.vf;if(n.type==="QR"){const t=e.value??"",i=n.answers.find(s=>s.correct);return!!i&&t===(i.text??"")}if(n.type==="QCM"){const t=new Set(e.values??[]),i=n.answers.filter(o=>o.correct).map(o=>o.text),s=n.answers.filter(o=>!o.correct).map(o=>o.text),l=i.every(o=>t.has(o)),a=s.every(o=>!t.has(o));return t.size>0&&l&&a}return!1}function re(n){var e;return n.type==="VF"?n.vf==="V"?"Vrai":"Faux":n.type==="QR"?((e=n.answers.find(t=>t.correct))==null?void 0:e.text)??"":n.type==="QCM"?n.answers.filter(t=>t.correct).map(t=>t.text).join(" | "):""}function Me(n){return n.type==="VF"||n.type==="QR"?1:n.type==="QCM"?n.answers.filter(e=>e.correct).length:0}function S(n){for(let e=n.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n}function qe(n){return n.replace(/\w\S*/g,e=>e.charAt(0).toUpperCase()+e.slice(1))}function G(n){return n.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function j(n){let e=`${n.type}|${G(n.question)}`;if(n.type==="VF"&&n.vf&&(e+=`|${n.vf}`),(n.type==="QCM"||n.type==="QR")&&n.answers){const t=n.answers.map(i=>`${i.correct?"1":"0"}:${G(i.text)}`).sort().join(",");e+=`|${t}`}return e}function _(n){const e=new Set,t=[];for(const i of n){const s=j(i);e.has(s)||(e.add(s),t.push(i))}return t}const Qe=`# CH1 : La Consommation - Banque de questions Text2Quiz (avec explications, corrections)

### Définitions et concepts de base
QCM || En macro, la consommation inclut : || V:Biens et services achetés|V:Biens autoconsommés|Services publics gratuits || Explication : Sont inclus achats des ménages et biens autoconsommés ; les services publics totalement gratuits n’entrent pas dans la consommation finale.
QR  || Au sens strict, la consommation correspond à : || V:Destruction par l’usage pour satisfaire un besoin|Accumulation de patrimoine|Investissement net|Production publique || Explication : Sens strict = usage qui détruit le bien/épuisement du service pour satisfaire directement un besoin.
VF  || La consommation élargie inclut les services gratuits publics (enseignement, santé). || V || Explication : En consommation élargie, on ajoute les services publics gratuits.

### Revenus et équilibres
QRC || Donne la formule du revenu disponible brut (Yd). || Revenu primaire + prestations sociales - prélèvements obligatoires|Revenu primaire + transferts nets - impôts || Explication : Yd = revenus primaires + transferts reçus – prélèvements obligatoires.
Trous || Yd se répartit entre {{V:consommation finale|investissement}} et {{V:épargne|dette}}. || Explication : Emploi du revenu disponible : C + S.
Flashcard || Équation d’emploi-ressource (ménages) || Yd = C + S || Explication : Le revenu disponible brut finance la consommation et l’épargne.

### Typologies de consommation
QCM || Par durabilité, on distingue : || V:Biens durables|V:Biens semi‑durables|V:Biens non durables|Services collectifs gratuits || Explication : Trois catégories de biens selon la durée d’usage ; les services collectifs gratuits ne sont pas une catégorie de durabilité.
QR  || Le coefficient budgétaire b_i vaut : || V:(C_i/C) x 100|C/C_i x 100|C_i - C|C - C_i || Explication : Part de la dépense i dans la consommation totale.
Flashcard || Loi d’Engel (1857) || Part alimentaire ↓ quand revenu ↑ ; logement/habillement suivent, autres postes ↑ plus vite. || Explication : Structure de consommation se déforme avec le revenu.

### Élasticités et propensions
Trous || La PmC mesure {{V:la part du revenu supplémentaire consacrée à la consommation|la part totale du revenu}}. || Explication : PmC = ΔC/ΔYd ; fraction de revenu additionnel consommée.
QR  || La PMC est généralement : || V:décrécroissante avec le revenu|constante|croissante|indépendante || Explication : À mesure que le revenu ↑, la part moyenne consacrée à C ↓.
VF  || Selon Keynes, C augmente moins vite que Yd. || V || Explication : Loi psychologique fondamentale.

### Théories (Keynes et extensions)
QCM || Formes compatibles avec Keynes : || V:Linéaire|V:Affine|V:Concave|Exponentielle || Explication : Trois formes compatibles ; l’exponentielle ne l’est pas.
QR  || Dans C = cYd + C0, C0 est : || V:Consommation incompressible|Investissement autonome|Revenu permanent|Épargne nette || Explication : C0 = consommation minimale au revenu nul.
Flashcard || Effet de cliquet (Duesenberry, 1948) || C influencée par le plus haut revenu passé. || Explication : Habitudes freinent la baisse de C en récession.
Flashcard || Inertie (Brown, 1952) || C dépend de C_{t-1}. || Explication : Lissage via habitudes récentes.
Flashcard || Effet de démonstration (Duesenberry, 1949) || C dépend du revenu relatif. || Explication : Imitation/comparaison sociale.

### Approches intertemporelles
Flashcard || Cycle de vie (Modigliani‑Brumberg, 1954) || Lissage de C ; patrimoine en “bosse”. || Explication : Épargne en activité, désépargne à la retraite.
Flashcard || Revenu permanent (Friedman, 1957) || C dépend du revenu permanent anticipé. || Explication : Fondé sur richesse/anticipations, pas seul revenu courant.
Trous || Yp est {{V:la somme consommable sans entamer le capital|le revenu courant}}. || Explication : Yp = consommation soutenable à long terme.

### Déterminants de l’épargne
QCM || Déterminants à court terme : || V:Pouvoir d’achat|V:Chômage|V:Inflation|V:Taux d’intérêt || Explication : Pouvoir d’achat ↓ → on puise dans l’épargne ; incertitude (chômage) ↑ → épargne de précaution ; inflation et i influencent S.
QCM || Déterminants à long terme : || V:Vieillissement|V:Système de retraite|Exportations nettes|Progrès technique || Explication : Vieillissement et régimes de retraite modifient le profil d’épargne agrégé.
VF  || Inflation élevée → à court terme, “fuite devant la monnaie”. || V || Explication : On consomme vite pour éviter l’érosion de valeur.
VF  || À long terme, inflation peut ↑ l’épargne (effet d’encaisses réelles). || V || Explication : On épargne pour reconstituer la valeur réelle des encaisses.

### Vérifications empiriques et débats
QCM || Résultats de Kuznets (séries longues) : || V:PmC ≈ PMC|V:Relation proche de linéaire|PMC croît avec le revenu|Aucune relation C‑Yd || Explication : Sur longue période US, PMC ≈ PmC, contredisant la version affine stricte.
QR  || Études en coupe instantanée montrent : || V:C augmente moins que proportionnellement au revenu|C proportionnelle|C indépendante|C baisse avec le revenu || Explication : Confirme intuition keynésienne au niveau micro.

### Réflexion (style examen)
QR  || Que devient la part alimentaire quand le revenu ↑ (Engel) ? || V:Elle diminue|Elle reste constante|Elle augmente || Explication : Effet de substitution/qualité ; part budgétaire ↓.
QCM || Keynes vs Kuznets : || V:Keynes → PMC décroissante|V:Kuznets → PmC ≈ PMC|Keynes → strictement proportionnelle|Kuznets → PmC croissante || Explication : Keynes = lois comportementales ; Kuznets = constats statistiques.
TrousRC || Deux limites de la fonction keynésienne : || Sous‑estimation d’après‑guerre|Contradictions séries courtes/longues || Explication : Les données post‑guerre et longues séries ne collent pas à la forme simple.
Flashcard || Différence PmC vs PMC || PmC = ΔC/ΔYd ; PMC = C/Yd. || Explication : Marginale vs moyenne.
`,ye=`# Examen Macroéconomie - Version fidèle (Text2Quiz avec explications)

QCM || Le PIB nominal est de 1500 unités l’année n, l’inflation sur l’année n est de 50% le PIB réel est ? || 1235|2536|3000|V:1000 || Explication : 1500 / 1,5 = 1000.

QCM || Pour déflater un PIB nominal, il faut : || Diviser par le PIB en valeur x100|Diviser par le PIB en volume x100|V:Diviser par l’indice des prix x100|Aucune de ces réponses n’est juste || Explication : Déflater = corriger de l’inflation avec l’indice des prix.

QCM || Une grandeur en volume est égale : || V:Grandeur réelle sur indice des prix x100|Grandeur en valeur sur grandeur en volume x100|Grandeur en valeur sur indice des prix x100|Aucune de ces réponses n’est juste || Explication : Volume = valeur ÷ indice des prix ×100.

QCM || c dans la fonction de consommation keynésienne représente : || La propension moyenne à consommer|La propension moyenne à épargner|V:La propension marginale à consommer|Aucune de ces réponses n’est juste || Explication : c est la pente de la fonction C = C0 + cYd.

QCM || Dans une économie nationale la PMC s’établit respectivement à 0,50 et 0,80 le revenu national passe de 100 unités à 200 unités. Quelle sera la PmC ? || 0,18|0,20|V:0,11|Aucune de ces réponses n’est juste || Explication : PmC = ΔC/ΔY.

QCM || Chez Keynes l’épargne est : || V:Un résidu|Un surplus|Partie du revenu consommée|Aucune de ces réponses n’est juste || Explication : Épargne = Yd – C.

QCM || L’intersection OG et DG déterminent : || Le prix d’équilibre|L’investissement d’équilibre|V:Ye d’équilibre|Aucune de ces réponses n’est juste || Explication : Croisement OG et DG = revenu d’équilibre.

QCM || Un taux de variation de –0,2% correspond : || 99|V:99,8|199|Aucune de ces réponses n’est juste || Explication : –0,2% → indice = 100 – 0,2 = 99,8.

QCM || Chez KEYNES la consommation : || Augmente plus vite que le revenu|V:Augmente moins vite que le revenu|Augmente en même temps que le revenu|Aucune de ces réponses n’est juste || Explication : Loi psychologique fondamentale.

QCM || Une propension moyenne à consommer supérieure à 1 signifie : || Le revenu est supérieur à la consommation|V:La consommation est supérieure au revenu|Le revenu augmente proportionnellement à la consommation|Aucune de ces réponses n’est juste || Explication : Si PMC > 1 → les ménages consomment plus que leur revenu.

QCM || Le PIB en volume correspond au : || PIB nominal|V:PIB réel|PIB à prix courant|Aucune de ces réponses n’est juste || Explication : PIB en volume = PIB réel = corrigé de l’inflation.

QCM || La théorie keynésienne de la consommation est vérifiée : || A long terme|A moyen terme|V:A court terme|Aucune de ces réponses n’est juste || Explication : Confirmée empiriquement sur courtes périodes.

QCM || Un phénomène qui augmente de 30% la première année et qui augmente de 30% la deuxième année et baisse de 30% la troisième année ; augmente de combien au total ? || 30%|30,3%|V:18,3%|Aucune de ces réponses n’est juste || Explication : Variation cumulée = (1,3 × 1,3 × 0,7 – 1) = 0,183 soit 18,3%.

QCM || Qu’étudie la macroéconomie : || La production globale|V:Le revenu global|Le consommateur|Une entreprise || Explication : La macroéconomie analyse les agrégats globaux.

QCM || Une grandeur économique mesurée en valeur est synonyme : || V:De grandeur en valeur nominale|De grandeur en valeur à prix courant|De grandeur en valeur réelle|De grandeur en valeur à prix constant || Explication : Mesure aux prix courants.

QCM || La PMC plus la PME doit être égale : || V:A 1|Inférieur à 1|Supérieur à 1|Aucune de ces réponses n’est juste || Explication : PMC + PME = 1.

QCM || Soit une économie fermée dans une optique keynésienne nous avons Co =100 milliards d’euros, c=0,75 et Io=10 milliards d’euros. Calculer le revenu national d’équilibre Ye, cochez la bonne réponse. || 500 milliards|800 milliards|V:440 milliards|Aucune de ces réponses n’est juste || Explication : Ye = (Co+I)/(1–c) = 110/0,25 = 440.

QCM || Une grandeur qui double est à : || 100|400|V:200|Aucune de ces réponses n’est juste || Explication : Base 100 → doublement = 200.

QCM || La fonction de consommation est : || V:Une relation croissante à court terme entre le revenu (Y) et la consommation (C)|Une relation décroissante à court terme entre le revenu (Y) et la consommation (C)|Une relation proportionnelle à court terme entre le revenu (Y) et la consommation (C)|Aucune de ces réponses n’est juste || Explication : C croît avec Y mais moins vite.

QCM || La loi psychologique fondamentale montre : || A mesure que le revenu augmente, une part décroissante du revenu est épargnée|V:A mesure que le revenu augmente une part croissante du revenu est épargnée|A mesure que le revenu augmente une part proportionnelle du revenu est épargnée|Aucune de ces réponses n’est juste || Explication : La consommation croît moins vite que le revenu, donc l’épargne augmente.
`,Le=`### Version examen réaliste
QCM || Pour Malthus, la population croît : || V:en progression géométrique|en progression arithmétique|au rythme de la production|au rythme des innovations
QCM || Pour Malthus, les subsistances croissent : || en progression géométrique|V:en progression arithmétique|au même rythme que la population|de façon illimitée
QCM || La loi de population de Malthus implique : || un enrichissement continu des travailleurs|V:une tendance à la misère si la population augmente trop vite|une hausse des profits pour tous|une disparition de la rente
QCM || La « triple paupérisation » touche : || uniquement les capitalistes|uniquement les propriétaires terriens|V:l’ensemble de la population, surtout les plus pauvres|aucune catégorie
QCM || Malthus critique l’optimisme de Smith car : || V:la croissance démographique peut annuler les gains économiques|la main invisible supprime les crises|la concurrence empêche la misère|l’État intervient trop

### Version complète
VF || Pour Malthus, la population augmente en progression géométrique tandis que les subsistances augmentent en progression arithmétique. || V || 2, 4, 8 vs 2, 4, 6, 8.
VF || La croissance démographique entraîne un enrichissement global durable. || F || Elle conduit à la pauvreté si non contrôlée.
VF || La triple paupérisation concerne les travailleurs, les capitalistes et les propriétaires fonciers. || V || Tout le monde en souffre mais surtout les plus pauvres.
VF || Malthus pense que la croissance profite toujours aux ouvriers. || F || Elle fait baisser les salaires réels et accroît la misère.
VF || Pour Malthus, la population doit être limitée par des freins (moraux ou naturels). || V || Contrôle des naissances, famines, guerres, maladies.
VF || La loi de population de Malthus s’oppose à l’idée de Jean Bodin « il n’est de richesse que d’hommes ». || V || Pour Malthus, trop d’hommes = misère.

QCM || La loi de population de Malthus énonce : || V:la population croît plus vite que les ressources|les ressources croissent plus vite que la population|les deux croissent au même rythme|la rareté n’existe pas
QCM || Les « freins positifs » chez Malthus sont : || V:famines, épidémies, guerres|contrôle des naissances volontaire|les progrès techniques|la migration
QCM || Les « freins préventifs » chez Malthus sont : || V:contrôle volontaire de la natalité, abstinence, mariage tardif|épidémies|guerres|famine
QCM || La triple paupérisation se traduit par : || V:hausse prix agricoles + baisse salaires réels + baisse production par tête|hausse salaires réels + hausse profits + baisse rentes|baisse chômage + hausse salaires nominaux + hausse productivité|redistribution équitable
QCM || Malthus propose comme solution : || V:freins à la croissance démographique|hausse des salaires|suppression de la rente|intervention massive de l’État

### Questions tombées en examen (2022, 2023, 2024)
`,Se=`### Version examen réaliste
QCM || Chez Marshall, l’équilibre est : || V:un équilibre partiel sur un seul marché|un équilibre général sur tous les marchés|un optimum de Pareto|une politique budgétaire
QCM || L’élasticité de la demande mesure : || V:la sensibilité de la quantité demandée à une variation du prix|la quantité produite par travailleur|la rigidité de l’offre|la variation des coûts fixes
QCM || Selon Marshall, au court terme l’offre est : || V:rigide ou peu élastique|totalement flexible|indépendante de la demande|toujours croissante
QCM || Selon Marshall, au long terme l’offre est : || V:plus élastique|parfaitement inélastique|totalement fixe|indépendante des coûts de production
QCM || Marshall combine : || V:l’utilité (demande) et les coûts de production (offre)|la rente et le profit|le salaire et la monnaie|le capital et la productivité

### Version complète
VF || Pour Marshall, l’équilibre est partiel et non général. || V || Analyse marché par marché.
VF || Marshall a introduit la notion d’élasticité de la demande. || V || Mesure la sensibilité de la demande aux prix.
VF || L’offre est identique à court terme et à long terme. || F || Court terme = rigide, long terme = plus élastique.
VF || Marshall combine la demande (utilité) et l’offre (coût de production). || V || Prix d’équilibre = intersection O/D.
VF || L’élasticité est calculée comme variation % de la demande / variation % du prix. || V || Élasticité-prix de la demande.

QCM || La loi de l’offre et de la demande chez Marshall aboutit à : || V:un prix d’équilibre à l’intersection des courbes|un prix fixé par l’État|une rente différentielle|un salaire naturel
QCM || L’élasticité forte (>1) signifie : || V:demande très sensible aux variations de prix|demande rigide|demande indépendante|offre verticale
QCM || Une élasticité nulle signifie : || V:demande parfaitement rigide (quelle que soit la variation du prix)|demande infinie|prix fixe par l’État|offre parfaitement élastique
QCM || Marshall distingue deux horizons : || V:court terme (offre rigide) et long terme (offre plus élastique)|court terme (offre souple) et long terme (offre rigide)|uniquement le court terme|uniquement le long terme
QCM || La contribution de Marshall à la microéconomie est : || V:l’équilibre partiel et la notion d’élasticité|la valeur-travail|l’aliénation|l’équilibre général

### Questions tombées en examen (2022, 2023, 2024)
QCM || Chez Marshall, l’équilibre est : || équilibre général sur tous les marchés|équilibre budgétaire|V:équilibre partiel sur un seul marché|optimum de Pareto
QCM || L’élasticité de la demande mesure : || la variation du revenu|V:la sensibilité de la quantité demandée à une variation du prix|la production marginale|les coûts fixes
`,Fe=`### Version examen réaliste
QCM || Pour Karl Marx, la valeur d’un bien est déterminée par : || sa rareté|son utilité marginale|V:la quantité de travail socialement nécessaire|le profit attendu
QCM || Chez Marx, le salaire rémunère : || le travail effectué|la productivité marginale du travail|la rente foncière|V:la force de travail
QCM || La plus-value correspond à : || V:la différence entre la valeur créée par la force de travail et la valeur de la force de travail|la rémunération de la terre|un impôt sur la production|un gain de productivité neutre
QCM || La distinction travail concret / travail abstrait signifie : || que tout travail est identique|que seule l’utilité compte|V:travaux différents sont ramenés à du travail homogène (abstrait)|que seuls les services créent de la valeur
QCM || La « baisse tendancielle du taux de profit » s’explique par : || la hausse des salaires nominaux|V:la hausse de la composition organique du capital (C/V)|la baisse de la plus-value|la disparition de la concurrence
QCM || L’armée industrielle de réserve désigne : || V:le chômage structurel qui pèse sur les salaires|les travailleurs du secteur public|les militaires en reconversion|les apprentis non payés
QCM || La plus-value absolue est obtenue par : || V:l’allongement de la durée du travail à productivité donnée|l’introduction de machines|la baisse des salaires nominaux|la réduction du temps de travail
QCM || La plus-value relative est obtenue par : || l’allongement de la journée|V:des gains de productivité réduisant le travail nécessaire|la hausse des prix|la baisse de la demande
QCM || Le cycle du capital marchand (schéma simple) chez Marx est : || V:A–M–A′ (Argent–Marchandise–Argent augmenté)|M–A–M (économie marchande simple)|A–A′ sans production|M–M′ sans argent
QCM || Le capital constant correspond à : || V:les moyens de production (machines, matières)|les salaires|les profits|les impôts

### Version complète
VF || Pour Marx, la valeur d’une marchandise repose sur le travail abstrait socialement nécessaire. || V || Travail abstrait = homogénéisation des travaux concrets.
VF || Valeur d’usage et valeur d’échange sont identiques chez Marx. || F || Valeur d’usage = utilité ; valeur d’échange = expression de la valeur.
VF || La force de travail est une marchandise dont la valeur dépend du coût de reproduction. || V || Salaire = valeur des biens nécessaires à la reproduction du travailleur.
VF || Le salaire rémunère le travail fourni. || F || Il rémunère la force de travail ; la valeur créée excède le salaire → plus-value.
VF || La plus-value peut être absolue (durée du travail) ou relative (productivité). || V || Deux voies d’accroissement de l’exploitation.
VF || Le capital constant (C) transfère sa valeur au produit ; le capital variable (V) crée de la valeur nouvelle. || V || Seul V produit de la plus-value.
VF || Le taux de plus-value est défini par p′ = PL/V. || V || Indicateur d’exploitation.
VF || La composition organique du capital est C/V. || V || Elle tend à augmenter avec la mécanisation.
VF || La tendance à la baisse du taux de profit vient de la baisse de la masse salariale. || F || Elle provient de la hausse de C/V (machines) à plus-value inchangée.
VF || L’armée industrielle de réserve tire les salaires réels vers le haut. || F || Pression à la baisse sur les salaires.
VF || Reproduction simple : toute la plus-value est consommée ; reproduction élargie : une part est accumulée. || V || Accumulation du capital.
VF || Le schéma A–M–A′ signifie que l’échange vise l’usage. || F || Il vise la valorisation (plus d’argent à la fin).
VF || Le problème de transformation des valeurs en prix vise à expliquer le passage de la valeur-travail aux prix de production. || V || Taux de profit uniforme entre branches.
VF || L’aliénation du travail renvoie uniquement au chômage. || F || Perte de maîtrise du travail et du produit sous la logique du capital.
VF || L’accumulation primitive décrit la séparation initiale des producteurs et des moyens de production. || V || Enclosures, expropriations, etc.

QCM || Selon Marx, la valeur d’une marchandise reflète : || sa rareté|V:le temps de travail socialement nécessaire|la demande instantanée|la rente foncière
QCM || Le « travail abstrait » désigne : || V:l’équivalence sociale des travaux concrets hétérogènes|la qualification d’un métier précis|l’utilité marginale|la productivité moyenne
QCM || La force de travail a pour valeur : || V:le coût de reproduction du travailleur (subsistance socialement définie)|la somme des heures réalisées|la plus-value|le salaire nominal
QCM || La plus-value est : || un loyer sur la terre|un rendement financier|V:du surtravail non payé approprié par le capitaliste|un impôt d’État
QCM || Le taux de plus-value p′ se calcule comme : || PL/C|PL/(C+V)|V:PL/V|V/(C+V)
QCM || La composition organique du capital mesure : || V:le rapport C/V|le rapport V/C|la part des profits|la part des salaires
QCM || La baisse tendancielle du taux de profit résulte principalement : || de la baisse des salaires nominaux|V:de l’augmentation de C/V liée au progrès technique|de l’augmentation de la rente|de la concurrence internationale
QCM || La plus-value absolue s’obtient par : || la baisse des charges|V:l’allongement de la journée de travail|l’innovation organisationnelle|la hausse des prix
QCM || La plus-value relative s’obtient par : || V:la réduction du travail nécessaire grâce aux gains de productivité|la hausse des prix|l’allongement de la journée|la baisse des salaires nominaux
QCM || L’armée industrielle de réserve : || n’existe qu’en crise|V:constitue un chômage de réserve disciplinant les salaires|est sans effet sur les salaires|correspond aux retraités
QCM || Le capital constant désigne : || les salaires|V:les moyens de production dont la valeur se transmet au produit|les profits|les impôts
QCM || Le capital variable désigne : || V:les salaires qui créent de la valeur nouvelle|les matières premières|les intérêts|les machines
QCM || La reproduction élargie implique : || la consommation totale de la plus-value|V:la réinvestissement d’une part de la plus-value|la baisse des salaires|la disparition de la rente
QCM || Le problème de transformation relie : || V:valeurs (travail) et prix de production (profit uniforme)|valeurs d’usage et rareté|offre et demande|taux d’intérêt et monnaie
QCM || Les contre-tendances à la baisse du taux de profit incluent : || V:hausse du taux de plus-value|V:bon marché des éléments du capital constant|diminution de la composition organique|réduction de la productivité
QCM || Dans A–M–A′, l’objectif est : || la satisfaction des besoins|V:la valorisation de la valeur (A′ > A)|l’égalisation des salaires|la suppression du marché
QCM || Travail simple et travail complexe : || V:le travail complexe compte comme multiple du travail simple|ils sont incomparables|seul le complexe crée de la valeur|seul le simple crée de la valeur
QCM || Marchandise chez Marx : || V:un bien produit pour l’échange, porteur de valeur d’usage et de valeur|tout bien rare|un service public|un bien non reproductible
QCM || Salaire réel vs salaire nominal : || V:réel = pouvoir d’achat (W/P)|nominal = W/P|réel = W|réel = W×P
QCM || Rôle du progrès technique : || V:augmente C/V et tend à faire baisser le taux de profit|réduit le capital constant et augmente le taux de profit|n’a aucun effet sur la valeur|supprime la plus-value

### Questions tombées en examen (2022, 2023, 2024)
`,Ee=`### Version examen réaliste
QCM || Pour Menger et Jevons, la valeur d’un bien est déterminée par : || sa rareté objective|la quantité de travail incorporé|V:son utilité marginale|les coûts de production uniquement
QCM || L’utilité marginale signifie : || V:l’utilité de la dernière unité consommée|l’utilité totale du bien|la valeur marchande d’un bien rare|le coût de production d’un bien
QCM || Selon Menger, la valeur est : || V:subjective, déterminée par les besoins de l’individu|objective, mesurée par le travail|fixée par l’État|identique au prix
QCM || Pour Jevons, l’utilité peut être : || V:mesurée et représentée mathématiquement|uniquement décrite qualitativement|remplacée par le travail commandé|déterminée par la rente
QCM || La « révolution marginaliste » se situe : || 1820|1850|V:1870|1910

### Version complète
VF || Pour les marginalistes, la valeur ne dépend plus du travail mais de l’utilité marginale. || V || Rupture avec Smith, Ricardo, Marx.
VF || L’utilité marginale est toujours croissante avec les quantités consommées. || F || Elle est décroissante (loi de Gossen).
VF || Carl Menger insiste sur le caractère subjectif de la valeur. || V || École autrichienne → valeur dépend de l’importance que l’individu accorde au bien.
VF || William Stanley Jevons développe une approche mathématique de l’utilité. || V || Utilité marginale représentée et calculée quantitativement.
VF || Pour Menger, la valeur d’un bien réside dans ses coûts de production. || F || Elle réside dans son utilité marginale pour l’individu.

QCM || La « loi de Gossen » exprime : || V:la décroissance de l’utilité marginale avec la consommation|la hausse continue de l’utilité marginale|l’égalité entre utilité et valeur-travail|le lien entre prix naturel et prix de marché
QCM || Menger critique : || V:la valeur-travail des Classiques|la subjectivité de la valeur|l’existence de l’utilité marginale|la loi des rendements décroissants
QCM || Pour Jevons, la valeur d’un bien correspond : || à la rareté de la ressource|à la quantité de travail incorporé|V:au plaisir ou à la satisfaction que procure la dernière unité consommée|à la rente foncière
QCM || La révolution marginaliste marque : || V:le passage d’une théorie objective de la valeur à une théorie subjective|la victoire définitive de la valeur-travail|la fin des mathématiques en économie|l’apparition du keynésianisme
QCM || Pour Menger, la valeur est : || V:une relation entre un besoin et un bien apte à le satisfaire|le résultat du travail commandé|une donnée fixe indépendante des individus|définie uniquement par la rareté physique

### Questions tombées en examen (2022, 2023, 2024)
`,Pe=`### Version examen réaliste
QCM || L’optimum de Pareto désigne : || un profit maximum pour les capitalistes|V:une situation où on ne peut améliorer la situation d’un individu sans détériorer celle d’un autre|un équilibre de marché imparfait|un maximum de productivité
QCM || La loi de Pareto (80/20) illustre : || V:la concentration des revenus et richesses dans une minorité de la population|l’égalité des revenus|la croissance partagée|la rente foncière
QCM || Pour Pareto, l’équilibre est atteint lorsque : || V:aucune amélioration n’est possible sans perte pour autrui|les profits sont maximisés|le chômage disparaît|l’État redistribue les revenus
QCM || L’optimum de Pareto suppose : || V:des marchés concurrentiels|l’intervention de l’État|l’absence d’échanges|un chômage structurel

### Version complète
VF || L’optimum de Pareto signifie qu’on ne peut améliorer la situation d’un agent sans détériorer celle d’un autre. || V || Critère d’efficacité allocative.
VF || La loi de Pareto illustre une répartition parfaitement égalitaire des revenus. || F || Elle montre une forte concentration (20 % des individus détiennent 80 % des richesses).
VF || Pour Pareto, l’équilibre est un état où toute amélioration est impossible sans perte pour autrui. || V || Critère de Pareto-efficiency.
VF || Pareto propose une redistribution égalitaire par l’État. || F || Son optimum est purement technique, sans jugement d’équité.
VF || L’optimum de Pareto est une mesure d’efficacité mais pas de justice sociale. || V || Efficience ≠ équité.

QCM || L’optimum de Pareto suppose : || V:des échanges volontaires et concurrence parfaite|un État fort et interventionniste|une égalité stricte des revenus|l’absence de marchés
QCM || La loi de Pareto (80/20) se vérifie : || V:pour les revenus, mais aussi dans d’autres domaines (production, distribution, sociologie)|uniquement pour l’économie du XIXe siècle|jamais empiriquement|seulement pour l’agriculture
QCM || Une limite de l’optimum de Pareto est : || V:il ne dit rien sur l’équité de la répartition|il supprime la concurrence|il nie l’existence du chômage|il confond valeur et utilité
QCM || La loi de Pareto montre que : || V:les inégalités sont structurelles et persistantes|la croissance réduit toujours les inégalités|les salaires évoluent tous pareil|la productivité explique toute la répartition
QCM || Pareto distingue : || V:l’efficacité (optimum) et la justice sociale (hors de son modèle)|les profits et les salaires|le court terme et le long terme|la valeur d’usage et d’échange

### Questions tombées en examen (2022, 2023, 2024)
QCM || L’optimum de Pareto désigne : || un profit maximum|V:une situation où on ne peut améliorer la situation d’un individu sans détériorer celle d’un autre|un maximum de productivité|un équilibre budgétaire
QCM || La loi de Pareto illustre : || une égalité des revenus|V:la concentration des richesses dans une minorité|une politique de redistribution|la rente foncière
`,Ie=`### Version examen réaliste
QCM || Pour David Ricardo, la valeur d’un bien correspond à : || sa rareté|V:la quantité de travail incorporé|le profit qu’il génère|la rente foncière
QCM || Selon Ricardo, la rente existe uniquement dans : || l’industrie|le commerce|V:l’agriculture|la production artisanale
QCM || La rente ricardienne rémunère : || le capital investi|V:la fertilité différentielle du sol|le travail indirect incorporé|le risque pris par les capitalistes
QCM || Chez Ricardo, le salaire naturel correspond : || au salaire moyen observé|V:au salaire de subsistance|au salaire du marché|au salaire minimum légal
QCM || La baisse tendancielle du taux de profit s’explique par : || la concurrence accrue|la hausse des salaires nominaux|V:la mise en culture de terres moins fertiles|la fiscalité trop lourde
QCM || L’état stationnaire chez Ricardo signifie : || un équilibre temporaire|V:une stagnation durable avec profit nul|un optimum de Pareto|une crise conjoncturelle

### Version complète
VF || Ricardo adopte la théorie de la valeur travail incorporé, en rupture avec Smith. || V || Valeur déterminée par quantité de travail direct + indirect.
VF || La valeur d’un bien dépend chez Ricardo de sa rareté. || F || Valeur ≠ rareté, sauf biens rares (ex : vins anciens).
VF || La rente ricardienne apparaît aussi dans l’industrie. || F || Elle n’existe qu’en agriculture.
VF || Chez Ricardo, le salaire naturel est fixé par les lois du marché. || F || Salaire naturel = subsistance, lié à la démographie (loi de population).
VF || Ricardo voit la rente comme un coût nécessaire à la production. || F || C’est un prélèvement, pas un coût productif.
VF || Ricardo explique la baisse tendancielle du taux de profit par la loi des rendements décroissants. || V || Moins de terres fertiles cultivées → hausse salaires → baisse profits.
VF || L’état stationnaire est une phase dynamique de croissance. || F || C’est une stagnation durable.

QCM || La valeur chez Ricardo est déterminée par : || sa valeur d’usage|la demande|V:la quantité de travail direct et indirect incorporé|la rente foncière
QCM || La rente ricardienne correspond à : || V:un revenu différentiel lié à la fertilité des terres|un coût supplémentaire imposé aux capitalistes|un salaire dissimulé|une subvention publique
QCM || Selon Ricardo, quelle relation entre salaire, profit et rente ? || V:Une hausse des salaires réels réduit les profits|V:Une hausse de la rente réduit aussi les profits|Les profits sont indépendants de la rente|Les salaires réels augmentent toujours les profits
QCM || Pour éviter l’état stationnaire, Ricardo propose : || V:le commerce international (loi des avantages comparatifs)|la baisse des salaires nominaux|l’abolition de la rente|l’intervention publique massive
QCM || La loi des avantages comparatifs de Ricardo stipule : || V:un pays a intérêt à se spécialiser dans le bien pour lequel son désavantage est le plus faible|un pays doit produire tout ce qu’il fait le mieux|le libre-échange profite uniquement aux pays les plus forts|la valeur dépend de l’autarcie
QCM || Chez Ricardo, l’état stationnaire se traduit par : || un chômage massif|V:profits nuls et croissance stoppée|rente et salaires absorbant tout|V:une économie figée sur l’agriculture
QCM || Quelle est la différence centrale Smith/Ricardo ? || V:Smith = valeur travail commandé ; Ricardo = valeur travail incorporé|Ricardo = utilité marginale ; Smith = rareté|Smith = salaire naturel = subsistance ; Ricardo = salaire naturel = marché|Ils disent la même chose

### Questions tombées en examen (2022, 2023, 2024)
QCM || En reprenant les termes de David Ricardo et d’Adam Smith, le prix naturel d’un bien est supérieur à son prix de marché si : || ...
QCM || Supposons qu’un bien nécessite 1h de travail pour être produit. L’heure de travail vaut 15€. Ce bien, vendu 18€, voit son prix baisser à 15€. Adam Smith et David Ricardo expliquent cette évolution par : || ...
`,Re=`VF || Pour Adam Smith, la valeur d’usage et la valeur d’échange sont deux concepts distincts. || V || Paradoxe de l’eau et du diamant : utilité ≠ valeur d’échange.
VF || Dans une société primitive, la valeur d’échange d’un bien est déterminée par le travail incorporé. || V || Travail commandé = travail incorporé en l’absence de classes sociales.
VF || Dans une société avancée, la valeur subit une double déduction : profit et rente. || V || Les capitalistes et les propriétaires fonciers prélèvent leur part.
VF || Chez Smith, le salaire est toujours au-dessus du niveau de subsistance. || F || Salaire de subsistance = minimum vital, dépend du rapport de force.
VF || Smith considère que les profits sont justifiés car ils financent l’accumulation du capital. || V || Plus de profits = plus d’investissement = croissance.

QCM || Pour Adam Smith, la valeur d’échange d’un bien correspond à : || sa valeur d’usage|sa rareté|V:la quantité de travail qu’il commande|le capital nécessaire à sa production || Valeur d’échange = travail qu’on peut obtenir en échange du bien.
QCM || Quelle est la différence entre valeur travail commandé et valeur travail incorporé ? || V:Travail commandé = quantité de travail qu’un bien permet d’acheter|V:Travail incorporé = quantité de travail directement nécessaire à sa production|Elles sont identiques|La valeur dépend seulement de la rareté || Smith (travail commandé) / Ricardo (travail incorporé).
QCM || La « double déduction » chez Smith correspond à : || les impôts et les salaires|V:le profit (capitalistes) et la rente (propriétaires fonciers)|les salaires et les consommations intermédiaires|la rente et les taxes d’État || La valeur créée doit d’abord rémunérer profit et rente.
QCM || Selon Smith, le salaire tend naturellement : || V:vers le niveau de subsistance|vers un niveau de profit nul|vers l’égalité entre capitalistes et travailleurs|vers la valeur d’usage du bien produit || Salaire naturel = subsistance.
QCM || Le paradoxe de l’eau et du diamant illustre : || V:la différence entre valeur d’usage et valeur d’échange|que la rareté explique toute la valeur|que le travail détermine directement l’utilité|que le marché fixe la valeur en toutes circonstances || Eau = utilité forte mais valeur faible ; diamant = inverse.
`,Ae=`### Version examen réaliste
QCM || Pour Walras, l’équilibre général signifie : || l’équilibre d’un seul marché|V:l’équilibre simultané de tous les marchés|un optimum de Pareto|un équilibre budgétaire de l’État
QCM || Le commissaire-priseur chez Walras sert à : || fixer les salaires|remplacer les capitalistes|V:ajuster les prix fictivement avant échanges|supprimer la concurrence
QCM || Le tâtonnement walrasien décrit : || V:le processus d’ajustement progressif des prix vers l’équilibre|l’intervention de l’État pour fixer les prix|la rareté des biens naturels|la loi des rendements décroissants
QCM || L’image du commissaire-priseur illustre : || un mécanisme de taxation|un rôle réel dans les marchés financiers|V:un personnage fictif qui annonce les prix et ajuste jusqu’à équilibre|un rôle des syndicats
QCM || Pour Walras, l’équilibre général est possible sous : || V:concurrence parfaite|monopole|oligopole|absence de marché

### Version complète
VF || Pour Walras, l’économie est un système interdépendant de marchés. || V || Analyse simultanée → équilibre général.
VF || L’équilibre général signifie que l’offre et la demande s’égalent sur tous les marchés en même temps. || V || Condition d’efficacité du système.
VF || Le commissaire-priseur est un agent réel chargé de réguler les marchés. || F || Figure fictive pour illustrer le tâtonnement des prix.
VF || Le tâtonnement walrasien suppose que les échanges ont lieu même avant l’équilibre. || F || Pas d’échanges tant que l’équilibre n’est pas atteint.
VF || L’équilibre général suppose la concurrence parfaite. || V || Hypothèses fortes → rationalité, information parfaite, atomicité.
VF || Le modèle de Walras est facilement applicable à la réalité. || F || Trop abstrait et irréaliste, mais fondateur de la microéconomie moderne.

QCM || Le rôle du commissaire-priseur est : || annoncer les salaires|fixer les impôts|V:annoncer les prix et corriger tant qu’offre ≠ demande|déterminer la production optimale
QCM || Le tâtonnement walrasien est : || une politique monétaire|un processus d’ajustement des prix sans échanges hors équilibre|V:un processus théorique pour expliquer l’équilibre général|une réforme budgétaire
QCM || L’équilibre partiel et l’équilibre général diffèrent car : || V:Marshall analyse un seul marché, Walras tous les marchés simultanément|Walras analyse un seul marché, Marshall tous|ils disent la même chose|Walras se concentre sur la loi de Say
QCM || Une critique du modèle walrasien est : || V:il est trop abstrait et irréaliste|il néglige la concurrence parfaite|il ne suppose aucune rationalité|il ne traite pas de l’équilibre
QCM || Le modèle walrasien est à la base de : || le keynésianisme|V:la microéconomie moderne et la théorie néoclassique|le marxisme|la théorie mercantiliste

### Questions tombées en examen (2022, 2023, 2024)
QCM || L’image du commissaire-priseur est utilisée par Walras pour : || décrire le processus d’échange dans une économie de marché|décrire l’équilibre du marché du travail|V:décrire le processus de tâtonnement vers l’équilibre général|décrire les trois propositions précédentes
QCM || Le tâtonnement walrasien décrit : || V:un ajustement des prix jusqu’à l’égalité offre/demande|une fixation des prix par l’État|un phénomène lié aux rendements décroissants|un optimum de Pareto
`,_e=`QCM || Le prix Nobel d’économie 2024 a été décerné à : || V:Acemoglu, Johnson et Robinson pour leurs travaux sur la façon dont les institutions se forment et affectent la prospérité|Georges Akerlof pour ses travaux sur les asymétries de l’information et la sélection adverse|Stiglitz et Shapiro pour leurs travaux sur le marché du travail et le salaire d’efficience|Aucun des économistes mentionnés dans les propositions précédentes || Le prix Nobel 2024 a récompensé les travaux sur les institutions (Acemoglu, Johnson, Robinson).

QCM || En reprenant les termes de David Ricardo et d’Adam Smith, le prix naturel d’un bien est supérieur à son prix de marché si : || la production de ce bien nécessite 2 heures de travail et qu’il est vendu 15 euros sur le marché|V:la production de ce bien nécessite 2 heures de travail et qu’il est vendu 25 euros sur le marché|la production de ce bien nécessite 2 heures de travail et qu’il est échangé contre un autre nécessitant 1 heure de travail|la production de ce bien nécessite 2 heures de travail et qu’il est échangé contre un autre nécessitant 3 heures de travail || Prix naturel = valeur en travail, prix marché > prix naturel → bien surévalué.

QCM || Supposons qu’un bien nécessite 1 heure de travail pour être produit. L’heure de travail vaut 15 euros. Ce bien qui était vendu 18 euros voit son prix baisser jusqu’à 15 euros. Adam Smith et David Ricardo expliquent cette évolution par : || l’intervention de l’État|V:la concurrence|la baisse du coût de production|la baisse de son utilité marginale || Concurrence ramène le prix de marché vers le prix naturel.

QCM || L’image du commissaire-priseur est utilisée par Walras pour : || décrire le processus d’échange dans une économie de marché|décrire l’équilibre du marché du travail|V:décrire le processus de tâtonnement vers l’équilibre général|décrire les trois propositions précédentes || Commissaire-priseur = ajustement progressif des prix par tâtonnement.

QCM || Supposons que vous receviez 7 cadeaux alors que votre frère en reçoit 5. La redistribution optimale au sens de Pareto est atteinte si : || votre mère décide de vous en prendre 1 pour le donner à votre frère|V:votre mère décide finalement d’acheter 1 cadeau supplémentaire à votre frère, qui passe à 6 cadeaux|votre mère décide d’acheter exactement 2 cadeaux supplémentaires à votre frère|aucune des propositions précédentes n’est correcte || Optimum de Pareto = personne n’est perdant, un est gagnant → cadeau supplémentaire.

QCM || Pour les économistes classiques, l’équilibre du marché du travail : || V:implique le plein emploi des travailleurs disponibles|peut s’accompagner de chômage volontaire|peut s’accompagner de chômage involontaire|est atteint lorsque le salaire conduit les entreprises à embaucher tous les travailleurs || Marché du travail classique → ajustement par le salaire → plein emploi.

QCM || Pour les économistes keynésiens, le chômage s’explique par : || des rigidités institutionnelles empêchant la régulation du marché du travail|V:un coût du travail trop élevé par rapport à son niveau d’équilibre|le chômage ne peut être que volontaire|le chômage ne peut être qu’involontaire || Keynes : chômage involontaire dû à insuffisance de la demande et rigidités.

QCM || Friedman remet en cause l’efficacité de la politique budgétaire dans la lutte contre le chômage car : || V:l’augmentation temporaire de la demande publique ne modifie pas le revenu permanent des individus|les dépenses publiques étant financées par l’impôt, l’effet budgétaire est nul|l’augmentation de la masse monétaire engendre une hausse des prix anticipée|les agents ajustent leur comportement dès l’annonce d’une hausse de la dépense publique || Friedman → revenu permanent : la dépense publique n’a pas d’effet durable.

QCM || Sous l’hypothèse d’anticipations rationnelles : || V:les prévisions des agents économiques se révèlent correctes en moyenne|seuls les chocs aléatoires peuvent avoir des effets réels|les deux propositions précédentes sont correctes|aucune des propositions n’est correcte || Anticipations rationnelles : agents utilisent toute l’info disponible → prévisions correctes en moyenne.

QCM || Les nouveaux keynésiens : || remettent en cause l’hypothèse d’anticipation rationnelle|remettent en cause l’hypothèse d’ajustement instantané des prix de marché|V:remettent en cause les deux hypothèses précédentes|remettent en cause l’efficacité de la politique économique || Nouveaux keynésiens : rigidités + info imparfaite → contestent rationalité parfaite et ajustement instantané.

QCM || Sous l’hypothèse de marchés concurrentiels et d’anticipations rationnelles, les déséquilibres durables entre offre et demande s’expliquent par : || l’existence d’asymétries de l’information|l’existence de coûts de menu|V:les deux raisons précédentes|des rigidités institutionnelles || Nouveaux keynésiens : asymétries d’information + coûts d’ajustement → déséquilibres durables.

QCM || L’absence d’ajustement du taux d’intérêt à son niveau d’équilibre sur le marché du crédit s’explique par Stiglitz : || des anticipations rationnelles|une intervention publique bloquant la hausse du taux d’intérêt|la loi de l’offre et de la demande|V:l’incapacité des prêteurs à distinguer les bons des mauvais emprunteurs || Stiglitz : sélection adverse → impossibilité d’ajuster les taux.

QCM || En 1970, Akerlof propose une analyse du marché des voitures d’occasion qui aboutit à : || V:définir le problème de sélection adverse|définir le problème d’aléa moral|montrer l’existence de coûts de menu|montrer que les trois propositions sont vraies || Akerlof → “Market for Lemons” → sélection adverse.

QCM || Stiglitz et Shapiro montrent que lorsque l’employeur n’est pas capable d’apprécier l’effort des salariés, il peut être rationnel de : || V:verser des salaires supérieurs au cas d’excès d’offre de travail|maintenir des salaires supérieurs au niveau d’équilibre|considérer le chômage comme volontaire|aucune des propositions n’est vraie || Salaire d’efficience → motiver et discipliner les salariés.

QCM || Pour Stiglitz et Shapiro, l’existence d’un chômage supérieur à son niveau d’équilibre : || a un effet positif sur les chômeurs|V:a un effet positif sur les travailleurs, incités à fournir un maximum d’effort|a un effet négatif sur les travailleurs, démotivés|a un effet négatif sur les chômeurs, qui renoncent à chercher un emploi || Salaire d’efficience → chômage disciplinaire : pression positive sur travailleurs en poste.
`,Te=`### Version examen réaliste

### Version complète

### QCM Pièges & comparatifs

### Questions tombées en examen (2023)
QCM || Le Fond Monétaire International : || a été créé en juillet 1954|V:regroupe 189 pays|assure la croissance économique mondiale|V:conditionne l’obtention de ses prêts économiques à des garanties financières
QCM || Les ressources du Fond Monétaire Internationale || comprennent de panier de devises|financent des projets de développement économiques|V:comprennent les quotes-parts des pays membres|sont constituées de stock d’or et de bronze
QCM || La banque mondiale : || V:est une institution internationale créée le 27 décembre 1944|est un groupe qui réunit six autres institutions|a son siège à New York|V:a pour rôle principal de lutter contre la pauvreté
QCM || Les institutions de réflexion ou thinks tanks : || V:influencent les décideurs politiques|apparaissent entre la fin du 20ème siècle|sont de conception française|V:se financent sur la base de ressources privées
QCM || Le lobbying : || recouvre des activités multiples d’influence culturelle|concerne seulement les entreprises|regroupe les partis politiques|V:renvoie à tout processus d’influence, formel ou informel, initié par un acteur, privé ou public, auprès d’une institution publique
QCM || Le paradoxe de Madison : || V:montre que l’interdiction des lobbies (et du lobbying) serait contraire aux principes républicains|cherche à renforcer le poids de certains lobbies|veut combattre les dérives du lobbying en encourageant leur généralisation|généralise la pratique du lobbying en Europe
QCM || Les institutions : || V:forment l’ensemble des règles formelles et informelles régissant les comportements des individus et des organisations|représentent des organisations politique, économique, sociale ou religieuse|se confondent avec les organisations|sont dépendantes des organisations et s’influencent mutuellement
QCM || La gouvernance économique : || V:occupe une place de choix dans l’analyse méthodique des politiques publiques, de la gestion, de la sociologie des organisations et des associations culturelles|V:comprend les relations internationales, les régulations économiques et le rapport aux pouvoirs locaux|est un concept remis en avant par le FMI dans les années 1990|est un concept remis en avant par la Banque mondiale dans les années 2000
QCM || L’Organisation mondiale du commerce a succédé : || au FMI|V:au GATT|à Bretton Woods|à l’OCDE
QCM || L’INSEE : || a été créé par la loi de finances du 27 avril 1948|V:est un organisme exclusivement de statistiques nationales|est un outil au service de la comptabilité analytique|V:a déménagé une partie de ses locaux à Metz depuis 2011
QCM || L’INSEE gère : || la base des répertoires des personnes morales (BRPM)|V:le répertoire national d’identification des personnes physiques (RNIPP) appelé communément numéro de sécurité sociale|le fichier général des grands électeurs (FGE)|la base de données des professions juridiques (BDPJ)
QCM || Les normes IFRS : || V:s’appliquent aux sociétés cotées pour leurs comptes consolidés (états financiers des groupes d’entreprises)|comprennent les normes de comptabilité nationale|s’appuient sur les normes de comptabilité européenne|rendent nécessaire l’intervention d’une entité étatique
QCM || Les principes de la comptabilité française reposent : || le coût marginal|la fréquence des méthodes|V:image sincère|V:indépendance des exercices
QCM || Les normes comptables internationales IFRS reposent sur les principes suivants : || V:pertinence|rationalité|prévisibilité|intégrité
QCM || L’Organisation mondiale du commerce a pour mission : || de servir de cadre aux négociations politiques|de veiller à la mise en œuvre des accords de Paris|V:d’administrer les procédures de règlement des différends des conflits commerciaux|de coopérer avec l’ONU
`,ke=`### Version examen réaliste

### Version complète

### QCM Pièges & comparatifs

### Questions tombées en examen (2024)
QCM || Selon Douglas North, qu'est-ce qu'une institution ? || Un groupe d’individus poursuivant un but commun|V:Un ensemble de règles de jeu structurant les interactions humaines|Une organisation internationale|Un acteur économique clé
QCM || Quel rôle jouent les institutions économiques selon Acemoglu et Robinson ? || Organiser la gouvernance mondiale|V:Réguler les interactions humaines dans le domaine économique|Assurer le commerce international|Éliminer les asymétries d’information
QCM || Quels sont les mots clés associés à la bonne gouvernance selon la Banque mondiale ? || Productivité et innovation|V:Efficacité, responsabilisation, participation et transparence|Croissance, stabilité, et développement durable|Égalité, justice, et inclusion
QCM || Comment la sélection adverse peut-elle affecter un marché ? || En augmentant les prix|En supprimant les mauvaises options du marché|V:En entraînant une disparition progressive des produits de bonne qualité|En améliorant la transparence du marché
QCM || Selon Garrett Hardin, qu’est-ce qui cause la tragédie des biens communs ? || Le manque d’innovation|V:L’absence de droits de propriété sur les ressources partagées|La sur-réglementation des marchés|Les asymétries d’information
QCM || Quel est l’objectif principal de la théorie des droits de propriété ? || Maximiser les profits des entreprises|V:Fournir des incitations à valoriser les ressources|Encourager la privatisation totale des biens communs|Réduire les asymymétries d’information
QCM || À quoi servent principalement les normes IFRS ? || Simplifier la fiscalité internationale|V:Harmoniser la communication financière au niveau international|Augmenter les bénéfices des entreprises|Éliminer les coûts d’audit
QCM || Quelle est l’une des critiques majeures des normes IFRS ? || Leur manque de transparence|Leur incompatibilité avec le modèle anglo-saxon|V:Leur absence de prise en compte des enjeux climatiques|Leur complexité excessive
QCM || Quel est le rôle principal de l’OMC ? || Réguler les marchés financiers|Promouvoir les normes environnementales|V:Régir les règles du commerce mondial|
QCM || Quelle est la mission principale de l’INSEE ? || Surveiller les marchés financiers|V:Fournir des données statistiques sur l’économie et la société françaises|Gérer les politiques budgétaires de l’État|Réguler les entreprises cotées
QCM || Quand l’INSEE a-t-il été créé ? || V:1946|1958|1984|1973
QCM || Quelle solution peut réduire les asymétries d’information sur le marché du travail ? || L’aléa moral|La publicité|V:Les signaux tels que les diplômes|Les quotas d’embauche
QCM || Quel problème la théorie de la sélection adverse tente-t-elle de résoudre ? || Les mauvaises décisions des consommateurs|V:La disparition de produits de qualité sur un marché|L’opportunisme des entreprises|L’augmentation des prix
QCM || Quels biens sont caractérisés par une non-excluabilité et une rivalité d’usage ? || Les biens privés|Les biens publics|V:Les biens communs|Les biens de club
QCM || Quelle solution institutionnelle peut éviter la tragédie des biens communs ? || La taxation|V:La privatisation ou la gestion collective des ressources|L’abolition des quotas de production|La déréglementation
QCM || Quel est l’objectif principal des états financiers selon les normes IFRS ? || V:Répondre aux besoins des investisseurs|Réduire les coûts de production|Faciliter les relations entre actionnaires et employés|Renforcer les politiques publiques
QCM || Quelles sont les quatre caractéristiques qualitatives des états financiers selon l’IASC (1989) ? || Transparence, régularité, neutralité, sincérité|V:Pertinence, fiabilité, comparabilité, compréhensibilité|Simplicité, lisibilité, flexibilité, robustesse|Productivité, efficience, exactitude, simplicité
QCM || Quel est le rôle principal du FMI ? || Promouvoir le commerce international|V:Fournir des prêts pour stabiliser les économies en difficulté|Gérer les normes comptables internationales|
QCM || Quelle est la mission principale de l’OMC ? || Réguler les flux migratoires|V:Promouvoir un commerce ouvert et équitable|Superviser les systèmes monétaires|Harmoniser les systèmes fiscaux nationaux
QCM || Quel accord de l’OMC traite des droits de propriété intellectuelle ? || Accord de Doha|V:Accord sur les ADPIC|Accord sur l’agriculture|Accord général sur les tarifs douaniers
`,we=`QCM || Sélection adverse vs aléa moral : bonnes associations || V:Sélection adverse = avant contrat|V:Aléa moral = après contrat|Sélection adverse = après contrat|Aléa moral = avant contrat
QCM || Marché des voitures d’occasion (Akerlof) : effets || V:Qualité moyenne baisse|V:Risque de disparition du marché|Hausse automatique de la qualité|Absence d’externalités
QCM || Correctifs d’asymétrie : lesquels ? || V:Labels & garanties|V:Régulation/contrats (franchises)|Supprimer l’information|Prix plus bas suffisent toujours
QCM || Spence — signal : propriétés d’un bon signal || V:Coût différentiel selon la qualité|Observable|Imitation gratuite|V:Crédible & corrélé à la qualité
QCM || Exemples de signal || V:Diplôme|V:Garantie vendeur|Subvention universelle|Interdiction pure et simple
QCM || Arrow (santé) : mécanismes || V:Certification/reputation|V:Assurances|Absence de contrats|Suppression de l’éthique médicale
QCM || Piège : laquelle est FAUSSE ? || V:L’aléa moral précède la signature|Diplôme peut trier|Labels informent|Réputation réduit l’incertitude
QCM || Quand privilégier un contrat avec franchise ? || V:Quand l’aléa moral est élevé|Quand info parfaite|Toujours inutile|Quand le risque est nul
QCM || Which is TRUE? || V:Signalling complements screening|Screening = same as signalling|Costless signals are more credible|All labels eliminate risk
QCM || Plateformes de seconde main : quels outils réduisent la sélection adverse ? || V:Scores/réclamations publics|V:Garantie acheteur|Anonymat total|Suppression des avis
`,je=`QCM || IFRS — orientation || Vers l’État d’abord|V:Vers l’investisseur (utilité décisionnelle)|Vers les auditeurs|Vers les fournisseurs
QCM || IFRS — principes (IASC 1989) || V:Pertinence|V:Fiabilité|V:Comparabilité|V:Compréhensibilité
QCM || Modèle continental vs IFRS || V:Continental → prudence/patrimonialité|V:IFRS → juste valeur/market‑based|IFRS suppriment la volatilité|Continental = uniquement actionnaires
QCM || ANC (France) — missions || V:Règlements comptables nationaux|V:Participation au processus IFRS|Fixer l’euro|V:Coordonner la recherche comptable
QCM || États financiers — finalité IFRS || Informer l’État|Informer les créanciers uniquement|V:Fournir une info utile aux investisseurs|Supprimer l’audit
QCM || Critique fréquente des IFRS || V:Prise en compte insuffisante des risques climatiques|Pas de comparabilité|Absence d’audit|Interdiction de la juste valeur
QCM || Juste valeur — notion || V:Valeur d’échange/flux actualisés lorsque pas de marché actif|Coût historique identique|Toujours le prix d’achat|Interdite en IFRS
QCM || Piège : laquelle est FAUSSE ? || IFRS pour comptes consolidés cotés|ANC = autorité publique|IASC 1973|V:Eurostat édicte les IFRS
`,De=`QCM || Pourquoi une firme existe (Coase 1937) ? || V:Réduire coûts de transaction du marché|Pour éviter les salaires|Pour éviter les impôts|Parce que la loi l’impose
QCM || Théorème de Coase : valable si… || V:Coûts de transaction ≈ nuls|Information parfaite inutile|Droits de propriété non définis|Pouvoir de marché élevé
QCM || Williamson — facteurs ↑ coûts || V:Spécificité des actifs|V:Incertitude|V:Opportunisme|Substituabilité parfaite
QCM || Choix du mode de gouvernance || V:Marché / Hiérarchie / Hybrides selon coûts|Toujours marché|Toujours intégration verticale|Toujours contrats relationnels
QCM || Exemple : pièce automobile très spécifique — choisir ? || V:Intégration/contrat long terme|Spot‑market|Aucun contrat|Appel d’offres quotidien
QCM || Piège : laquelle est FAUSSE ? || Marché si coûts faibles|Hiérarchie si actifs spécifiques|Hybrides possibles|V:Contrats sont inutiles
QCM || Plateformes numériques : effet sur coûts ? || V:Réduction recherche/négociation|Toujours ↑ coûts de surveillance|Élimination totale des coûts|Aucun impact
QCM || Which are TRUE? TCE assumes… || V:bounded rationality|V:opportunism|perfect information|no asset specificity
`,Be=`QCM || Selon North, une institution est… || Des organisations publiques|V:Des règles du jeu (formelles & informelles) encadrant les interactions|Un acteur économique|Un marché concurrentiel
QCM || Institution vs organisation : lesquelles sont correctes ? || V:Institution = règle|V:Organisation = groupe poursuivant des objectifs|Les deux sont identiques|Une organisation est forcément publique
QCM || Banque mondiale (années 1990) — mots‑clés de la « bonne gouvernance » || V:Efficacité|V:Responsabilisation|V:Transparence & participation|Monopole de l’État central
QCM || Gouvernance moderne : caractéristiques || V:Réseaux d’acteurs|V:Pouvoirs multicentrés|Hiérarchie pure|Absence d’État par principe
QCM || Confusion fréquente : laquelle est FAUSSE ? || V:Les institutions sont toujours des organismes avec salariés|Les institutions structurent les incitations|Les organisations peuvent influencer les institutions|Institutions & organisations co‑évoluent
QCM || Rodrik (2005) — associer || V:Création → droits de propriété|V:Régulation → autorités de concurrence/BC|Stabilisation → politiques monétaires/budgétaires|Légitimation → protection sociale
QCM || Indice de gouvernance/IPC et croissance : lequel est exact ? || V:Meilleure qualité institutionnelle ↔ PIB/habitant plus élevé (corrélation)|Aucune relation|Qualité ↓ entraîne inflation ⬇ automatiquement|Corrélation négative systématique
QCM || Acemoglu & Robinson — rôle des institutions économiques || Organiser seules le commerce mondial|V:Réguler les interactions et les incitations|Éliminer toutes les asymétries d’info|Supprimer les coûts de transaction
`,$e=`QCM || Fonction des droits de propriété (North/Coriat-Weinstein) || Réduire l’épargne|V:Aligner incitations & réduire coûts de transaction|Rendre l’investissement impossible|Supprimer toutes externalités
QCM || Émergence : du commun au privé — thèse néoclassique || V:Privatisation via recherche d’efficience|Toujours inefficiente|Aucun rapport avec incitations|Basée sur hasard
QCM || Hardin 1968 — tragédie : configuration || V:Accès libre + rivalité ⇒ surexploitation|Accès restreint + non‑rivalité ⇒ surexploitation|Ressource privée ⇒ toujours optimale|Rien à voir avec externalités
QCM || Solutions type Ostrom || V:Règles locales|V:Surveillance|V:Sanctions graduelles|Absence de participation
QCM || Pêcheries : leviers efficaces || V:Quotas individuels transférables|V:Lutte pêche illégale|Abandon de tout contrôle|V:Zones marines protégées
QCM || OPEP — risque de déviation : pourquoi ? || V:Incitation à surproduire quand prix ↑|Absence de coordination|Ressource infinie|Inexistence des coûts de contrôle
QCM || Piège : définition des biens communs || Excluables & rivaux|Non‑excluables & non‑rivaux|V:Non‑excluables & rivaux|Excluables & non‑rivaux
QCM || Propriété publique mondiale (idée) : objectifs || V:Stabilité des prix|V:Réinvestissement dans alternatives|Spéculation libre|Suppression des quotas
QCM || Which statements are TRUE? Property rights… || V:create invest incentives|always lower inequality|never need enforcement|V:clarify responsibilities
QCM || Cas pratique : forêt communale — que mettre en place d’abord ? || V:Règles d’accès + suivi|Rien|Subvention sans contrôle|Quota collectif sans sanction
`,Ne=`QCM || GATT → OMC : différences majeures || V:Intègre services & ADPIC|Ne traite que des tarifs|V:ORD (règlement différends) renforcé|Fin du multilatéralisme
QCM || OMC — missions || V:Cadre de règles & négociation|V:Administration des différends|Fixer les taux de change|Gérer les budgets nationaux
QCM || FMI — rôle || V:Stabilité du SMI & prêts en crise|Régir fiscalité mondiale|Fixer politique monétaire de l’UE|Gérer ADPIC
QCM || Banque mondiale — instruments || V:BIRD/AID/SFI/MIGA|Création de l’euro|Taux directeurs BCE|V:Garanties & assistance
QCM || ADPIC — correspond à… || V:Accord sur la propriété intellectuelle|Accord agricole|Accord sur tarifs douaniers|Accord de Doha
QCM || TSD — signifie pour PED || V:Traitement spécial & différencié|Taux spéciaux de douane|Taxe solidaire de développement|Transferts souverains directs
QCM || Rounds du GATT : objectif central || V:Réduire les barrières au commerce|Fixer l’or à 35$|Unifier la fiscalité|Créer la BCE
QCM || Piège : laquelle est FAUSSE ? || OMC coopère avec FMI/BM|ORD règle les différends|V:OMC fixe les changes|GATT né en 1947
`,Oe=`QCM || Laquelle est FAUSSE ? (institutions/organisations) || V:Une institution = organisme avec salariés|Institution = règles|Organisation = groupe poursuivant des objectifs|Co‑évolution fréquente
QCM || Asymétrie d’info — inversion || V:Sélection adverse après contrat|Aléa moral après contrat|Labels/garanties informent|Signaux coûtent
QCM || Biens : classification rapide || V:Commun = non‑excluable & rival|Public = non‑excluable & non‑rival|Privé = excluable & rival|Club = excluable & non‑rival
QCM || IFRS vs continental — énoncez le FAUX || Continental = prudence/patrimonialité|IFRS = investisseur/juste valeur|Comparabilité internationale|V:IFRS destinées d’abord à l’État
QCM || OMC/FMI/BM — qui fait quoi ? || V:OMC = règles du commerce & différends|V:FMI = stabilité SMI|V:BM = développement/projets|Fixer l’euro
QCM || Gouvernance — lequel n’appartient pas ? || Efficacité|Transparence|Responsabilisation|V:Opacité
QCM || IPC — énoncé FAUX || Laspeyres chaîné|Pondérations MAJ|V:Crédits immobiliers inclus|Ajustements hédoniques possibles
QCM || TCE — lequel est FAUX ? || Spécificité ↑ ⇒ intégration plus probable|Opportunisme pris en compte|V:Contrats inutiles|Arbitrage marché/hiérarchie/hybride
`,Ue=`QCM || INSEE — missions clés || V:Comptes nationaux/PIB/IPC|Fixer la politique monétaire|V:Recensements|V:Répertoires SIREN/SIRET/RNIPP/COG
QCM || Eurostat — rôle || V:Harmonisation UE & coordination SSE|Fixer les budgets nationaux|Collecter sans les États membres|V:Comparabilité internationale
QCM || INED — nature/missions || V:EPST de recherche démographique|Fixe la natalité par décret|V:Diffusion/formation|Production de l’IPC
QCM || IPC — construction || V:Indice de Laspeyres chaîné|V:Pondérations MAJ annuelles|Crédits immobiliers inclus|V:Ajustements hédoniques possibles
QCM || IPC — notions à ne pas confondre || V:« Shrinkflation » = quantité ↓ à prix constant|Objectif BCE 5 %|V:Pondérations reflètent budget moyen|Prix relevés en magasin & données de caisse
QCM || Indépendance/coordination || V:Autorité de la statistique publique (2008)|CNIL = organisme de l’INSEE|V:SSP coordonné par l’INSEE|Indice des loyers commerciaux existe
QCM || Eurostat — histoire brève || V:CECA → CEE → renforcement pour l’euro|Création 2010|Rôle inchangé depuis 1952|Sans lien avec indicateurs européens
QCM || INSEE à Metz ? || V:Oui, déménagement partiel de services|Non, jamais|Exclusivement à Lyon|Uniquement à Bercy
`,He=`### Version examen réaliste
QCM || Selon D. North, que sont les institutions ? || Règles techniques de production|Rituels religieux|V:Les règles du jeu (règles formelles et informelles) qui encadrent les interactions humaines|Des organisations au sens d’entreprises || Définition vue en cours.
QCM || Institution vs Organisation : laquelle est correcte ? || V:Les institutions = règles ; les organisations = groupes d’individus poursuivant des objectifs|Les deux sont strictement équivalents|Une organisation est toujours publique|V:Institutions et organisations interagissent et co-évoluent || Distinction centrale.
QCM || Gouvernance moderne (vision Banque mondiale années 1990) met l’accent surtout sur… || V:Efficacité, responsabilisation, participation, transparence|Hiérarchie verticale stricte|Monopole de l’État central|V:Réseaux d’acteurs et pouvoirs multicentrés || Caractéristiques clés.
QCM || Asymétrie d’information : conséquence classique ? || Hausse automatique de la qualité|V:Sélection adverse|Pas d’impact sur le marché|V:Aléa moral || Deux conséquences majeures.
QCM || Théorie du signal (Spence/Arrow) : le diplôme fonctionne comme… || V:Un signal coûteux crédible de qualité pour l’employeur|Une garantie légale d’emploi|Une assurance chômage|V:Un tri entre candidats lorsque l’info est imparfaite || Idée de signal coûteux.
QCM || Droits de propriété : fonction économique principale || Réduire l’épargne des ménages|V:Fournir des incitations à créer, conserver et valoriser des actifs|Augmenter les taxes|Ralentir l’innovation || Incitations et efficience.
QCM || Tragédie des biens communs (Hardin) : situation typique || V:Accès libre + rivalité d’usage ⇒ sur‑exploitation|Accès restreint + non‑rivalité ⇒ sous‑utilisation|V:Externalités et coûts de transaction élevés|Monopole privé ⇒ disparition du bien commun || Sur‑exploitation.
QCM || INSEE : mission clé || Fixer la politique monétaire|Rédiger le budget de l’État|V:Mesurer et publier les principaux indicateurs (PIB, chômage, IPC…)|Fixer l’impôt sur le revenu || Rôle statistique public.
QCM || IFRS : finalité prioritaire selon l’IASB || V:Informer utilement les investisseurs (comparabilité/transparence)|Uniquement préserver les créanciers|Supprimer toute volatilité comptable|V:Diffuser un langage comptable commun mondial || Orientation investisseurs.
QCM || OMC : rôle central || V:Cadre de règles, négociation, règlement des différends|Fixer les taux de change|Gérer les budgets nationaux|Émettre des DTS || Mandat commercial multilatéral.

### Version complète
VF || Les institutions en économie regroupent des règles formelles ET informelles qui structurent les incitations. || V || North / BM.
VF || Une organisation (entreprise, syndicat, ONG) est identique à une institution. || F || Distinction vue en cours.
VF || La gouvernance contemporaine privilégie l’analyse en réseaux d’acteurs plutôt qu’un schéma strictement hiérarchique. || V || Approche multicentrée.
VF || L’asymétrie d’information peut mener à la sélection adverse sur le marché des voitures d’occasion. || V || Exemple classique.
VF || L’aléa moral survient après signature d’un contrat quand le comportement change. || V || Assurances, santé…
VF || Les droits de propriété clairs favorisent l’efficience via les incitations. || V || Incitations & coûts de transaction.
VF || La tragédie des biens communs n’existe que pour les biens non rivaux. || F || Biens communs = non‑excluables + rivaux.
VF || L’INSEE fixe les politiques publiques au Parlement. || F || Produit de la donnée/statistique.
QCM || Institution vs organisation : choisir les vraies affirmations || V:Institution = règle du jeu|V:Organisation = groupe poursuivant des objectifs|Institution = forcément publique|Organisation = forcément privée || Double vrai / doubles faux.
QCM || Gouvernance : quelles caractéristiques modernes ? || Centralisation étatique exclusive|V:Partenariats & pluralité d’acteurs|V:Pouvoirs multicentrés|Rupture totale avec l’État || Réseaux d’acteurs.
QCM || Asymétrie : quelles issues possibles ? || V:Labels, garanties, régulation|Suppression de l’information|V:Contrats/franchises pour limiter l’aléa moral|Hausse automatique des prix de qualité || Outils correctifs.
QCM || Théorie du signal : exemples de signaux || V:Diplôme sur marché du travail|V:Garantie vendeur voiture d’occasion|Subvention publique|Interdiction pure et simple || Signaux coûteux/crédibles.
QCM || Droits de propriété : niveau d’analyse || V:Individuel (incitations d’usage)|V:Organisation (séparation propriété/contrôle)|V:Système économique (privatisations/nationalisations)|Aucun niveau pertinent || Trois niveaux vus.
QCM || Biens & propriété : alternatives à la privatisation || V:Propriété publique mondiale (cas pétrole, quotas)|V:Gestion collective (quotas pêche, sanctions)|Interdiction de consommer tout bien rival|Taxe unique universelle || Solutions institutionnelles.
QCM || INSEE : quelles missions ? || V:Recensement, enquêtes ménages/entreprises|V:Publication IPC, ILC, chômage, pauvreté|Fixer le SMIC|V:Gestion de répertoires (SIREN/SIRET, RNIPP, COG) || Missions listées.
QCM || Eurostat : rôle || V:Office statistique de l’UE (comparaison pays/régions)|Collecte directe brute sans États membres|V:Centralise les données des instituts nationaux|Fixe les budgets nationaux || Centralisation/harmonisation.
QCM || INED : missions pluridisciplinaires || V:Études de populations FR/étranger|Production & diffusion de connaissances|Fixer la natalité par décret|V:Appui à la formation & expertise publique || Définition statutaire.
QCM || IFRS : caractéristiques || V:Cadre orienté investisseurs|V:Juste valeur (mark‑to‑market / modèles)|Pas d’auditeurs externes|V:Comparabilité internationale || Points clés.
QCM || OMC : éléments de gouvernance || V:Conférence ministérielle organe suprême|V:ORD pour différends|Banque centrale de l’UE|V:Accords couvrant biens/services/ADPIC || Structure et accords.
QCM || FMI : missions || V:Stabilité du SMI, prêts en crise, surveillance|Fixer les droits de l’Homme|V:Assistance technique/statistiques|Gérer la BCE || Mandat FMI.
QCM || Banque mondiale : instruments || V:Prêts, crédits concessionnels (AID), garanties|Création de monnaie nationale|V:SFI pour secteur privé|Fixe les taux de change || Instruments BM.
QCM || Think tanks & lobbying : définitions || V:Production d’idées/rapports d’influence|Contrôle juridictionnel des traités|V:Processus d’influence auprès d’institutions|Vote des lois à la place des parlements || Rôles.

### QCM Pièges & comparatifs
QCM || Laquelle est fausse ? (institutions/organisations) || V:Une institution est forcément une entité juridique dotée de salariés|Les institutions incluent règles formelles et informelles|Les organisations poursuivent des objectifs communs|Institutions et organisations co‑évoluent || Le piège = confusion institution/organisation.
QCM || Gouvernance vs Gouvernement : repérer l’énoncé faux || Gouvernement = pouvoir vertical hiérarchique|V:Gouvernance = retrait complet de l’État|Gouvernance moderne = réseaux & multicentres|Banque mondiale popularise le terme dans les 1990s || L’État ne disparaît pas.
QCM || Asymétrie : piège classique || V:Sélection adverse se produit après signature du contrat|Aléa moral survient après le contrat|Signaux réduisent l’incertitude|Labels/régulations informent || Inverser sélection/adverse vs aléa moral = piège.
QCM || Droits de propriété : lequel n’est pas un objectif ? || Inciter à valoriser les actifs|Réduire les coûts de transaction|V:Supprimer toute externalité|Clarifier l’allocation des droits || On ne supprime pas « toute » externalité.
QCM || Biens communs : proposition piégeuse || V:Les biens communs sont non‑rivaux et exclusifs|La tragédie résulte d’accès libre + rivalité|Privatisation n’est pas la seule solution|Gestion collective possible || Définition piégée.
QCM || IFRS vs modèle continental : repérer l’assertion fausse || Continental : prudence/patrimonialité|Anglo‑saxon/IFRS : décision investisseur|V:IFRS orientées d’abord vers État et créanciers|Harmonisation et comparabilité recherchées || Orientation investisseurs.
QCM || OMC/FMI/BM : qui fait quoi ? || V:OMC = commerce & différends|V:FMI = stabilité SMI & prêts en crise|Banque mondiale = lutte contre pauvreté/projets|V:BM = AID & SFI || Attribution correcte.
QCM || Think tanks & lobbying : énoncé faux || Think tank = idées/analyses|Lobbying = influence (formelle/informelle)|V:Lobbying réservé aux entreprises privées|Registres/encadrement existent (UE) || Pas réservé aux seules entreprises.

### Questions tombées en examen (2022, 2023, 2024)
`,ze=`# CH2 : L’Investissement - Banque de questions Text2Quiz

### Définitions et concepts de base
QR || En macroéconomie, l’investissement correspond à : || V:La formation brute de capital fixe (FBCF)|L’achat de titres financiers|La consommation des ménages|Les exportations nettes
VF || Les achats de logements neufs par les ménages sont comptabilisés comme de l’investissement. || V
VF || L’achat d’actions en Bourse est un investissement au sens macroéconomique. || F
QCM || L’investissement inclut : || V:Les acquisitions de biens de production durables|V:Les variations de stocks|L’achat de biens de consommation|Les transferts sociaux
Flashcard || Définition de FBCF || Valeur des acquisitions moins cessions d’actifs fixes (machines, bâtiments, logiciels).

### Typologies d’investissement
QCM || Les principales formes d’investissement sont : || V:Productif|V:Matériel|V:Immatériel|Consommation finale
QR || L’investissement de remplacement correspond à : || V:Remplacer le capital usé ou obsolète|Augmenter le stock de capital|Créer de nouveaux produits|Importer du capital étranger
QR || L’investissement de capacité vise à : || V:Augmenter la production possible|Maintenir le niveau existant|Diminuer l’offre|Réduire la consommation
QR || L’investissement de productivité vise à : || V:Améliorer l’efficacité du capital et réduire les coûts unitaires|Augmenter la consommation|Remplacer uniquement le travail|Réduire la concurrence
Flashcard || Investissement matériel || Actifs physiques (machines, bâtiments). 
Flashcard || Investissement immatériel || R&D, logiciels, formation, publicité.

### Déterminants de l’investissement
QCM || Les déterminants de l’investissement sont : || V:Le niveau de la demande anticipée|V:Le coût du capital (taux d’intérêt)|V:La profitabilité attendue|V:Les innovations technologiques
VF || Le taux d’intérêt influence l’investissement car il modifie le coût d’opportunité du capital. || V
Trous || Le principe de l’accélérateur stipule que l’investissement dépend des {{V:variations de la demande|variations des prix}}.
Flashcard || Principe de l’accélérateur (Clark, 1917) || Une hausse de la demande entraîne une hausse plus que proportionnelle de l’investissement.
Flashcard || Théorie du q de Tobin || Investir tant que la valeur boursière de l’entreprise > coût de remplacement du capital.

### Théories économiques
Flashcard || Keynes et l’investissement || Dépend de l’efficacité marginale du capital et du taux d’intérêt.
Flashcard || Classiques et néoclassiques || L’investissement dépend du taux d’intérêt (prix du capital).
Flashcard || Modèles modernes || Intègrent anticipations, incertitude et rôle de la politique économique.
QR || Selon Keynes, l’investissement est déterminé par : || V:L’efficacité marginale du capital et le taux d’intérêt|Uniquement le revenu permanent|La consommation relative|Les exportations nettes

### Liens macroéconomiques
QCM || L’investissement joue un rôle central car il influence : || V:La demande globale|V:L’offre future|V:Le progrès technique|La consommation immédiate uniquement
VF || L’investissement est une composante volatile de la demande globale. || V
Trous || L’investissement a un double rôle : {{V:demande à court terme|épargne à long terme}} et {{V:offre future|consommation présente}}.
Flashcard || Multiplicateur de l’investissement || Un investissement initial entraîne une variation plus que proportionnelle du revenu national.

### Réflexion (type examen)
QR || Pourquoi l’investissement est-il considéré comme un facteur de croissance économique à long terme ? || V:Car il augmente le stock de capital et favorise le progrès technique|Car il réduit toujours la consommation|Car il accroît le chômage|Car il supprime les gains de productivité
QRC || Cite deux limites au principe de l’accélérateur. || La demande peut être instable|Les entreprises peuvent anticiper et lisser leurs investissements
Flashcard || Réflexion : Quel est l’impact d’un taux d’intérêt très élevé sur l’investissement ? || Il décourage l’investissement car le coût du capital augmente et la rentabilité attendue diminue.
Flashcard || Réflexion : En quoi l’investissement immatériel est-il crucial aujourd’hui ? || Il favorise l’innovation, la compétitivité et la croissance durable.
`,Ge=`# macro
QR || Au sens strict, la consommation correspond à : || V:La destruction de biens ou services par l’usage à des fins de satisfaction directe|L’accumulation de patrimoine|L’investissement net|La production publique
QR || En macro, la consommation inclut : || V:Les biens et services achetés par les ménages|Les biens autoconsommés par les ménages|Les services non marchands individualisables payés partiellement|Les services publics totalement gratuits
VF || La consommation finale inclut les services gratuits fournis par l’État (ex : école primaire). || F
VF || La consommation élargie inclut les services gratuits publics comme l’enseignement et la santé. || V
QCM || La consommation d’un pays inclut : || V:Les biens et services marchands achetés ou autoconsommés|V:Les services non marchands individualisables partiellement payés|Les exportations nettes|Tous les services publics gratuits
QRC || Donne la formule du revenu disponible brut (Yd). || Revenu primaire + prestations sociales - prélèvements obligatoires|Revenu primaire + transferts nets - impôts
Trous || Le revenu disponible brut (Yd) sert à {{V:la consommation finale|l’investissement net}} et {{V:l’épargne|la dette}}.
Flashcard || Équilibre emploi-ressource au niveau des ménages || Ressources = Revenu disponible brut (Yd) = Consommation finale + Épargne
QCM || La classification par durabilité distingue : || V:Biens durables|V:Biens semi-durables|V:Biens non durables|Services collectifs gratuits
QR || Le coefficient budgétaire bi correspond à : || V:(Ci/C) × 100|C/Ci × 100|Ci - C|C - Ci
Flashcard || Loi d’Engel (1857) || Dépenses alimentaires ↓ proportionnellement au revenu, logement et habillement suivent, autres dépenses ↑ plus vite.
Trous || La propension marginale à consommer (PmC) correspond à {{V:la part de revenu supplémentaire consacrée à la consommation|la variation relative du revenu}}.
QCM || La propension moyenne à consommer (PMC) : || V:Est décroissante avec le revenu|Est constante dans le temps|Est croissante avec le revenu|Est indépendante du revenu
VF || Selon Keynes, la consommation augmente moins vite que le revenu. || V
QCM || Selon Keynes, la fonction de consommation peut être : || V:Linéraire|V:Affine|V:Concave|Exponentielle
QR || Dans la fonction affine keynésienne, Co correspond à : || V:La consommation incompressible|L’investissement autonome|Le revenu permanent|L’épargne nette
Flashcard || Effet de cliquet (Duesenberry, 1948) || La consommation dépend aussi du plus haut revenu passé atteint.
Flashcard || Effet d’inertie (Brown, 1952) || La consommation dépend de celle de la période précédente.
Flashcard || Effet de démonstration (Duesenberry, 1949) || Effet d’imitation → dépend du revenu relatif par rapport aux autres.
Flashcard || Théorie du cycle de vie (Modigliani, Brumberg, 1954) || Consommation lissée sur la vie. Patrimoine en bosse : max à la retraite, décroît ensuite.
Flashcard || Théorie du revenu permanent (Friedman, 1957) || Consommation dépend du revenu permanent anticipé (moyenne actualisée des revenus).
Trous || Dans la théorie du revenu permanent, Yp = {{V:la somme consommable en maintenant le capital constant|le revenu courant}}.
QCM || Déterminants de l’épargne à court terme : || V:Pouvoir d’achat|V:Taux de chômage|V:Inflation|V:Taux d’intérêt
QCM || Déterminants de l’épargne à long terme : || V:Vieillissement de la population|V:Système de retraite|Exportations nettes|Progrès technique
VF || Une inflation élevée peut entraîner à court terme une baisse de l’épargne (fuite devant la monnaie). || V
VF || À long terme, une inflation élevée peut entraîner une hausse de l’épargne (effet d’encaisses réelles). || V
QR || Selon la loi d’Engel, que se passe-t-il pour la part des dépenses alimentaires quand le revenu augmente ? || V:Elle diminue|Elle augmente proportionnellement|Elle reste constante
QCM || Compare Keynes et Kuznets : || V:Keynes → PmC < PMC à long terme|V:Kuznets → PmC ≈ PMC (relation linéaire)|Keynes → relation linéaire stricte|Kuznets → PmC décroissante
TrousRC || Donne deux critiques de la fonction de consommation keynésienne. || Sous-estimation de la consommation d’après-guerre|Contradictions entre séries courtes et longues
Flashcard || Réflexion : Pourquoi l’effet de cliquet est-il utile pour comprendre les récessions ? || Car la consommation baisse moins vite que le revenu, soutenant la demande malgré la crise.
Flashcard || Réflexion : Quelles différences entre PmC et PMC ? || PmC = variation conso/revenu (court terme). PMC = part du revenu total consacré à la consommation (long terme).
`,Ke=Object.assign({"./cours/CH1_Consommation_EXP_v2.txt":Qe,"./cours/Examen_Macro_Fidele.txt":ye,"./cours/HPE/HPE_Malthus.txt":Le,"./cours/HPE/HPE_Marshall.txt":Se,"./cours/HPE/HPE_Marx.txt":Fe,"./cours/HPE/HPE_MengerJevons.txt":Ee,"./cours/HPE/HPE_Pareto.txt":Pe,"./cours/HPE/HPE_Ricardo.txt":Ie,"./cours/HPE/HPE_Smith.txt":Re,"./cours/HPE/HPE_Walras.txt":Ae,"./cours/HPE/PartielsQCM/HPE2024.txt":_e,"./cours/INSTIT/INSTIT_Examen_2023.txt":Te,"./cours/INSTIT/INSTIT_Examen_2024.txt":ke,"./cours/INSTIT/TRAIN_Asymetrie_Signaux_v1.txt":we,"./cours/INSTIT/TRAIN_Comptabilite_IFRS_v1.txt":je,"./cours/INSTIT/TRAIN_CoutsTransaction_v1.txt":De,"./cours/INSTIT/TRAIN_Definitions_Gouvernance_v1.txt":Be,"./cours/INSTIT/TRAIN_DroitsPropriete_Communs_v1.txt":$e,"./cours/INSTIT/TRAIN_OMC_FMI_BM_v1.txt":Ne,"./cours/INSTIT/TRAIN_Pieges_Comparatifs_v1.txt":Oe,"./cours/INSTIT/TRAIN_Stats_IPC_v1.txt":Ue,"./cours/INST_QCM_Complet_v2.txt":He,"./cours/MacroCH2.txt":ze,"./cours/macroCH1.txt":Ge}),Q=Object.entries(Ke).map(([n,e])=>{const t=n.split("/"),i=t.pop(),s=t.pop()??"(Sans matière)",l=i.replace(/\.txt$/i,""),a=qe(l.replace(/[-_]/g," "));return{path:n,file:i,label:a,content:e,folder:s}}).sort((n,e)=>n.label.localeCompare(e.label)),oe="t2q_stats_v2";function M(n,e=0,t=1){return Math.max(e,Math.min(t,n))}const K=[0,1,3,7,14,30];function le(){try{return JSON.parse(localStorage.getItem(oe)||"{}")}catch{return{}}}function Ye(n){localStorage.setItem(oe,JSON.stringify(n))}function We(n){const e=Date.now(),t=n.strength??0;if(t>=1){const d=30*Math.max(1,n.box||1);return e+d*24*3600*1e3}const i=Math.round(M(t,0,.999)*(K.length-1)),s=K[i]||1,l=n.lastSeverity??1,a=l>.6?.5:l>.3?.75:1,o=e+Math.max(.1,s*a)*24*3600*1e3;return Math.round(o)}function Je(n){return n==="mild"?1:n==="medium"?2:3}function Xe(n){return n<=.25?"mild":n<=.6?"medium":"severe"}function ue(n,e){if(n.type==="VF"){const t=e.kind==="VF"&&e.value&&e.value===n.vf,i=e.timeMs||0,s=M((i-3e3)/7e3,0,1)*.35;return M((t?0:1)+(t?s*.5:s))}if(n.type==="QR"){const t=e.kind==="QR"&&e.value&&Ze(e.value,n),i=e.timeMs||0,s=M((i-3e3)/7e3,0,1)*.35;return M((t?0:1)+(t?s*.5:s))}if(n.type==="QCM"){const t=n.answers??[],i=new Set(t.filter(p=>p.correct).map(p=>p.text)),s=new Set(t.filter(p=>!p.correct).map(p=>p.text)),l=new Set((e.kind==="QCM"?e.values:[])??[]);let a=0,o=0;for(const p of l)s.has(p)&&a++;for(const p of i)l.has(p)||o++;const d=Math.max(1,t.length),u=(a+o)/d,f=e.timeMs||0,C=M((f-3e3)/7e3,0,1)*.35;return M(u+(u===0?C*.5:C))}return 1}function Ze(n,e){return n&&e.type==="QR"&&e.answers?e.answers.some(t=>t.text===n):!1}function T(n,e,t,i){const s=j(n),l=le(),a=l[s]||{box:1,streak:0,last:0,next:0,required:1,lastSeverity:void 0,seen:0,correct:0,strength:0,avgTimeMs:0};if(a.seen=(a.seen||0)+1,a.correct=(a.correct||0)+(e?1:0),e||(a.correct=Math.max(0,(a.correct||0)-.5)),typeof i=="number"){const f=a.avgTimeMs||0,C=1/Math.min(a.seen,10);a.avgTimeMs=Math.round(f*(1-C)+i*C)}if(e){a.streak+=1;const f=Math.max(1,a.required||1);a.streak>=f&&(a.box=Math.min(a.box+1,5),a.streak=0,a.required=1)}else{const f=Xe(t),C=f==="mild"?1:f==="medium"?2:3;a.box=Math.max(1,a.box-C),a.streak=0,a.required=Je(f)}const o=a.required||5,d=M((a.correct||0)/o),u=a.avgTimeMs?M((a.avgTimeMs-3e3)/7e3,0,.8):0;a.strength=M(d*(1-u)),a.lastSeverity=t,a.last=Date.now(),a.next=We(a),l[s]=a,Ye(l)}function Y(n){const e=le()[j(n)];return!e||e.next<=Date.now()}const g=(n,e=document)=>e.querySelector(n),I=(n,e=document)=>Array.from(e.querySelectorAll(n)),c={selectMatiere:g("#matiere"),selectCours:g("#cours"),selectThemes:g("#themes"),inputNombre:g("#nombre"),radiosMode:I('input[name="mode"]'),btnStart:g("#start"),root:g("#quiz-root"),themeToggle:g("#theme-toggle")},v={btnExplorer:g("#btn-explorer"),fileBrowser:g("#file-browser"),fbFolders:g("#fb-folders"),fbFiles:g("#fb-files"),fbClose:g("#fb-close"),qcmView:g("#qcm-view"),qcmRoot:g("#qcm-root"),qcmClose:g("#qcm-close")},r={mode:"entrainement",file:"",n:10,questions:[],userAnswers:[],correctMap:[],index:0,corrige:!1,lastCorrect:!1,selectedThemes:[],round:1,allPool:[],questionStart:null};en();function en(){var i;const n=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,e=localStorage.getItem("t2q-theme"),t=e?e==="dark":n;document.documentElement.setAttribute("data-theme",t?"dark":"light"),c.themeToggle&&(c.themeToggle.checked=t),(i=c.themeToggle)==null||i.addEventListener("change",()=>{const s=!!c.themeToggle.checked;document.documentElement.setAttribute("data-theme",s?"dark":"light"),localStorage.setItem("t2q-theme",s?"dark":"light")})}nn();function nn(){const n=Array.from(new Set(Q.map(e=>e.folder))).sort((e,t)=>e.localeCompare(t));if(c.selectMatiere){c.selectMatiere.innerHTML="";const e=document.createElement("option");e.value="",e.textContent="— Toutes les matières —",c.selectMatiere.appendChild(e);for(const t of n){const i=document.createElement("option");i.value=t,i.textContent=t,c.selectMatiere.appendChild(i)}c.selectMatiere.addEventListener("change",()=>k(c.selectMatiere.value))}k("")}function k(n){if(!c.selectCours)return;c.selectCours.innerHTML="";const e=n?Q.filter(t=>t.folder===n):Q;if(e.length===0){const t=document.createElement("option");t.disabled=!0,t.textContent="— Aucun cours —",c.selectCours.appendChild(t);return}for(const t of e){const i=document.createElement("option");i.value=t.path,i.textContent=`${t.label}${n?"":` (${t.folder})`}`,c.selectCours.appendChild(i)}c.selectCours.value=e[0].path,r.file=e[0].path,ce(r.file)}var ee;(ee=c.selectCours)==null||ee.addEventListener("change",()=>{r.file=c.selectCours.value,ce(r.file)});function ce(n){const e=Q.find(l=>l.path===n||l.file===n);if(!e){J([]);return}const t=ae(e.content),i=_(t),s=new Set;i.forEach(l=>(l.tags??[]).forEach(a=>s.add(a))),J(Array.from(s).sort((l,a)=>l.localeCompare(a)))}function tn(){if(!v.fileBrowser||!v.fbFiles||!v.fbFolders)return;v.fbFiles.innerHTML="",v.fbFolders.innerHTML="";const n=document.createElement("div");n.className="fb-toolbar";const e=document.createElement("select");e.innerHTML='<option value="">Tous les thèmes</option><option value="classique">Classique</option><option value="marginaliste">Marginaliste</option><option value="autre">Autre</option>',n.appendChild(e),v.fbFiles.appendChild(n);const t=new Map;for(const i of Q){const s=t.get(i.folder)||[];s.push(i),t.set(i.folder,s)}for(const[i,s]of t){const l=document.createElement("div");l.className="fb-folder",l.style.padding="6px",l.style.cursor="pointer",l.textContent=i,l.addEventListener("click",()=>{Array.from(v.fbFolders.children).forEach(a=>a.classList.remove("active")),l.classList.add("active"),w(i,s)}),v.fbFolders.appendChild(l)}v.fileBrowser.style.display="block"}function de(){v.fileBrowser&&(v.fileBrowser.style.display="none")}var ne;(ne=v.btnExplorer)==null||ne.addEventListener("click",tn);var te;(te=v.fbClose)==null||te.addEventListener("click",de);function me(n){return`t2q_layout_${n.replace(/[^a-z0-9]/gi,"_")}`}function W(n,e){localStorage.setItem(me(n),JSON.stringify(e))}function sn(n){try{return JSON.parse(localStorage.getItem(me(n))||"null")}catch{return null}}function w(n,e){if(!v.fbFiles)return;v.fbFiles.innerHTML="";const t=sn(n);let i;t?i=t:i=[e.map(o=>o.path)];const s=document.createElement("div");s.style.display="flex",s.style.flexDirection="column",s.style.gap="8px";function l(o,d){const u=document.createElement("div");u.className="fb-row",u.style.display="flex",u.style.gap="8px",u.style.alignItems="stretch",u.style.minHeight="48px",u.style.border="1px dashed var(--brd)",u.style.padding="6px",u.dataset.row=String(o);const f=Math.max(1,d.length),C=`calc(${Math.floor(100/f)}% - ${8*(f-1)/f}px)`;for(const p of d){const b=e.find(q=>q.path===p);if(!b)continue;const m=document.createElement("div");m.className="fb-card",m.draggable=!0,m.style.flex=`0 0 ${C}`,m.style.border="1px solid var(--brd)",m.style.padding="8px",m.style.borderRadius="6px",m.style.background="transparent",m.textContent=b.label,m.dataset.path=b.path,m.addEventListener("dragstart",q=>{q.dataTransfer.setData("text/plain",b.path),m.classList.add("dragging")}),m.addEventListener("dragend",()=>{m.classList.remove("dragging")}),m.addEventListener("click",async()=>{r.file=b.path,c.selectMatiere&&(c.selectMatiere.value=b.folder),k(b.folder),c.selectCours.value=b.path,await fe(),pe(),de()}),u.appendChild(m)}return u.addEventListener("dragover",p=>{p.preventDefault(),u.classList.add("drag-over")}),u.addEventListener("dragleave",()=>{u.classList.remove("drag-over")}),u.addEventListener("drop",p=>{p.preventDefault(),u.classList.remove("drag-over");const b=p.dataTransfer.getData("text/plain");if(b){for(const m of i){const q=m.indexOf(b);if(q!==-1){m.splice(q,1);break}}i[o].push(b),i=i.filter(m=>m.length>0),W(n,i),w(n,e)}}),u}i.forEach((o,d)=>s.appendChild(l(d,o)));const a=document.createElement("button");a.className="secondary",a.textContent="Ajouter une ligne",a.addEventListener("click",()=>{i.push([]),W(n,i),w(n,e)}),v.fbFiles.appendChild(s),v.fbFiles.appendChild(a)}function pe(){if(!v.qcmView||!v.qcmRoot)return;const n=r.questions[r.index];n&&(v.qcmRoot.innerHTML=`
    <div class="card--q">
      <h3>Question ${r.index+1}</h3>
      <div class="block">${h(n.question)}</div>
      <div class="options">${(n.answers??[]).map(e=>`
        <label class="opt"><input type="radio" name="qcm-view" value="${U(e.text)}"/> <span class="label">${h(e.text)}</span></label>`).join("")}</div>
      <div style="margin-top:12px"><button id="qcm-validate" class="primary">Valider</button></div>
    </div>
  `,v.qcmView.style.display="block",setTimeout(()=>{var e;(e=g("#qcm-validate"))==null||e.addEventListener("click",()=>{var s,l;const t=((s=document.querySelector('input[name="qcm-view"]:checked'))==null?void 0:s.value)??null;if(!t)return;Array.from(document.querySelectorAll('.options input[type="checkbox"]')).forEach(a=>{a.checked=a.value===t}),(l=g("#btn-valider"))==null||l.click(),ve()})},0))}function ve(){v.qcmView&&(v.qcmView.style.display="none")}var ie;(ie=v.qcmClose)==null||ie.addEventListener("click",ve);const an=be;function rn(n,e){an(n,e);const t=document.createElement("button");t.className="secondary",t.style.marginLeft="8px",t.textContent="Ouvrir en page",setTimeout(()=>{const i=document.querySelector(".block.actions");i&&i.appendChild(t),t.addEventListener("click",pe)},0)}window.renderQCM=rn;function J(n){if(c.selectThemes){if(c.selectThemes.innerHTML="",n.length===0){const e=document.createElement("option");e.disabled=!0,e.textContent="— Aucun thème détecté —",c.selectThemes.appendChild(e);return}for(const e of n){const t=document.createElement("option");t.value=e,t.textContent=e,c.selectThemes.appendChild(t)}}}function on(){var e;return Array.from(((e=c.selectThemes)==null?void 0:e.selectedOptions)??[]).map(t=>t.value).filter(Boolean)}function ln(){const n=c.radiosMode.find(e=>e.checked);return(n==null?void 0:n.value)??"entrainement"}var se;(se=c.btnStart)==null||se.addEventListener("click",fe);async function fe(){r.mode=ln(),r.n=Math.max(1,parseInt(c.inputNombre.value||"10",10)),r.selectedThemes=on();const n=o=>o.replace(/\\/g,"/"),e=n(r.file||"");let t=Q.find(o=>n(o.path)===e||n(o.file)===e);if(t||(t=Q.find(o=>n(o.path).endsWith(e)||e.endsWith(n(o.file)))),!t)return console.warn("Available course paths:",Q.map(o=>o.path)),X(`Cours introuvable : ${r.file}`);let i=_(ae(t.content));if(r.selectedThemes.length>0&&(i=i.filter(o=>(o.tags??[]).some(d=>r.selectedThemes.includes(d))),i=_(i)),i.length===0)return X("Aucune question ne correspond aux thèmes sélectionnés.");const s=i.filter(Y),l=i.filter(o=>!Y(o));S(s),S(l);const a=[];for(const o of[s,l]){for(const d of o)if(a.length<r.n)a.push(d);else break;if(a.length>=r.n)break}r.allPool=i.slice(),r.questions=a;for(const o of r.questions)O(o),(o.type==="QCM"||o.type==="QR")&&o.answers&&S(o.answers);r.round=1,ge(r.questions.length),R()}function ge(n){r.index=0,r.corrige=!1,r.lastCorrect=!1,r.userAnswers=new Array(n).fill(null),r.correctMap=new Array(n).fill(null)}function X(n){c.root.innerHTML=`<div class="card"><strong>Erreur :</strong> ${h(n)}</div>`,F(!1)}function un(){const n=r.questions.length||1,e=Math.min(r.index,n);return`<div class="progress"><div class="progress__bar" style="width:${Math.floor(e/n*100)}%"></div></div>`}function R(){const n=r.index>=r.questions.length,e=`
    <div class="head">
      <div><span class="badge">${h(r.file)}</span></div>
      <div>Mode : <strong>${r.mode==="entrainement"?"Entraînement":"Examen"}</strong></div>
      <div>Tour : <strong>${r.round}</strong></div>
      <div>Progression : <strong>${Math.min(r.index+1,r.questions.length)} / ${r.questions.length}</strong></div>
    </div>
    ${un()}
  `;if(n)return F(!1),pn(e);const t=r.questions[r.index];if(O(t),r.index<r.questions.length&&!r.corrige)try{r.questionStart=performance.now()}catch{r.questionStart=Date.now()}else r.questionStart=null;t.type==="QR"?cn(e,t):t.type==="QCM"?window.renderQCM?window.renderQCM(e,t):be(e,t):t.type==="VF"&&dn(e,t)}function D(n){if(n.type==="VF")return"Choisis Vrai ou Faux.";const e=Me(n);return n.type==="QR"?"Sélectionne la bonne réponse.":n.type==="QCM"?e>1?"Plusieurs réponses possibles — coche toutes les bonnes.":"Une ou plusieurs réponses possibles.":""}function cn(n,e){var i;const t=(e.answers??[]).map(s=>{var a,o;let l="opt";if(r.corrige){const d=((a=r.userAnswers[r.index])==null?void 0:a.value)===s.text;s.correct&&(l+=" good"),!s.correct&&d&&(l+=" bad")}return`
      <label class="${l}">
        <input type="radio" name="qr" value="${U(s.text)}" ${r.corrige?"disabled":""}/>
        <span class="label">${h(s.text)}</span>
        ${r.corrige?P(s.correct,((o=r.userAnswers[r.index])==null?void 0:o.value)===s.text):""}
      </label>`}).join("");c.root.innerHTML=`
    ${n}
    <div class="card--q" id="qcard">
      <div class="qtitle">Question ${r.index+1}</div>
      <div class="block">${h(e.question)}</div>
      <div class="hint"><small class="muted">${D(e)}</small></div>
      <div class="options">${t}</div>
      <div class="block actions">${B(e)}</div>
    </div>
  `,I('input[name="qr"]').forEach(s=>s.addEventListener("change",y)),$(e),y(),(i=document.getElementById("qcard"))==null||i.scrollTo({top:0,behavior:"smooth"})}function be(n,e){var s,l;const t=((s=r.userAnswers[r.index])==null?void 0:s.kind)==="QCM"?r.userAnswers[r.index].values:[],i=(e.answers??[]).map(a=>{const o=t!=null&&t.includes(a.text)?"checked":"";let d="opt";return r.corrige&&(a.correct&&(d+=" good"),!a.correct&&(t!=null&&t.includes(a.text))&&(d+=" bad")),`
      <label class="${d}">
        <input type="checkbox" value="${U(a.text)}" ${r.corrige?"disabled":""} ${o}/>
        <span class="label">${h(a.text)}</span>
        ${r.corrige?P(a.correct,t==null?void 0:t.includes(a.text)):""}
      </label>`}).join("");c.root.innerHTML=`
    ${n}
    <div class="card--q" id="qcard">
      <div class="qtitle">Question ${r.index+1}</div>
      <div class="block">${h(e.question)}</div>
      <div class="hint"><small class="muted">${D(e)}</small></div>
      <div class="options">${i}</div>
      <div class="block actions">${B(e)}</div>
    </div>
  `,I('.options input[type="checkbox"]').forEach(a=>a.addEventListener("change",y)),$(e),y(),(l=document.getElementById("qcard"))==null||l.scrollTo({top:0,behavior:"smooth"})}function dn(n,e){var t,i,s;c.root.innerHTML=`
    ${n}
    <div class="card--q" id="qcard">
      <div class="qtitle">Question ${r.index+1}</div>
      <div class="block">${h(e.question)}</div>
      <div class="hint"><small class="muted">${D(e)}</small></div>
      <div class="options options--inline">
        <label class="opt">
          <input type="radio" name="vf" value="V" ${r.corrige?"disabled":""}/>
          <span>Vrai</span>
          ${r.corrige?P(e.vf==="V",((t=r.userAnswers[r.index])==null?void 0:t.value)==="V"):""}
        </label>
        <label class="opt">
          <input type="radio" name="vf" value="F" ${r.corrige?"disabled":""}/>
          <span>Faux</span>
          ${r.corrige?P(e.vf==="F",((i=r.userAnswers[r.index])==null?void 0:i.value)==="F"):""}
        </label>
      </div>
      <div class="block actions">${B(e)}</div>
    </div>
  `,I('input[name="vf"]').forEach(l=>l.addEventListener("change",y)),$(e),y(),(s=document.getElementById("qcard"))==null||s.scrollTo({top:0,behavior:"smooth"})}function B(n){return r.mode==="entrainement"&&r.corrige?mn(n,r.lastCorrect,n.type==="QCM"):'<button class="primary" id="btn-valider" disabled>Valider</button>'}function $(n){const e=g("#btn-valider");e==null||e.addEventListener("click",()=>{const{ok:t,ua:i}=he(n);if(!t||!i)return;const s=r.questionStart??(performance.now?performance.now():Date.now()),l=Math.max(0,Math.round((performance.now?performance.now():Date.now())-s));i.timeMs=l,r.userAnswers[r.index]=i;const a=hn(n,i),o=ue(n,i);r.mode==="entrainement"?(r.lastCorrect=a,r.correctMap[r.index]=a,T(n,a,o,i.timeMs),r.corrige=!0,R(),F(!0)):(r.corrige=!1,T(n,a,o,i.timeMs),N())}),F(r.mode==="entrainement"&&r.corrige)}let Z=!1;Z||(document.addEventListener("keydown",n=>{const e=document.getElementById("btn-valider"),t=document.getElementById("fab-next");n.key==="Enter"&&e&&!e.disabled?(e.click(),n.preventDefault()):(n.key.toLowerCase()==="n"||n.key===" ")&&t&&!t.disabled&&t.style.display!=="none"&&(t.click(),n.preventDefault())}),Z=!0);function P(n,e){return n?'<span class="mark mark--good" title="Bonne réponse">✓</span>':e?'<span class="mark mark--bad" title="Mauvais choix">✗</span>':""}function mn(n,e,t=!1){const i=e?"Correct !":"Incorrect.",s=`${t?"Bonne(s) réponse(s)":"Bonne réponse"} : ${h(re(n))}`,l=!!n.explication&&n.explication.trim().length>0,a='<button class="secondary" id="btn-suivant">Suivant</button>';return setTimeout(()=>{var o;(o=g("#btn-suivant"))==null||o.addEventListener("click",N)},0),l?`
    <details class="feedback ${e?"ok":"ko"}" open>
      <summary>${i} — <strong>${s}</strong></summary>
      <div class="block"><small class="muted">${h(n.explication)}</small></div>
      ${a}
    </details>
  `:`
      <div class="feedback ${e?"ok":"ko"}">
        <strong>${i}</strong>
        <div class="block"><strong>${s}</strong></div>
        ${a}
      </div>
    `}function F(n){let e=document.getElementById("fab-next");e||(e=document.createElement("button"),e.id="fab-next",e.className="fab-next",e.textContent="Suivant",document.body.appendChild(e),e.addEventListener("click",N)),e.disabled=!n,e.style.display=n?"inline-flex":"none"}function N(){r.mode==="entrainement"&&!r.corrige||(r.corrige=!1,r.lastCorrect=!1,r.index+=1,R())}function pn(n){var t;const e=[];if(r.mode==="entrainement"?r.questions.forEach((i,s)=>{r.correctMap[s]===!1&&e.push(i)}):r.questions.forEach((i,s)=>{const l=r.userAnswers[s];let a=!1,o=1;l&&(i.type==="QR"?a=V(i,{value:l.kind==="QR"?l.value:null}):i.type==="QCM"?a=V(i,{values:l.kind==="QCM"?l.values:[]}):i.type==="VF"&&(a=V(i,{value:l.kind==="VF"?l.value:null})),o=ue(i,l)),a||e.push(i),T(i,a,o)}),e.length>0){S(e);for(const i of e)O(i),(i.type==="QCM"||i.type==="QR")&&i.answers&&S(i.answers);r.questions=e,r.round+=1,ge(e.length),c.root.innerHTML=`
      ${n}
      <div class="card">
        <h2>Rattrapage</h2>
        <p>Tu dois corriger ${e.length} question(s) avant de poursuivre.</p>
        <button class="primary" id="btn-continue">Reprendre</button>
      </div>
    `,(t=g("#btn-continue"))==null||t.addEventListener("click",R);return}return bn(n)}function vn(n){const e=(n.tags??[]).map(t=>t.trim()).filter(Boolean);return e.length>0?e:["(Sans thème)"]}function fn(n,e){const t=new Map;n.forEach((s,l)=>{const a=e[l];let o=!1;a&&(s.type==="QR"?o=V(s,{value:a.kind==="QR"?a.value:null}):s.type==="QCM"?o=V(s,{values:a.kind==="QCM"?a.values:[]}):s.type==="VF"&&(o=V(s,{value:a.kind==="VF"?a.value:null})));for(const d of vn(s)){const u=t.get(d)||{theme:d,total:0,correct:0,accuracy:0,wrongIdx:[]};u.total+=1,o?u.correct+=1:u.wrongIdx.push(l),t.set(d,u)}});const i=Array.from(t.values()).map(s=>({...s,accuracy:s.total?s.correct/s.total:0}));return i.sort((s,l)=>s.accuracy-l.accuracy),i}function gn(n){return n.length===0?"":`
    <div class="card">
      <h3>À approfondir par thèmes</h3>
      <p class="subtitle">Classement du plus faible taux de réussite au plus élevé.</p>
      <div style="overflow:auto">
        <table style="width:100%; border-collapse:collapse; font-size:14px">
          <thead>
            <tr>
              <th style="text-align:left; border-bottom:1px solid var(--brd); padding-bottom:6px">Thème</th>
              <th style="text-align:center; border-bottom:1px solid var(--brd)">Score</th>
              <th style="text-align:right; border-bottom:1px solid var(--brd)">Réussite</th>
            </tr>
          </thead>
          <tbody>${n.map(t=>`
    <tr>
      <td>${h(t.theme)}</td>
      <td style="text-align:center">${t.correct} / ${t.total}</td>
      <td style="text-align:right">${Math.round(t.accuracy*100)}%</td>
    </tr>
  `).join("")}</tbody>
        </table>
      </div>
      <small class="muted">Astuce : relance une série en sélectionnant le(s) thème(s) du haut pour cibler les lacunes.</small>
    </div>
  `}function bn(n){let e=0;const t=r.questions.map((l,a)=>{const o=r.userAnswers[a],d=o&&(l.type==="QR"?V(l,{value:o.kind==="QR"?o.value:null}):l.type==="QCM"?V(l,{values:o.kind==="QCM"?o.values:[]}):l.type==="VF"?V(l,{value:o.kind==="VF"?o.value:null}):!1);d&&e++;const u=o?l.type==="VF"?o.kind==="VF"?o.value==="V"?"Vrai":"Faux":"(aucune réponse)":l.type==="QR"?o.kind==="QR"?o.value??"(aucune réponse)":"(aucune réponse)":l.type==="QCM"&&o.kind==="QCM"&&(o.values??[]).join(" | ")||"(aucune réponse)":"(aucune réponse)";return`
        <li class="${d?"ok":"ko"}">
          <div class="qtitle">${a+1}. ${h(l.question)}</div>
          <div><strong>Ta réponse :</strong> ${h(u)}</div>
          <div><strong>Bonne réponse :</strong> ${h(re(l))}</div>
          ${l.explication?`<div class="block"><small class="muted">${h(l.explication)}</small></div>`:""}
        </li>
      `}).join(""),i=fn(r.questions,r.userAnswers),s=gn(i);c.root.innerHTML=`
    ${n}
    <div class="card">
      <h2>Série validée 🎉</h2>
      <p>Score du dernier tour : <strong>${e} / ${r.questions.length}</strong></p>
      <a class="primary" href="/">Revenir</a>
    </div>
    ${s}
    <ol class="list">${t}</ol>
  `,F(!1)}function he(n){var e,t;if(n.type==="VF"){const i=(e=document.querySelector('input[name="vf"]:checked'))==null?void 0:e.value;return i?{ok:!0,ua:{kind:"VF",value:i}}:{ok:!1,ua:null}}if(n.type==="QR"){const i=((t=document.querySelector('input[name="qr"]:checked'))==null?void 0:t.value)??null;return i?{ok:!0,ua:{kind:"QR",value:i}}:{ok:!1,ua:null}}if(n.type==="QCM"){const s=Array.from(document.querySelectorAll('.options input[type="checkbox"]')).filter(l=>l.checked).map(l=>l.value);return s.length>0?{ok:!0,ua:{kind:"QCM",values:s}}:{ok:!1,ua:null}}return{ok:!1,ua:null}}function O(n){(n.type==="QCM"||n.type==="QR")&&n.answers&&(n.answers=n.answers.map(e=>({...e,text:(e.text??"").trim()})).filter(e=>e.text.length>0))}function y(){const n=document.getElementById("btn-valider");if(!n)return;const e=r.questions[r.index],{ok:t}=he(e);n.disabled=!t}function hn(n,e){return n.type==="QR"?V(n,{value:e.kind==="QR"?e.value:null}):n.type==="QCM"?V(n,{values:e.kind==="QCM"?e.values:[]}):n.type==="VF"?V(n,{value:e.kind==="VF"?e.value:null}):!1}function h(n){return n.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function U(n){return n.replace(/"/g,"&quot;")}Object.assign(window,{t2q:{state:r}});

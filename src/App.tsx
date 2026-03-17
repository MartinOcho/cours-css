import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { BookOpen, Code, Layout, Play, CheckCircle, ChevronRight, FileCode2, AlertCircle, Trophy, Target, Star } from 'lucide-react';
import { cleanCss, hasCssSelector, hasCssProperty, validateCssRule } from './utils';

// --- DONNÉES DES LEÇONS ---
const MODULES = [
  {
    id: 1,
    title: "Bases du CSS",
    description: "Apprenez les fondamentaux du CSS : méthodes d'intégration, sélecteurs de base.",
    lessons: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 2,
    title: "Sélecteurs Avancés",
    description: "Maîtrisez les sélecteurs complexes et les pseudo-classes.",
    lessons: [7, 8, 9, 10]
  },
  {
    id: 3,
    title: "Le Modèle de Boîte",
    description: "Comprenez les marges, bordures, padding et dimensions.",
    lessons: [11, 12, 13]
  },
  {
    id: 4,
    title: "Positionnement",
    description: "Apprenez le positionnement relatif, absolu, fixe et sticky.",
    lessons: [14, 15, 16]
  },
  {
    id: 5,
    title: "Flexbox",
    description: "Maîtrisez la mise en page flexible avec Flexbox.",
    lessons: [17, 18, 19, 20]
  },
  {
    id: 6,
    title: "CSS Grid",
    description: "Créez des layouts complexes avec CSS Grid.",
    lessons: [21, 22, 23]
  }
];

const LESSONS = [
  // Module 1: Bases du CSS
  {
    id: 1,
    title: "1. Le CSS en ligne (Inline)",
    description: "Le CSS en ligne consiste à ajouter les styles directement à l'intérieur de la balise HTML en utilisant l'attribut **style**. C'est utile pour des modifications très rapides, mais déconseillé pour de gros projets car cela mélange la structure (HTML) et la présentation (CSS).",
    task: "Modifiez l'attribut style du paragraphe pour que la couleur (color) soit rouge (red).",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Inline</title>
</head>
<body>

  <!-- Ajoutez l'attribut style dans la balise <p> ci-dessous -->
  <p>Rends-moi rouge s'il te plaît !</p>

</body>
</html>`,
    initialCss: "",
    showCssTab: false,
    validate: (html: string, css: string) => {
      const lowerHtml = html.toLowerCase();
      return lowerHtml.includes('<p style=') && 
             lowerHtml.includes('color') && 
             (lowerHtml.includes('red') || lowerHtml.includes('#ff0000'));
    }
  },
  {
    id: 2,
    title: "2. Le CSS interne (Internal)",
    description: "Le CSS interne est placé dans la section **<head>** de votre page HTML, à l'intérieur d'une balise **<style>**. Cette méthode est pratique si vous avez une page web unique avec un style spécifique.",
    task: "Ajoutez une balise <style> dans le <head>. À l'intérieur, ciblez la balise 'h1' et donnez-lui la couleur bleue (blue).",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Interne</title>
  <!-- Ajoutez votre balise <style> ici -->
  
</head>
<body>

  <h1>Ce titre doit devenir bleu !</h1>
  <p>Ceci est un paragraphe normal.</p>

</body>
</html>`,
    initialCss: "",
    showCssTab: false,
    validate: (html: string, css: string) => {
      const lowerHtml = html.toLowerCase();
      return lowerHtml.includes('<style>') && 
             lowerHtml.includes('h1') && 
             lowerHtml.includes('color') && 
             lowerHtml.includes('blue');
    }
  },
  {
    id: 3,
    title: "3. Le CSS externe (External)",
    description: "C'est la méthode recommandée ! On crée un fichier séparé (ex: style.css) que l'on relie au HTML grâce à la balise **<link>** dans le **<head>**. Cela permet d'appliquer le même style à plusieurs pages facilement.",
    task: "1. Vérifiez que la balise <link> est bien présente dans le HTML.\n2. Allez dans l'onglet 'Fichier CSS'.\n3. Ciblez la classe '.boite' et donnez-lui une couleur de fond (background-color) verte (green).",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Externe</title>
  <!-- Le fichier CSS externe est lié ci-dessous -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="boite">
    Je suis une boîte et je veux un fond vert !
  </div>

</body>
</html>`,
    initialCss: `/* Tapez votre code CSS ici */
/* Ciblez .boite pour lui donner un background-color: green; */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const lowerCss = css.toLowerCase();
      const lowerHtml = html.toLowerCase();
      const hasLink = lowerHtml.includes('<link') && lowerHtml.includes('style.css');
      const hasCssRule = lowerCss.includes('.boite') && lowerCss.includes('background-color') && lowerCss.includes('green');
      return hasLink && hasCssRule;
    }
  },
  {
    id: 4,
    title: "4. Les sélecteurs de type (Balises)",
    description: "Les sélecteurs de type ciblent directement les balises HTML (comme **p**, **h1**, **div**). C'est très utile pour définir le style de base de votre page. Par exemple, si vous ciblez **p**, tous les paragraphes de la page seront affectés d'un seul coup.",
    task: "Allez dans l'onglet CSS et ciblez toutes les balises 'p' pour changer leur couleur (color) en gris (gray).",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Sélecteurs de type</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Titre de la page</h1>
  <p>Premier paragraphe de texte.</p>
  <div>Une séparation</div>
  <p>Deuxième paragraphe de texte.</p>
</body>
</html>`,
    initialCss: `/* Écrivez votre CSS ici */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      // On retire tous les espaces pour faciliter la validation, ex: p { color: gray; } devient p{color:gray;}
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('p{') && cleanCss.includes('color:gray');
    }
  },
  {
    id: 5,
    title: "5. Les sélecteurs de classe (.)",
    description: "L'attribut **class** permet de cibler des groupes d'éléments spécifiques, même s'ils ont des balises différentes. En CSS, on utilise un point (**.**) avant le nom de la classe pour la cibler. C'est le sélecteur le plus utilisé et le plus puissant au quotidien !",
    task: "Dans le CSS, ciblez la classe '.important' et donnez-lui une épaisseur de police (font-weight) en gras (bold).",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Sélecteurs de classe</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <p>Ceci est un texte normal.</p>
  <p class="important">Attention, ceci est très important !</p>
  <div class="important">Une autre zone importante.</div>
</body>
</html>`,
    initialCss: `/* Ciblez la classe .important ici */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('.important{') && cleanCss.includes('font-weight:bold');
    }
  },
  {
    id: 6,
    title: "6. Les sélecteurs d'identifiant (#)",
    description: "L'attribut **id** est absolument unique : il ne doit être utilisé qu'une seule fois par page ! Il sert à cibler un élément structurel précis (comme un menu). En CSS, on utilise le symbole dièse (**#**) suivi du nom de l'identifiant.",
    task: "Dans le CSS, ciblez l'identifiant '#en-tete' et appliquez-lui une couleur de fond (background-color) noire (black) et une couleur de texte (color) blanche (white).",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Sélecteurs d'identifiant</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="en-tete">
    Bienvenue sur mon site interactif !
  </div>
  <p>Le contenu principal de la page commence ici.</p>
</body>
</html>`,
    initialCss: `/* Ciblez l'ID #en-tete ici */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('#en-tete{') && 
             cleanCss.includes('background-color:black') && 
             cleanCss.includes('color:white');
    }
  },
  // Module 2: Sélecteurs Avancés
  {
    id: 7,
    title: "7. Sélecteurs descendants",
    description: "Les sélecteurs descendants ciblent les éléments qui sont descendants d'un autre élément. Par exemple, `div p` cible tous les paragraphes à l'intérieur de divs.",
    task: "Ciblez tous les paragraphes à l'intérieur de la div avec la classe 'container' et donnez-leur une couleur bleue.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Sélecteurs descendants</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <p>Ce paragraphe devrait être bleu.</p>
    <div>
      <p>Ce paragraphe aussi.</p>
    </div>
  </div>
  <p>Ce paragraphe reste normal.</p>
</body>
</html>`,
    initialCss: `/* Ciblez .container p */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      return validateCssRule(css, '.container p', 'color', 'blue');
    }
  },
  {
    id: 8,
    title: "8. Pseudo-classes :hover",
    description: "Les pseudo-classes permettent de cibler des états spécifiques des éléments. `:hover` s'applique quand la souris passe sur l'élément.",
    task: "Ajoutez un effet au survol pour les boutons : changez la couleur de fond en rouge au hover.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Pseudo-classes</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <button class="btn">Clique-moi</button>
</body>
</html>`,
    initialCss: `.btn {
  background-color: blue;
  color: white;
  padding: 10px;
}

/* Ajoutez :hover ici */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('.btn:hover{') && cleanCss.includes('background-color:red');
    }
  },
  {
    id: 9,
    title: "9. Sélecteurs d'attributs",
    description: "Les sélecteurs d'attributs ciblent les éléments qui ont un certain attribut. Par exemple, `[type=\"text\"]` cible les inputs de type text.",
    task: "Ciblez tous les inputs de type 'email' et donnez-leur une bordure verte.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Sélecteurs d'attributs</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <input type="text" placeholder="Nom">
  <input type="email" placeholder="Email">
  <input type="password" placeholder="Mot de passe">
</body>
</html>`,
    initialCss: `/* Ciblez input[type="email"] */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('input[type="email"]{') && cleanCss.includes('border') && cleanCss.includes('green');
    }
  },
  {
    id: 10,
    title: "10. Combinaisons de sélecteurs",
    description: "Vous pouvez combiner plusieurs sélecteurs pour des règles plus précises. Par exemple, `.class1.class2` pour des éléments avec deux classes.",
    task: "Ciblez les éléments qui ont à la fois les classes 'important' et 'urgent' et donnez-leur un fond rouge.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Combinaisons</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <p class="important">Important</p>
  <p class="urgent">Urgent</p>
  <p class="important urgent">Important et urgent</p>
</body>
</html>`,
    initialCss: `/* Ciblez .important.urgent */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('.important.urgent{') && cleanCss.includes('background-color:red');
    }
  },
  // Module 3: Le Modèle de Boîte
  {
    id: 11,
    title: "11. Marges (margin)",
    description: "Les marges créent de l'espace autour des éléments. Elles peuvent être définies individuellement (margin-top, margin-right, etc.) ou globalement.",
    task: "Ajoutez une marge de 20px autour de la boîte.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Marges</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="box">Boîte avec marge</div>
</body>
</html>`,
    initialCss: `.box {
  background-color: lightblue;
  width: 200px;
}

/* Ajoutez margin: 20px; */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('margin:20px');
    }
  },
  {
    id: 12,
    title: "12. Padding et bordures",
    description: "Le padding crée de l'espace à l'intérieur de l'élément, entre le contenu et la bordure. Les bordures entourent l'élément.",
    task: "Ajoutez un padding de 15px et une bordure noire de 2px à la boîte.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Padding et bordures</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="box">Contenu de la boîte</div>
</body>
</html>`,
    initialCss: `.box {
  background-color: lightgreen;
}

/* Ajoutez padding et border */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('padding:15px') && cleanCss.includes('border:2px') && cleanCss.includes('black');
    }
  },
  {
    id: 13,
    title: "13. Dimensions et box-sizing",
    description: "La propriété box-sizing contrôle comment les dimensions sont calculées. `border-box` inclut padding et bordure dans la largeur/hauteur.",
    task: "Définissez la largeur à 200px et utilisez box-sizing: border-box pour que les dimensions soient prévisibles.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Dimensions</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="box">Boîte dimensionnée</div>
</body>
</html>`,
    initialCss: `.box {
  background-color: lightyellow;
  padding: 20px;
  border: 5px solid black;
}

/* Ajoutez width: 200px; et box-sizing: border-box; */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('width:200px') && cleanCss.includes('box-sizing:border-box');
    }
  },
  // Module 4: Positionnement
  {
    id: 14,
    title: "14. Position relative",
    description: "Le positionnement relatif déplace l'élément par rapport à sa position normale, sans affecter les autres éléments.",
    task: "Déplacez la boîte de 50px vers la droite et 30px vers le bas avec position: relative.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Position relative</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="box">Boîte relative</div>
  <div class="box">Autre boîte</div>
</body>
</html>`,
    initialCss: `.box {
  background-color: lightcoral;
  width: 100px;
  height: 100px;
  margin: 10px;
}

/* Positionnez la première .box */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('position:relative') && cleanCss.includes('left:50px') && cleanCss.includes('top:30px');
    }
  },
  {
    id: 15,
    title: "15. Position absolue",
    description: "Le positionnement absolu retire l'élément du flux normal et le positionne par rapport à son conteneur positionné le plus proche.",
    task: "Positionnez la boîte absolument dans le coin supérieur droit de son conteneur.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Position absolue</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="box">Boîte absolue</div>
    <p>Contenu normal</p>
  </div>
</body>
</html>`,
    initialCss: `.container {
  position: relative;
  height: 200px;
  background-color: lightgray;
}

.box {
  background-color: lightblue;
  width: 100px;
  height: 100px;
}

/* Positionnez .box absolument */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('position:absolute') && cleanCss.includes('top:0') && cleanCss.includes('right:0');
    }
  },
  {
    id: 16,
    title: "16. Position fixe",
    description: "Le positionnement fixe positionne l'élément par rapport à la fenêtre du navigateur. L'élément reste fixe même lors du scroll.",
    task: "Créez une barre de navigation fixe en haut de la page.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Position fixe</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="navbar">Navigation fixe</nav>
  <div class="content">
    <p>Contenu qui scroll...</p>
    <p>Plus de contenu...</p>
    <p>Encore plus...</p>
  </div>
</body>
</html>`,
    initialCss: `.navbar {
  background-color: darkblue;
  color: white;
  padding: 10px;
}

.content {
  height: 1000px;
}

/* Rendez .navbar fixe */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('position:fixed') && cleanCss.includes('top:0');
    }
  },
  // Module 5: Flexbox
  {
    id: 17,
    title: "17. Introduction à Flexbox",
    description: "Flexbox est un modèle de layout qui permet de créer des designs flexibles et responsives. Le conteneur flex distribue l'espace entre ses enfants.",
    task: "Transformez le conteneur en flexbox et alignez les éléments horizontalement.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Flexbox Intro</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
  </div>
</body>
</html>`,
    initialCss: `.container {
  background-color: lightgray;
  padding: 10px;
}

.item {
  background-color: lightblue;
  padding: 20px;
  margin: 5px;
}

/* Ajoutez display: flex; au .container */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('display:flex');
    }
  },
  {
    id: 18,
    title: "18. justify-content et align-items",
    description: "justify-content contrôle l'alignement horizontal des éléments flex. align-items contrôle l'alignement vertical.",
    task: "Utilisez justify-content pour espacer les éléments et align-items pour les centrer verticalement.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Flexbox alignement</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
  </div>
</body>
</html>`,
    initialCss: `.container {
  display: flex;
  height: 200px;
  background-color: lightgray;
}

.item {
  background-color: lightcoral;
  padding: 20px;
}

/* Ajoutez justify-content: space-around; et align-items: center; */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('justify-content:space-around') && cleanCss.includes('align-items:center');
    }
  },
  {
    id: 19,
    title: "19. flex-direction et flex-wrap",
    description: "flex-direction change l'axe principal (row, column). flex-wrap permet aux éléments de passer à la ligne suivante.",
    task: "Changez la direction en colonne et permettez le wrap.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Flexbox direction</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
  </div>
</body>
</html>`,
    initialCss: `.container {
  display: flex;
  width: 300px;
  background-color: lightgreen;
}

.item {
  background-color: lightyellow;
  padding: 20px;
  margin: 5px;
  width: 100px;
}

/* Ajoutez flex-direction: column; et flex-wrap: wrap; */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('flex-direction:column') && cleanCss.includes('flex-wrap:wrap');
    }
  },
  {
    id: 20,
    title: "20. Flex-grow, flex-shrink, flex-basis",
    description: "Ces propriétés contrôlent comment les éléments flex grandissent, rétrécissent et leur taille de base.",
    task: "Faites en sorte que le deuxième élément prenne tout l'espace disponible.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Flexbox propriétés</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="item">Fixe</div>
    <div class="item grow">Flexible</div>
    <div class="item">Fixe</div>
  </div>
</body>
</html>`,
    initialCss: `.container {
  display: flex;
  width: 500px;
  background-color: lightblue;
}

.item {
  background-color: lightcoral;
  padding: 10px;
  width: 100px;
}

/* Donnez flex-grow: 1; à .grow */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('.grow{') && cleanCss.includes('flex-grow:1');
    }
  },
  // Module 6: CSS Grid
  {
    id: 21,
    title: "21. Introduction à CSS Grid",
    description: "CSS Grid est un système de layout bidimensionnel qui permet de créer des designs complexes avec des lignes et colonnes.",
    task: "Créez une grille 3x3 avec display: grid et grid-template-columns.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Grid Intro</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="grid">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <div class="item">8</div>
    <div class="item">9</div>
  </div>
</body>
</html>`,
    initialCss: `.grid {
  /* Ajoutez display: grid; et grid-template-columns: repeat(3, 1fr); */
}

.item {
  background-color: lightgreen;
  padding: 20px;
  border: 1px solid black;
}

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('display:grid') && cleanCss.includes('grid-template-columns:repeat(3,1fr)');
    }
  },
  {
    id: 22,
    title: "22. grid-template-rows et grid-gap",
    description: "grid-template-rows définit les hauteurs des lignes. grid-gap crée des espaces entre les cellules de la grille.",
    task: "Définissez des lignes de 100px et ajoutez un gap de 10px.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Grid rows et gap</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="grid">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
    <div class="item">D</div>
  </div>
</body>
</html>`,
    initialCss: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* Ajoutez grid-template-rows: 100px 100px; et grid-gap: 10px; */

.item {
  background-color: lightblue;
  padding: 10px;
}

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('grid-template-rows:100px100px') && cleanCss.includes('grid-gap:10px');
    }
  },
  {
    id: 23,
    title: "23. Positionnement dans la grille",
    description: "Vous pouvez positionner des éléments spécifiques dans la grille en utilisant grid-column et grid-row.",
    task: "Faites en sorte que l'élément spécial occupe 2 colonnes et 2 lignes.",
    initialHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Grid positionnement</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="grid">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item special">Spécial</div>
    <div class="item">4</div>
  </div>
</body>
</html>`,
    initialCss: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100px 100px;
  grid-gap: 5px;
}

.item {
  background-color: lightcoral;
  padding: 10px;
}

/* Positionnez .special avec grid-column: span 2; et grid-row: span 2; */

`,
    showCssTab: true,
    isExternalSimulation: true,
    validate: (html: string, css: string) => {
      const cleanCss = css.replace(/\s+/g, '').toLowerCase();
      return cleanCss.includes('.special{') && cleanCss.includes('grid-column:span2') && cleanCss.includes('grid-row:span2');
    }
  }
];

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [activeTab, setActiveTab] = useState('html'); // 'html' or 'css'
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set<number>());

  const activeLesson = LESSONS.find(l => l.id === activeLessonId)!;

  const getProgress = () => {
    const totalLessons = LESSONS.length;
    const completedCount = completedLessons.size;
    return Math.round((completedCount / totalLessons) * 100);
  };

  const isLessonCompleted = (lessonId: number) => completedLessons.has(lessonId);
  useEffect(() => {
    setHtmlCode(activeLesson.initialHtml);
    setCssCode(activeLesson.initialCss);
    setActiveTab('html');
    setIsSuccess(false);
  }, [activeLessonId]);

  // Validation en temps réel
  useEffect(() => {
    const success = activeLesson.validate(htmlCode, cssCode);
    setIsSuccess(success);
    if (success && !completedLessons.has(activeLessonId)) {
      setCompletedLessons(prev => new Set([...prev, activeLessonId]));
    }
  }, [htmlCode, cssCode, activeLesson, activeLessonId, completedLessons]);

  // Génération du contenu pour l'iframe
  const getSrcDoc = () => {
    let finalHtml = htmlCode;

    // Simulation du comportement du CSS Externe
    if (activeLesson.isExternalSimulation) {
      // Le CSS ne s'applique QUE si la balise <link> est présente
      if (finalHtml.includes('href="style.css"') || finalHtml.includes("href='style.css'")) {
        finalHtml = finalHtml.replace('</head>', `\n<style>${cssCode}</style>\n</head>`);
      }
    } else if (activeLesson.showCssTab) {
      // Comportement normal si un onglet CSS existe sans simulation stricte
      finalHtml = finalHtml.replace('</head>', `\n<style>${cssCode}</style>\n</head>`);
    }

    return finalHtml;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      {/* BARRE LATÉRALE - Navigation des leçons */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold flex items-center text-blue-400">
            <Layout className="mr-3" /> CSS Master
          </h1>
          <p className="text-sm text-gray-400 mt-2">Apprenez par la pratique</p>
          
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Progression</span>
              <span className="text-sm text-blue-400 font-medium">{getProgress()}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {completedLessons.size} / {LESSONS.length} leçons complétées
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {MODULES.map((module) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide flex items-center">
                {module.id === 1 && <Code className="mr-2" size={16} />}
                {module.id === 2 && <Target className="mr-2" size={16} />}
                {module.id === 3 && <Layout className="mr-2" size={16} />}
                {module.id === 4 && <Play className="mr-2" size={16} />}
                {module.id === 5 && <Star className="mr-2" size={16} />}
                {module.id === 6 && <Trophy className="mr-2" size={16} />}
                {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons.map((lessonId) => {
                  const lesson = LESSONS.find(l => l.id === lessonId)!;
                  const isCompleted = isLessonCompleted(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        activeLessonId === lesson.id 
                          ? 'bg-blue-600 shadow-lg text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        {isCompleted ? (
                          <CheckCircle size={16} className="mr-2 text-green-400" />
                        ) : (
                          <div className="w-4 h-4 mr-2 border-2 border-gray-500 rounded-full"></div>
                        )}
                        <span className="font-medium text-sm">{lesson.title}</span>
                      </div>
                      {activeLessonId === lesson.id && <ChevronRight size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE PRINCIPALE - Contenu et Éditeur */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* En-tête de la leçon */}
        <div className="bg-gray-800 p-6 border-b border-gray-700 shrink-0">
          <h2 className="text-3xl font-bold mb-3 flex items-center">
            <BookOpen className="mr-3 text-yellow-400" />
            {activeLesson.title}
          </h2>
          {/* Rendu du texte avec prise en charge du gras via regex simple */}
          <p className="text-gray-300 mb-4 leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: activeLesson.description.replace(/\*\*(.*?)\*\*/g, '<strong className="text-white bg-gray-700 px-1 rounded">$1</strong>') }} 
          />
          
          <div className="bg-blue-900/40 border border-blue-700/50 p-4 rounded-lg flex items-start">
            <AlertCircle className="text-blue-400 mr-3 mt-1 shrink-0" size={20} />
            <div>
              <strong className="block text-blue-300 mb-1">Mission :</strong>
              <p className="text-blue-100 whitespace-pre-line">{activeLesson.task}</p>
            </div>
          </div>
        </div>

        {/* Zone de l'éditeur et de l'aperçu */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Panneau de Code */}
          <div className="w-1/2 flex flex-col border-r border-gray-700">
            {/* Onglets de l'éditeur */}
            <div className="flex bg-gray-800 border-b border-gray-700">
              <button 
                onClick={() => setActiveTab('html')}
                className={`flex items-center px-4 py-3 font-mono text-sm border-b-2 transition-colors ${
                  activeTab === 'html' ? 'border-blue-500 text-blue-400 bg-gray-900' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Code size={16} className="mr-2" /> index.html
              </button>
              
              {activeLesson.showCssTab && (
                <button 
                  onClick={() => setActiveTab('css')}
                  className={`flex items-center px-4 py-3 font-mono text-sm border-b-2 transition-colors ${
                    activeTab === 'css' ? 'border-yellow-500 text-yellow-400 bg-gray-900' : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FileCode2 size={16} className="mr-2" /> style.css
                </button>
              )}
            </div>

            {/* Zone de texte de l'éditeur */}
            <div className="flex-1 relative bg-[#1e1e1e]">
              {activeTab === 'html' ? (
                <Editor
                  height="100%"
                  language="html"
                  value={htmlCode}
                  onChange={(value) => setHtmlCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on'
                  }}
                />
              ) : (
                <Editor
                  height="100%"
                  language="css"
                  value={cssCode}
                  onChange={(value) => setCssCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on'
                  }}
                />
              )}
            </div>
          </div>

          {/* Panneau d'Aperçu (Résultat) */}
          <div className="w-1/2 flex flex-col bg-white">
            <div className="bg-gray-200 text-gray-800 px-4 py-3 border-b border-gray-300 flex items-center justify-between font-medium text-sm">
              <span className="flex items-center"><Play size={16} className="mr-2 text-green-600" /> Résultat en direct</span>
              
              {isSuccess && (
                <span className="flex items-center text-green-700 bg-green-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  <CheckCircle size={14} className="mr-1" /> Mission Accomplie !
                </span>
              )}
            </div>
            
            <div className="flex-1 relative">
              <iframe
                title="Aperçu du code"
                srcDoc={getSrcDoc()}
                className="absolute inset-0 w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
// Utilitaires pour l'application CSS Master

/**
 * Nettoie le CSS en retirant les espaces et en convertissant en minuscules
 * pour faciliter les validations
 */
export const cleanCss = (css: string): string => {
  return css.replace(/\s+/g, '').toLowerCase();
};

/**
 * Nettoie le HTML de la même manière
 */
export const cleanHtml = (html: string): string => {
  return html.replace(/\s+/g, '').toLowerCase();
};

/**
 * Vérifie si une propriété CSS est présente dans le code
 */
export const hasCssProperty = (css: string, property: string, value?: string): boolean => {
  const clean = cleanCss(css);
  const propClean = property.replace(/\s+/g, '').toLowerCase();

  if (value) {
    const valueClean = value.replace(/\s+/g, '').toLowerCase();
    return clean.includes(`${propClean}:${valueClean}`);
  }

  return clean.includes(propClean);
};

/**
 * Vérifie si un sélecteur CSS est présent
 */
export const hasCssSelector = (css: string, selector: string): boolean => {
  const clean = cleanCss(css);
  const selectorClean = selector.replace(/\s+/g, '').toLowerCase();
  return clean.includes(selectorClean + '{');
};

/**
 * Vérifie si une balise HTML contient un attribut
 */
export const hasHtmlAttribute = (html: string, tag: string, attribute: string, value?: string): boolean => {
  const clean = cleanHtml(html);

  if (value) {
    const valueClean = value.replace(/\s+/g, '').toLowerCase();
    return clean.includes(`<${tag}${attribute}="${valueClean}"`) ||
           clean.includes(`<${tag}${attribute}='${valueClean}'`);
  }

  return clean.includes(`<${tag}${attribute}`);
};

/**
 * Génère un exemple de code HTML basique
 */
export const generateBasicHtml = (title: string, bodyContent: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${bodyContent}
</body>
</html>`;
};

/**
 * Génère un exemple de code CSS basique
 */
export const generateBasicCss = (selectors: string[]): string => {
  return selectors.map(selector => `${selector} {\n  /* Vos styles ici */\n}`).join('\n\n');
};

/**
 * Calcule le pourcentage de progression
 */
export const calculateProgress = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};

/**
 * Valide une règle CSS complète (sélecteur + propriété + valeur)
 */
export const validateCssRule = (css: string, selector: string, property: string, value: string): boolean => {
  return hasCssSelector(css, selector) && hasCssProperty(css, property, value);
};

/**
 * Utilitaires pour les animations et transitions
 */
export const animationUtils = {
  fadeIn: 'opacity: 0; animation: fadeIn 0.5s ease-in forwards;',
  slideIn: 'transform: translateX(-100%); animation: slideIn 0.3s ease-out forwards;',
  bounce: 'animation: bounce 1s infinite;'
};

/**
 * Couleurs recommandées pour les exemples
 */
export const colorPalette = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  text: '#1e293b'
};

/**
 * Unités CSS courantes
 */
export const cssUnits = {
  length: ['px', 'em', 'rem', 'vh', 'vw', '%'],
  color: ['hex', 'rgb', 'hsl', 'named'],
  time: ['s', 'ms']
};

/**
 * Propriétés CSS par catégorie
 */
export const cssProperties = {
  layout: ['display', 'position', 'float', 'clear'],
  boxModel: ['width', 'height', 'margin', 'padding', 'border', 'box-sizing'],
  typography: ['font-family', 'font-size', 'font-weight', 'color', 'text-align'],
  flexbox: ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'],
  grid: ['grid-template-columns', 'grid-template-rows', 'grid-gap'],
  positioning: ['top', 'right', 'bottom', 'left', 'z-index']
};
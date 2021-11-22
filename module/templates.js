/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  const templatePaths = [
    "systems/fvtt-prophecy/templates/actor/part/attributs.html",
    "systems/fvtt-prophecy/templates/actor/part/caracteristiques.html",
    "systems/fvtt-prophecy/templates/actor/part/avantages.html",
    "systems/fvtt-prophecy/templates/actor/part/blessure.html",
    "systems/fvtt-prophecy/templates/actor/part/magie.html",
    "systems/fvtt-prophecy/templates/actor/part/equipements.html",
    "systems/fvtt-prophecy/templates/actor/part/group-competences.html",
    "systems/fvtt-prophecy/templates/actor/part/tendances.html",
    "systems/fvtt-prophecy/templates/dialog/roll.html",
    "systems/fvtt-prophecy/templates/dialog/roll-magie.html",
    "systems/fvtt-prophecy/templates/dialog/add-comp.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};

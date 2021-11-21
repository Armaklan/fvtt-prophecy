import { ActorSheetProphecyPlayerCharacter } from "./actor-sheet/playercharacter.js";
import { ItemSheetProphecyAvantage } from "./item-sheet/avantage.js";
import { ActorProphecyPlayerCharacter } from "./actor/playercharacter.js";
import { ItemProphecyAvantage } from "./item/avantage.js";
import { PROPHECY } from "./config.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { ItemSheetProphecyArme } from "./item-sheet/arme.js";
import { ItemSheetProphecyArmure } from "./item-sheet/armure.js";
import { ItemSheetProphecyObjet } from "./item-sheet/objet.js";
import { ItemSheetProphecySortilege } from "./item-sheet/sortilege.js";

Hooks.once("init", function () {
  console.log(`Prophecy | Initializing Prophecy System`);
  game.prophecy = {
    ActorProphecyPlayerCharacter,
    ItemProphecyAvantage,
    config: PROPHECY
  };

  CONFIG.PROPHECY = PROPHECY;

  CONFIG.Actor.documentClass = ActorProphecyPlayerCharacter;
  CONFIG.Item.documentClass = ItemProphecyAvantage;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("prophecy", ActorSheetProphecyPlayerCharacter, {
    types: ["playercharacter", "adversaire"],
    makeDefault: true,
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("prophecy", ItemSheetProphecyAvantage, {
    types: ["avantage", "desavantage", "don", "technique"],
    makeDefault: true,
  });
  Items.registerSheet("prophecy", ItemSheetProphecyArme, {
    types: ["arme"],
    makeDefault: true,
  });
  Items.registerSheet("prophecy", ItemSheetProphecyArmure, {
    types: ["armure"],
    makeDefault: true,
  });
  Items.registerSheet("prophecy", ItemSheetProphecyObjet, {
    types: ["objet"],
    makeDefault: true,
  });
  Items.registerSheet("sortilege", ItemSheetProphecySortilege, {
    types: ["sortilege"],
    makeDefault: true,
  });
    
  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});


/**
 * Set the default image for an item type instead of the mystery man
 **/
Hooks.on("preCreateItem", function (document, options, userId) {
  document.data.update({
    img: "systems/fvtt-prophecy/icons/" + document.data.type + ".png",
  });
});

/* -------------------------------------------- */

/**
 * Set the default image for an actor type instead of the mystery man
 **/
Hooks.on("preCreateActor", function (entity, options, userId) {
  entity.data.update({
    img: "systems/fvtt-prophecy/icons/" + entity.type + ".png",
  })

  if (entity.name == "") {
    entity.data.update({
      name: "Nouveau " + entity.type[0].toUpperCase() + entity.type.slice(1),
    })
  }
});
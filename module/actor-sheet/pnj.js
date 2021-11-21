import { getArmeItem, getArmureItem, getAvantageItems, getDesavantageItem, getDonItem, getObjetItem, getSortilegeItem, getTechniqueItem } from "../helper.js";

export class ActorSheetProphecyPNJ extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sheet", "actor"],
      template: "systems/fvtt-prophecy/templates/actor/pnj.html",
      width: 850,
      height: 750,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "concept",
        },
      ],
    });
  }

  /** @override */
  getData() {
    console.log("Prophecy | Initializing pnj data");

    const sheetData = super.getData();

    console.debug("Prophecy | Sheet data", sheetData);

    return sheetData;
  }
}
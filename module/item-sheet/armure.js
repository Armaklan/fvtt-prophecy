export class ItemSheetProphecyArmure extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sheet", "item"],
      template: "systems/fvtt-prophecy/templates/item/armure.html",
      width: 730,
      height: 750,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  /** @override */
  getData() {
    const sheetData = super.getData();

    console.log("Avantage data", sheetData);

    return sheetData;
  }
}
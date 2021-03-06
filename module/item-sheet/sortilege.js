export class ItemSheetProphecySortilege extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sheet", "item", "prophecy"],
      template: "systems/fvtt-prophecy/templates/item/sortilege.html",
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
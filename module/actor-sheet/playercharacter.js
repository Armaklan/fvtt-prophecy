import { getArmeItem, getArmureItem, getAvantageItems, getDesavantageItem, getDonItem, getObjetItem, getSortilegeItem, getTechniqueItem } from "../helper.js";

export class ActorSheetProphecyPlayerCharacter extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sheet", "actor"],
      template: "systems/fvtt-prophecy/templates/actor/playercharacter.html",
      width: 730,
      height: 750,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "caracteristiques",
        },
      ],
    });
  }

  /** @override */
  getData() {
    console.log("Prophecy | Initializing player character data");

    const sheetData = super.getData();
    sheetData.avantages = getAvantageItems(sheetData);
    sheetData.desavantages = getDesavantageItem(sheetData);
    sheetData.dons = getDonItem(sheetData);
    sheetData.techniques = getTechniqueItem(sheetData);

    sheetData.objets = getObjetItem(sheetData);
    sheetData.armes = getArmeItem(sheetData);
    sheetData.armures = getArmureItem(sheetData);
    sheetData.sortileges = getSortilegeItem(sheetData);

    console.debug("Prophecy | Sheet data", sheetData);

    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    console.log("Prophecy | Initializing player character events");

    html
      .find(".caracteristique-name")
      .click((event) => this.onCaracteristiqueRoll(event));

    html
      .find(".competence-name")
      .click((event) => this.onCompetenceRoll(event));

    html.find(".item-delete").on("click", this._onItemDelete.bind(this));
    html.find(".item-edit").on("click", this._onItemEdit.bind(this));
    html.find(".item h4.item-name").on("click", (event) => this._onItemSummary(event));

    if (!this.isEditable) return;
  }

  async _onItemDelete(event) {
    console.log("Prophecy | Delete item", event);
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const itemid = li.dataset.itemId;

    const item = this.actor.getOwnedItem(itemid);
    await this.actor.deleteOwnedItem(itemid);
  }

  async _onItemEdit(event) {
    console.log("Prophecy | Edit item", event);
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const itemId = li.dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    item.sheet.render(true);
  }

  async _onItemSummary(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.getOwnedItem(li.data("item-id"));
    const chatData = item.getChatData({ secrets: this.actor.owner });

    // Toggle summary
    if (li.hasClass("expanded")) {
      const summary = li.children(".item-summary");
      summary.slideUp(200, () => summary.remove());
    } else {
      const div = $(`<div class="item-summary">${chatData.description}</div>`);
      const metadata = $(
        `<div class="item-metdata">${chatData.metadatahtml}</div>`
      );
      div.append(metadata);
      li.append(div.hide());
      div.slideDown(200);
    }
    li.toggleClass("expanded");
  }

  async onCaracteristiqueRoll(event) {
    console.log("Prophecy | Roll caracteristique", event);
    event.preventDefault();

    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.caracteristique) {
      const caracteristiqueSelector = `@caracteristiques.${dataset.caracteristique}.value`;
      await this._buildRollDialog(
        dataset.caracteristique,
        caracteristiqueSelector
      );
    }
  }

  async onCompetenceRoll(event) {
    console.log("Prophecy | Roll compétence", event);
    event.preventDefault();

    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.competence) {
      const selector = `@${dataset.group}.${dataset.competence}.value`;
      await this._buildRollDialog(dataset.competence, selector);
    }
  }

  async _buildRollDialog(name, selector) {
    const template = "systems/fvtt-prophecy/templates/dialog/roll.html";
    const dialogData = {
      actor: this.actor,
    };
    const actor = this.actor;
    const html = await renderTemplate(template, dialogData);

    return new Promise((resolve) => {
      new Dialog({
        title: "Lancer de dés",
        content: html,
        buttons: {
          std: {
            label: "Jet standard",
            callback: (html) =>
              this._roll(actor, name, selector, html[0].querySelector("form")),
          },
          tendance: {
            label: "Jet de tendance",
            callback: (html) =>
              this._rollTendance(
                actor,
                name,
                selector,
                html[0].querySelector("form")
              ),
          },
        },
        close: (html) => {
          resolve();
        },
      }).render(true);
    });
  }

  _roll(actor, name, elementSelector, dialogData) {
    const attributSelector = `@attributs.${dialogData.attribut.value}.value`;
    const rollFormula = `1d10+${attributSelector}+${elementSelector}+${dialogData.modificateur.value}`;
    const roll = new Roll(rollFormula, this.actor.data.data);
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${name}`,
    });
  }

  _rollTendance(actor, name, elementSelector, dialogData) {
    const attributSelector = `@attributs.${dialogData.attribut.value}.value`;
    const rollFormula = `1d10+${attributSelector}+${elementSelector}+${dialogData.modificateur.value}`;

    new Roll(rollFormula, this.actor.data.data).roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${name} - Dragon`,
    });
    new Roll(rollFormula, this.actor.data.data).roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${name} - Humanisme`,
    });
    new Roll(rollFormula, this.actor.data.data).roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${name} - Fatalité`,
    });
  }
}
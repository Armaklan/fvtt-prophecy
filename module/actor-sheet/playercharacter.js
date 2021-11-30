import { getArmeItem, getArmureItem, getAvantageItems, getDesavantageItem, getDonItem, getObjetItem, getSortilegeItem, getTechniqueItem } from "../helper.js";

export class ActorSheetProphecyPlayerCharacter extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sheet", "actor", "prophecy"],
      template: "systems/fvtt-prophecy/templates/actor/playercharacter.html",
      width: 850,
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

    html.find(".sphere-name").click((event) => this.onMagicRoll(event));

    html.find(".item-create").on("click", this._onItemCreate.bind(this));
    html.find(".item-test").on("click", this._onItemTest.bind(this));
    html.find(".item-delete").on("click", this._onItemDelete.bind(this));
    html.find(".item-edit").on("click", this._onItemEdit.bind(this));
    html
      .find(".item h4.item-name")
      .on("click", (event) => this._onItemSummary(event));

    html.find(".competences-add").on("click", this._onSkillAdd.bind(this));
    html
      .find(".competences-delete")
      .on("click", this._onSkillDelete.bind(this));
    html.find(".sort-test").on("click", this._onSortTest.bind(this));
    if (!this.isEditable) return;
  }

  _onItemCreate(event) {
    console.log("Prophecy | Create item", event);
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const type = dataset.type;
    const itemData = {
      name: `Nouveau ${type}`,
      img: `systems/fvtt-prophecy/icons/${type}.jpg`,
      type: type,
      data: duplicate(dataset),
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data.type;

    return this.actor.createOwnedItem(itemData);
  }

  async _onSkillDelete(event) {
    console.log("Prophecy | Skill delete", event);
    event.preventDefault();

    const dataset = event.currentTarget.dataset;
    const group = dataset.group;
    const competence = dataset.competence;
    const actor = this.actor;

    const data = { data: {} };
    data.data[group] = {};
    data.data[group][competence] = null;

    actor.update(data);
  }

  async _onSkillAdd(event) {
    console.log("Prophecy | Skill add", event);
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const group = dataset.group;
    const actor = this.actor;

    const template = "systems/fvtt-prophecy/templates/dialog/add-comp.html";
    const dialogData = {};
    const html = await renderTemplate(template, dialogData);

    return new Promise((resolve) => {
      new Dialog({
        title: "Ajouter une compétence",
        content: html,
        buttons: {
          std: {
            label: "Ajouter",
            callback: (html) => {
              const dialogData = html[0].querySelector("form");

              const data = { data: {} };
              data.data[group] = {};
              data.data[group][dialogData.compName.value] = {
                min: 0,
                value: 1,
                max: 20,
                added: true,
              };

              actor.update(data);
            },
          },
        },
        close: (html) => {
          resolve();
        },
      }).render(true);
    });
  }

  async _onSortTest(event) {
    console.log("Prophecy | Test sortilege", event);
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const sphere = dataset.sphere;
    const discipline = dataset.discipline;
    const attributSelector = `@disciplines.${discipline}.value`;
    const elementSelector = `@spheres.${sphere}.value`;
    const rollFormula = `1d10+${attributSelector}+${elementSelector}`;
    this._roll(this.actor, "Sortilege", rollFormula);
  }

  async _onItemTest(event) {
    console.log("Prophecy | Test item", event);
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const dommage = li.dataset.itemDommage;
    const multiplicateur = li.dataset.itemMultiplicateur;

    const rollFormula = `${dommage}+(@caracteristiques.force.value*${multiplicateur})`;
    const roll = new Roll(rollFormula, this.actor.data.data);
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `Dommage`,
    });
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

  async onMagicRoll(event) {
    console.log("Prophecy | Roll magie", event);
    event.preventDefault();

    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.sphere) {
      const selector = `@spheres.${dataset.sphere}.value`;
      await this._buildMagicRollDialog(dataset.sphere, selector);
    }
  }

  async _buildMagicRollDialog(name, elementSelector) {
    const template = "systems/fvtt-prophecy/templates/dialog/roll-magie.html";
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
            callback: (html) => {
              const dialogData = html[0].querySelector("form");
              const attributSelector = `@disciplines.${dialogData.discipline.value}.value`;
              const rollFormula = `1d10+${attributSelector}+${elementSelector}+${dialogData.modificateur.value}`;
              this._roll(actor, name, rollFormula);
            },
          },
          tendance: {
            label: "Jet de tendance",
            callback: (html) => {
              const dialogData = html[0].querySelector("form");
              const attributSelector = `@disciplines.${dialogData.discipline.value}.value`;
              const rollFormula = `1d10+${attributSelector}+${elementSelector}+${dialogData.modificateur.value}`;
              this._rollTendance(actor, name, rollFormula);
            },
          },
        },
        close: (html) => {
          resolve();
        },
      }).render(true);
    });
  }

  async _buildRollDialog(name, elementSelector) {
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
            callback: (html) => {
              const dialogData = html[0].querySelector("form");
              const attributSelector = `@attributs.${dialogData.attribut.value}.value`;
              const rollFormula = `1d10+${attributSelector}+${elementSelector}+${dialogData.modificateur.value}`;
              this._roll(actor, name, rollFormula);
            },
          },
          tendance: {
            label: "Jet de tendance",
            callback: (html) => {
              const dialogData = html[0].querySelector("form");
              const attributSelector = `@attributs.${dialogData.attribut.value}.value`;
              const rollFormula = `1d10+${attributSelector}+${elementSelector}+${dialogData.modificateur.value}`;
              this._rollTendance(actor, name, rollFormula);
            },
          },
        },
        close: (html) => {
          resolve();
        },
      }).render(true);
    });
  }

  _roll(actor, name, rollFormula) {
    const roll = new Roll(rollFormula, this.actor.data.data);
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${name}`,
    });
  }

  _rollTendance(actor, name, rollFormula) {
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
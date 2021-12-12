export class ItemProphecyAvantage extends Item {
  /** @override */
  prepareData() {
    super.prepareData();
  }

  getChatData(htmlOptions) {
    const data = duplicate(this.data.data);

    // Rich text description
    data.metadatahtml = "";
    data.description = TextEditor.enrichHTML(data.description, htmlOptions);
    const fn = this[`_${this.data.type}ChatData`];
    if (fn) fn.bind(this)(data, htmlOptions);

    return data;
  }
}
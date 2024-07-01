/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} name_short
 * @property {string} image_url
 * @property {string} link_url
 * @property {string[]} tag
 * @property {number} price
 */
export class Product {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} image_url
   * @param {string} link_url
   * @param {number} price
   */
  constructor(id, name, image_url, link_url, price) {
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.link_url = link_url;
    this.price = price;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      image_url: this.image_url,
      link_url: this.link_url,
      price: this.price
    });
  }

  /**
   * @param {string} jsonString
   * @returns {Product}
   */
  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    return new Product(data.id, data.name, data.image_url, data.link_url, data.price);
  }
}

/**
 * @typedef {Object} Message
 * @property {string} sender
 * @property {string} timestamp
 * @property {string} text
 * @property {Product[]|null} products
 */
export class Message {
  /**
   * @param {string} sender
   * @param {string} text
   * @param {string} timestamp
   * @param {Product[]|null} products
   */
  constructor(sender, text, timestamp, products) {
    this.sender = sender;
    this.text = text;
    this.timestamp = timestamp;
    this.products = products;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify({
      sender: this.sender,
      text: this.text,
      timestamp: this.timestamp,
      products: this.products
    });
  }

  /**
   * @param {string} jsonString
   * @returns {Message}
   */
  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    return new Message(data.sender, data.text, data.timestamp, data.products);
  }
}

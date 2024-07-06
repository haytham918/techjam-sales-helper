/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} image_url
 * @property {string} link_url
 * @property {string[]} tags
 * @property {number} price
 */
export class Product {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} image_url
   * @param {string} link_url
   * @param {string[]} tags
   * @param {number} price
   */
  constructor(id, name, image_url, link_url, tags, price) {
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.link_url = link_url;
    this.tags = tags;
    this.price = price;
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image_url: this.image_url,
      link_url: this.link_url,
      tags: this.tags,
      price: this.price
    };
  }

  /**
   * @param {Object} data
   * @returns {Product}
   */
  static fromJSON(data) {
    return new Product(
      data.id,
      data.name,
      data.image_url,
      data.link_url,
      data.tags,
      parseFloat(data.price.replace('$', '').replace(',', ''))
    );
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
   * @returns {json}
   */
  toJSON() {
    return {
      sender: this.sender,
      text: this.text,
      timestamp: this.timestamp,
      products: this.products
    };
  }
}

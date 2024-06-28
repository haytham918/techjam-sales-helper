const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} image_url
 * @property {string} link_url
 * @property {number} price
 */
class Product {
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
 * @property {string} text
 * @property {string} timestamp
 * @property {Product[]|null} products
 */
class Message {
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


/**
 * @api {post} /api/chat Chat with sales helper
 * @apiName chat
 *
 * @apiHeader {String} Content-Type application/json
 *
 * @apiBody {Message[]} messages List of chat messages or empty array.
 *
 * @apiSuccess {Message} message A JSON Message with recommended products.
 *
 * @apiError (500) {String} Server error An error occurred while processing the request.
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '[{"sender": "User", "text": "Hello", "timestamp": "2024-06-27T12:00:00Z", "products": null}]'
 *
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *     {
 *       "sender": "Sales Helper",
 *       "text": "Echo: Hello",
 *       "timestamp": "2024-06-27T12:01:00Z",
 *       "products": [
 *         {
 *           "id": 1,
 *           "name": "Product 1",
 *           "image_url": "https://example.com/product1.jpg",
 *           "link_url": "https://example.com/product1",
 *           "price": 10.99
 *         },
 *         {
 *           "id": 2,
 *           "name": "Product 2",
 *           "image_url": "https://example.com/product2.jpg",
 *           "link_url": "https://example.com/product2",
 *           "price": 20.99
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error response (500):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Server error"
 *     }
 */
app.post('/api/echo', (req, res) => {
  const messages = req.body.map((message) => Message.fromJSON(JSON.stringify(message)));
  if (!messages) {
    res.status(500).json({ error: 'Empty message' });
    return;
  }
  responseMessage = chat(messages);
  res.json(JSON.parse(responseMessage.toJSON()));
});

/**
 * @param {Message[]} messages
 * @returns {Message}
*/
function chat(messages) {
  const exampleProducts = [
    new Product(1, 'Product 1', 'https://example.com/product1.jpg', 'https://example.com/product1', 10.99),
    new Product(2, 'Product 2', 'https://example.com/product2.jpg', 'https://example.com/product2', 20.99),
    new Product(3, 'Product 3', 'https://example.com/product3.jpg', 'https://example.com/product3', 30.99),
    new Product(4, 'Product 4', 'https://example.com/product4.jpg', 'https://example.com/product4', 40.99),
    new Product(5, 'Product 5', 'https://example.com/product5.jpg', 'https://example.com/product5', 50.99),
  ];

  const responseMessage = new Message(
    'Sales Helper',
    `Echo: ${messages[messages.length - 1].text}`,
    new Date().toISOString(),
    exampleProducts
  );
  return responseMessage;
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

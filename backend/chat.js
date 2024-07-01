import fs from 'fs';
import OpenAI from 'openai';
import { Message, Product } from './model.js';

const productData = JSON.parse(fs.readFileSync("product_info.json"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(req, res) {
  try {
    const { userInput } = req.body;

    // Initialize the dialog of the session
    if (!req.session.dialog) {
      const productNames = productData
        .map((product) => `product name: ${product.name}`)
        .join(", ");
      const systemMessage = { role: "system", content: `${productNames}. Based on the user's needs, I recommend: ` };
      req.session.dialog = [];
      // Push the system prompt to dialog
      req.session.dialog.push(systemMessage);
    }

    req.session.dialog.push({ role: "user", content: userInput });
    console.log(req.session.dialog);

    openai.chat.completions.create({
      model: "gpt-4o",
      messages: req.session.dialog,
      max_tokens: 250,
      temperature: 0.7,
    }).then((response) => {
      const openaiResponse = response.choices[0].message.content;
      console.log("OpenAI response:", openaiResponse);

      // Push the response into the dialog as well
      req.session.dialog.push({ role: "assistant", content: openaiResponse });

      const recommendedProducts = productData
        .filter((product) => openaiResponse.includes(product.name))
        .map((product) => ({
          name: product.name,
          imageURL: product.imageURL,
          price: product.price,
          linkURL: product.linkURL,
          /*tags: product.tags.slice(0, 3), // I think this should be predefined in the JSON as well*/
        }));
      console.log("Recommended products:", recommendedProducts);

      res.json(
        recommendedProducts.length > 0
          ? recommendedProducts
          : { message: "Sorry, no matching products found. Can you try again?" }
      );
    });
  } catch (error) {
    console.error("Error processing recommendation:", error);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
}

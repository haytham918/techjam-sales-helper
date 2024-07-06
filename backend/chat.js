import fs from "fs";
import OpenAI from "openai";
import { Message, Product } from "./model.js";
import moment from "moment";

const productData = JSON.parse(fs.readFileSync("updated_product_info_v2.json"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(req, res) {
  try {
    const { userInput } = req.body;

    // Initialize the dialog of the session
    if (!req.session.dialog) {
      const productNames = productData
        .map((product) => `product name: ${product.name_short}`)
        .join(", ");
      const systemMessage = {
        role: "system",
        content: `${productNames}. You are a helpful assistant that recommends electronic
      devices based on user input. Please only recommend devices from the products I provided above. Please describe your recommendation briefly and create a string array of the product names at the end of your answer in brackets.`,
      };
      req.session.dialog = [];
      // Push the system prompt to dialog
      req.session.dialog.push(systemMessage);
    }

    req.session.dialog.push({ role: "user", content: userInput });
    console.log(req.session.dialog);

    openai.chat.completions
      .create({
        model: "gpt-4o",
        messages: req.session.dialog,
        max_tokens: 500,
        temperature: 0.7,
      })
      .then((response) => {
        const openaiResponse = response.choices[0].message.content;
        console.log("OpenAI response:", openaiResponse);

        // Push the response into the dialog as well
        req.session.dialog.push({ role: "assistant", content: openaiResponse });

        const parts = openaiResponse.split("[");
        const descriptionText = parts[0].trim();
        const productArray = parts[1].slice(0, parts[1].length - 1).trim();

        const recommendedProducts = productData
          .filter((product) => productArray.includes(product.name_short))
          .map((product) =>
            new Product(
              product.sku_id,
              product.name_short,
              product.price,
              product.image_url,
              product.link_url,
              product.tags
            )
          );
        console.log("Recommended products:", recommendedProducts);

        const text =
          recommendedProducts.length > 0
            ? descriptionText
            : "Sorry, no matching products found. Can you try again?";
        const time_stamp = moment().format("YYYY-MM-DD HH:mm");
        const message = new Message("ai", text, time_stamp, recommendedProducts);
        res.json({ message: message });
      });
  } catch (error) {
    console.error("Error processing recommendation:", error);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
}
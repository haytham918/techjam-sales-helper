import fs from "fs";
import OpenAI from "openai";
import { Message, Product } from "./model.js";
import moment from "moment";

const productData = JSON.parse(fs.readFileSync("updated_product_info_v2.json")).map(Product.fromJSON);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(req, res) {
  try {
    const { userInput } = req.body;

    // Initialize the dialog of the session
    if (!req.session.dialog) {
      const productNames = productData
        .map((product) => product.name)
        .join(", ");
      const systemMessage = {
        role: "system",
        content: `Here are a list of products: [${productNames}]. You are a helpful assistant that recommends electronic
      devices based on user input. Please only recommend devices from the products I provided above. Please describe your recommendation briefly and include the exact product in your response. Please use raw text only, do not use markdown or labeled text.`
      };
      req.session.dialog = [];
      // Push the system prompt to dialog
      req.session.dialog.push(systemMessage);
    }

    req.session.dialog.push({ role: "user", content: userInput });

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
        const time_stamp = moment().format("YYYY-MM-DD HH:mm");
        const text = openaiResponse;
        const recommendedProducts = productData.filter((product) => text.includes(product.name));
        console.log("Recommended products:", recommendedProducts);
        const message = new Message("bot", text, time_stamp, recommendedProducts);
        res.json(message.toJSON());
      });
  } catch (error) {
    console.error("Error processing recommendation:", error);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
}

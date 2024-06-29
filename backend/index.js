const express = require("express");
const session = require("express-session");
const OpenAI = require("openai");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5001;

const productData = JSON.parse(fs.readFileSync("product_info.json"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.use(
  session({
    secret: "djiawdommijaodmwaid",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.post("/recommendation", async (req, res) => {
  try {
    const { userInput } = req.body;

    // Initialize the dialog of the session
    if (!req.session.dialog) {
      const productNames = productData
        .map((product) => `product name: ${product.name}`)
        .join(", ");
      const systemMessage = `{role: "system", "content": "${productNames}. Based on the user's needs, I recommend: "}`;
      req.session.dialog = [];
      // Push the system prompt to dialog
      req.session.dialog.push(systemMessage);
    }

    // Retrieve previous dialogs info
    const dialogHistory = req.session.dialog
      .map(
        (dialog) =>
          `{ "role": "${dialog.role}", "content": "${dialog.content}" }`
      )
      .join(",\n");

    req.session.dialog.push({ role: "user", content: userInput });

    const prompt = `[
      ${dialogHistory}
      { "role": "user", "content": "${userInput}" },
  ]`;

    const response = await openai.createCompletion({
      model: "gpt-4o",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const openaiResponse = response.data.choices[0].text.trim();

    // Push the response into the dialog as well
    req.session.dialog.push({role: "assistant", content: openaiResponse});

    const recommendedProducts = productData
      .filter((product) => openaiResponse.includes(product.name))
      .map((product) => ({
        name: product.name,
        imageURL: product.imageURL,
        price: product.price,
        linkURL: product.linkURL,
        tags: product.tags.slice(0, 3), // I think this should be predefined in the JSON as well
      }));

    res.json(
      recommendedProducts.length > 0
        ? recommendedProducts
        : { message: "Sorry, no matching products found. Can you try again?" }
    );
  } catch (error) {
    console.error("Error processing recommendation:", error);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const OpenAI = require("openai");

const openai = new OpenAI();

let chatHistory = [{ role: "system", content: "You are a helpful assistant." }];

const generatePost = async (req, res) => { 
  if (req.query.endpoint === "chat") {
    const { message, instructions } = req.body;
    if (instructions) {
      const systemIndex = chatHistory.findIndex(entry => entry.role === "system");
      
      if (systemIndex !== -1) {
        chatHistory[systemIndex] = { role: "system", content: instructions };
      } else {
        chatHistory.unshift({ role: "system", content: instructions });
      }
    }
    
    chatHistory.push({ role: "user", content: message });
    res.status(200).json({ success: true });
  } else if (req.query.endpoint === "reset") {
    chatHistory = [
      { role: "system", content: "You are a helpful assistant." },
    ];
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: "Not Found" });
  }
};

const generateGet = async (req, res) => {
  if (req.query.endpoint === "history") {
    res.status(200).json(chatHistory);
  } else if (req.query.endpoint === "stream") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const stream = await openai.beta.chat.completions.stream({
        model: "gpt-4o",
        messages: chatHistory,
        stream: true,
      });

      for await (const chunk of stream) {
        const message = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      }

      const chatCompletion = await stream.finalChatCompletion();
    } catch (error) {
      res.write(
        "event: error\ndata: " +
          JSON.stringify({ message: "Stream encountered an error" }) +
          "\n\n"
      );
    }

    return new Promise((resolve) => {
      req.on("close", () => {
        resolve();
      });
    });
  } else {
    res.status(404).json({ error: "Not Found" });
  }
};

module.exports = { generatePost, generateGet };
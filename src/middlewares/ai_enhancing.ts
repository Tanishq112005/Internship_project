import { GoogleGenAI } from "@google/genai";

require('dotenv').config();
const ai = new GoogleGenAI({
  apiKey: process.env.google_key,
});


function buildPrompt(description : string): string {
  return `You Have to enhance the given description into more detailed and more readable format the given descrpition is ${description}`;
}

async function ai_testing(req: any, res: any , next : any) {
  const {brandName , description} = req.body;

  if (!brandName || !description ) {
    return res.status(400).json({ msg: "Missing 'description' or 'brand_name' in request body." });
  }

  

  console.log("--- Sending to AI (v2 Prompt) ---");
  const prompt = buildPrompt(description);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const resultText = response.text?.trim() || "AI did not provide a valid response.";
    req.body = {
        brandName : brandName , 
        description : resultText 
    } ; 
    
    next() ; 

  } catch (err: any) {
    console.error("GenAI error:", err);
    return res.status(500).json({
      Error: {
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
      }
    });
  }
}

export default ai_testing;
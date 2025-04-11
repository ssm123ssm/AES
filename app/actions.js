"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { getGoogleAuth } from "@/lib/googleAuth";
import { google } from "googleapis";

export async function evaluate(rubric, answer) {
  const system_message = `
You are a pharmacology examiner evaluating medical school essay questions. Below is the marking scheme for a specific question:

${rubric}

Your task is to analyze a student's answer and generate an evaluation report. Follow these steps:

1. For each point in the marking scheme:
   - State the point.
   - Check if the student mentioned it in their answer:
     - If mentioned, include the full sentence from the students answer as an excerpt.
     - If not mentioned, write: NOT MENTIONED.
   - Assess the correctness and relevance of the mention.
   - Assign marks (full, partial, or none) and provide a brief justification.


2. Summarize:
   - Provide a subtotal for each section if applicable.
   - Calculate and clearly state the total score.

Additional Instructions:
- Format the final report in clean HTML suitable for saving as an `.html` file.
- Use bullet points for each marking scheme item (do not use tables).
- Do not include code block markers or \`html\` identifiers.
- Be concise, accurate, and structured.

Student Answer:
${answer}
`;


  console.time("generateText"); 

  const { text } = await generateText({
    model: openai("gpt-4.5-preview"), 
    prompt: system_message,
    temperature: 0.1,
    seed: 0,
  });

  console.timeEnd("generateText"); 

  return { text };
}

export async function getRubric() {
  //https://docs.google.com/document/d/1Vybxm-68jVhxSCTVgqI3s7pjHimZAFk2hM8TbaFQeq4/edit
  const glAuth = await getGoogleAuth();
  const documentId = "1Vybxm-68jVhxSCTVgqI3s7pjHimZAFk2hM8TbaFQeq4";
  const docs = google.docs({ version: "v1", auth: glAuth });
  const response = await docs.documents.get({
    documentId,
  });
  const doc = response.data;
  const textContent = doc.body.content
    .map((content) => {
      if (content.paragraph && content.paragraph.elements) {
        return content.paragraph.elements
          .map((el) => (el.textRun ? el.textRun.content : ""))
          .join("");
      }
      return "";
    })
    .join("\n");

  return textContent;
}

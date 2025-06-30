"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { getGoogleAuth } from "@/lib/googleAuth";
import { google } from "googleapis";

export async function evaluate(rubric, answer) {
  const system_message = `
    You are an examiner of a pharmacology exam in medical school. Following are the questions and marking schemes for the essay questions. Formulate the analysis report for the questions.
    ${rubric}

    The analysis report should contain the following:
    1. List down each point in the marking scheme and if the student has mentioned the point in his answer, show the excerpt (as the full sentence) from the student answer. If it is not mentioned, mention NOT MENTIONED. Evaluate the correctness of the answer. Based on each point in the marking scheme, assign a score to each point (decide whether to give full marks or partial marks and mention your justification as well, for each point and mention the marks awarded). The student does not need to discribe the point in detail, just mentioning the point is enough.
    2. Calculate the marks for each section and calculate the total score to the student answer.

    Student answer: ${answer}

    The final report should be in HTML with necessary formatting, which will be saved directly as a HTML file. Do not include triple backticks and html identifier. Be concise and to the point. Most important thing is the accuracy. Do not format as a table. Use bullet points for each point in the marking scheme. Do not include preamble like "Here is the analysis report" or "The student answer is". Just start with the analysis report directly

  `;

  console.time("generateText"); // Start the timer

  /* const { text, finishReason, usage } = await generateText({
    model: openai("gpt-4o"),
    prompt: system_message,
    temperature: 0,
  }); */

  const { text } = await generateText({
    model: anthropic("claude-opus-4-20250514"), //anthropic("claude-3-5-sonnet-20240620"),
    prompt: system_message,
    temperature: 0.1,
    seed: 0,
  });

  console.timeEnd("generateText"); // End the timer and log the time

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

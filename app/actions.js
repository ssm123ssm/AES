"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { getGoogleAuth } from "@/lib/googleAuth";
import { google } from "googleapis";

export async function evaluate(rubric, answer) {
  const system_message = `
    You are an examiner of a pharmacology exam in medical school. Following are the questions and marking schemes for the essay questions.
    ${rubric}
    1. List down each point in the marking scheme and if the student has mentioned the point in his answer, show the excerpt (as the full sentence) from the student answer. If it is not mentioned, mention NOT MENTIONED.
    2. Evaluate the correctness of the answer and the scientific facts should be exactly correct. Based on each point in the marking scheme, assign a score to each point (decide whether to give full marks or partial marks and mention your justification as well, for each point and mention the marks awarded). The student does not need to discribe the point in detail, just mentioning the point is enough.
    3. Finally, calculate the marks for each section and calculate the total score to the student answer.
    Student answer: ${answer}
    The final report should be in HTML with necessary formatting, which will be saved directly as a HTML file. Do not include triple backticks and html identifier.
  `;

  /* const { text, finishReason, usage } = await generateText({
    model: openai("gpt-4o"),
    prompt: system_message,
    temperature: 0,
  }); */

  const { text } = await generateText({
    model: openai("gpt-4o"), //anthropic("claude-3-5-sonnet-20240620"),
    prompt: system_message,
    temperature: 0,
  });

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

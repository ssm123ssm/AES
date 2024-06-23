"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function getAnswer(question) {
  const { text, finishReason, usage } = await generateText({
    model: openai("gpt-4o"),
    prompt: question,
    temperature: 0,
  });

  return { text, finishReason, usage };
}

export async function evaluate(rubric, answer) {
  const system_message =
    " You are an examiner of a pharmacology exam in medical school. Following are the questions and marking schemes for the essay questions. \n" +
    rubric +
    "\n" +
    "1. List down each point in the marking scheme and if the student has mentioned the point in his answer, show the excerpt (as the full sentence) from the student answer. If it is not mentioned, mention NOT MENTIONED. \n" +
    "2. Evaluate the correctness of the answer and the scientific facts should be exactly correct. Based on each point in the marking scheme, assign a score to each point (decide whether to give full marks or partial marks and mention your justification as well, for each point and mention the marks awarded).\n" +
    "3. Finally, calculate the marks for each section and calculate the total score to the student answer. \n" +
    "Student answer: \n" +
    answer +
    "\n The final report should be in HTML with necessary formatting, which will be saved directly as a HTML file. Do not include triple backticks and html identifier \n";

  console.log(system_message);

  const { text, finishReason, usage } = await generateText({
    model: openai("gpt-4o"),
    prompt: system_message,
    temperature: 0,
  });

  return { text, finishReason, usage };
  //return { text: system_message, finishReason: "completed", usage: 0 };
}

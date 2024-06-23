import { google } from "googleapis";

let glAuth;

export async function getGoogleAuth() {
  if (!glAuth) {
    glAuth = await google.auth.getClient({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/documents.readonly"],
    });
  }
  return glAuth;
}

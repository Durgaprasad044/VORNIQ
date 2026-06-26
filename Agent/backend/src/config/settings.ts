function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const settings = {
  PORT: process.env.PORT || "4000",
  GROQ_API_KEY: required("GROQ_API_KEY"),
  GROQ_MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  HINDSIGHT_URL: required("HINDSIGHT_URL"),
  HINDSIGHT_API_KEY: required("HINDSIGHT_API_KEY"),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
};

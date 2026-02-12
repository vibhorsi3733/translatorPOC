export async function translateText({
  text,
  source,
  target,
}: {
  text: string;
  source: string;
  target: string;
}): Promise<string> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: source || "auto",
      target,
      format: "text",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.translatedText;
}

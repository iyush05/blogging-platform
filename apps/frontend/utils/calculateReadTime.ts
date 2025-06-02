
type JSONNode = {
  type: string;
  attrs?: Record<string, any>;
  content?: JSONNode[];
  text?: string;
};

const extractTextFromJSON = (node: JSONNode): string => {
  let text = "";

  if (node.text) {
    text += node.text + " ";
  }

  if (node.content) {
    for (const child of node.content) {
      text += extractTextFromJSON(child);
    }
  }

  return text;
};

export const calculateReadTime = (doc: JSONNode): number => {
  const fullText = extractTextFromJSON(doc);
  const wordCount = fullText.trim().split(/\s+/).length;
  const wordsPerMinute = 150;

  const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return readTimeMinutes;
};

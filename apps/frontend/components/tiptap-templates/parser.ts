
export default function extractTitle(content: any): string | null {
    if(!content || !Array.isArray(content.content)) return null

    for(const node of content.content) {
        if(node.type === "heading" && node.attrs?.level === 1) {
            return node.content?.map((n: any) => n.text).join("") || "";
        }
    }
    return null;
}
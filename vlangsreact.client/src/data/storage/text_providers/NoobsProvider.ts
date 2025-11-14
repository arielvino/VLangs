export interface NoobsProvider {
  type: "noobs";
  generateTip(topic: string): Promise<string>;
}
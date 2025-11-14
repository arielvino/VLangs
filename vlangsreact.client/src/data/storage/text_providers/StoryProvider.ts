export interface StoryProvider {
  getScene(id: string): Promise<string>;
  generateNextScene(choice: string): Promise<{ id: string; text: string }>;
  getAllScenes(): Record<string, string>;
}
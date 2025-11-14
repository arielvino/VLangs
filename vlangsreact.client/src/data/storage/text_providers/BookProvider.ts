export interface BookProvider {
  format: "mockpdf"|"";
  getPageCount(): number;
  getPage(pageNumber: number): Promise<string>;
}
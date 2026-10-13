import JSZip from 'jszip';

const parseXml = (text: string, type: DOMParserSupportedType = 'application/xml') =>
    new DOMParser().parseFromString(text, type);

const resolvePath = (baseFile: string, href: string): string => {
    const parts = baseFile.split('/').slice(0, -1);
    for (const seg of decodeURIComponent(href.split('#')[0]).split('/')) {
        if (seg === '..') parts.pop();
        else if (seg !== '.' && seg !== '') parts.push(seg);
    }
    return parts.join('/');
};

/** Returns the zip paths of the book's reading-order documents. */
const getSpine = async (zip: JSZip): Promise<string[]> => {
    const container = await zip.file('META-INF/container.xml')?.async('string');
    if (!container) throw new Error('Invalid EPUB: missing container.xml');
    const opfPath = parseXml(container).querySelector('rootfile')?.getAttribute('full-path');
    if (!opfPath) throw new Error('Invalid EPUB: missing package document');
    const opf = await zip.file(opfPath)?.async('string');
    if (!opf) throw new Error('Invalid EPUB: package document not found');

    const doc = parseXml(opf);
    const manifest = new Map<string, string>();
    doc.querySelectorAll('manifest > item').forEach(item => {
        const id = item.getAttribute('id');
        const href = item.getAttribute('href');
        if (id && href) manifest.set(id, resolvePath(opfPath, href));
    });

    const spine: string[] = [];
    doc.querySelectorAll('spine > itemref').forEach(ref => {
        const path = manifest.get(ref.getAttribute('idref') ?? '');
        if (path) spine.push(path);
    });
    return spine;
};

const htmlToText = (html: string): string => {
    const doc = parseXml(html, 'text/html');
    doc.querySelectorAll('script, style, head').forEach(el => el.remove());
    // Source line breaks are just whitespace in HTML; only <br> and block elements break text.
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        node.nodeValue = (node.nodeValue ?? '').replace(/\s+/g, ' ');
    }
    doc.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    // Blank line between blocks, matching how the reader splits paragraphs
    doc.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, tr, blockquote, pre').forEach(el => el.append('\n\n'));
    return (doc.body.textContent ?? '')
        .replace(/[ \t\u00a0]+/g, ' ')
        .replace(/ ?\n ?/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

class EpubReader {
    /** Number of readable sections (spine items) in the book. */
    async getPageCount(data: ArrayBuffer): Promise<number> {
        const zip = await JSZip.loadAsync(data);
        return (await getSpine(zip)).length;
    }

    /** Extracts plain text of a section; pageNumber is 1-based. */
    async extractPage(data: ArrayBuffer, pageNumber: number): Promise<string | null> {
        try {
            const zip = await JSZip.loadAsync(data);
            const path = (await getSpine(zip))[pageNumber - 1];
            if (!path) return null;
            const html = await zip.file(path)?.async('string');
            return html ? htmlToText(html) : null;
        } catch (err) {
            console.error('EPUB extraction failed:', err);
            return null;
        }
    }
}

export default new EpubReader();

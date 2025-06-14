let titleElement
let unknownwordsTitle
let storyElement
let copyWordsButton
let toggleLanguageButton
let pasteStoryButton
let wordListElement
let directionRtl
let directionLtr

let selectedWords = new Map();

const labels = {
    en: {
        title: 'Interactive Tool for Story Reading',
        unknownWords: 'Unknown Words',
        copy: 'Copy Words',
        toggle: 'עברית',
        paste: 'Paste Content',
        rtl: 'Right to Left',
        ltr: 'Left to Right'
    },
    he: {
        title: 'כלי אינטראקטיבי לקריאת סיפור',
        unknownWords: 'מילים לא מוכרות',
        copy: 'העתק מילים',
        toggle: 'English',
        paste: 'הדבק תוכן',
        rtl: 'מימין לשמאל',
        ltr: 'משמאל לימין'
    }
};

let currentLang = 'he';
let currentDirection = 'ltr'

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'he' : 'en';
    const lang = labels[currentLang];
    titleElement.textContent = lang.title;
    unknownwordsTitle.textContent = lang.unknownWords;
    copyWordsButton.textContent = lang.copy;
    toggleLanguageButton.textContent = lang.toggle;
    pasteStoryButton.textContent = lang.paste;
    directionLtr.textContent = lang.ltr;
    directionRtl.textContent = lang.rtl;
}

function toggleDirection(direction) {
    currentDirection = direction
    storyElement.style.direction = currentDirection
    wordListElement.style.direction = currentDirection
}

function renderStory(text) {
    storyElement.innerHTML = '';
    selectedWords.clear();
    updateList();
    const words = text.split(/(\s+)/);
    words.forEach((part, index) => {
        const span = document.createElement('span');
        span.textContent = part;
        if (/^\s+$/.test(part)) {
            storyElement.appendChild(document.createTextNode(part));
        } else {
            span.className = 'word';
            span.dataset.word = part.toLowerCase();
            span.onclick = () => toggleWord(span, part.toLowerCase());
            storyElement.appendChild(span);
        }
    });
}

function toggleWord(span, word) {
    const wordInstances = document.querySelectorAll(`span[data-word="${span.dataset.word}"]`);

    if (selectedWords.has(word)) {
        selectedWords.delete(word);
        wordInstances.forEach(el => {
            el.classList.remove('selected');
        });
    } else {
        selectedWords.set(word, true);
        wordInstances.forEach(el => {
            el.classList.add('selected');
        });
    }

    updateList();
}

function updateList() {
    wordListElement.innerHTML = '';
    [...selectedWords.keys()].forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordListElement.appendChild(li);
    });
}

function copyWords() {
    const text = [...selectedWords.keys()].join(', ');
    navigator.clipboard.writeText(text)
        .catch(() => console.warn('Clipboard copy failed.'));
}

async function pasteStory() {
    try {
        const text = await navigator.clipboard.readText();
        onStoryChanged(text)
    } catch (err) {
        alert("Failed to read clipboard contents: " + err);
    }
}

function onStoryChanged(newStory) {
    renderStory(newStory);
}

function initPage() {
    titleElement = document.getElementById('title');
    unknownwordsTitle = document.getElementById('unknownWordsTitle');
    storyElement = document.getElementById('story');
    copyWordsButton = document.getElementById('copyBtn');
    toggleLanguageButton = document.getElementById('toggleLangBtn');
    pasteStoryButton = document.getElementById('pasteBtn');
    wordListElement = document.getElementById('wordList');
    directionRtl = document.getElementById('dirRtl');
    directionLtr = document.getElementById('dirLtr');

    toggleLanguageButton.onclick = function () { toggleLanguage() };
    copyWordsButton.onclick = function () { copyWords() };
    pasteStoryButton.onclick = function () { pasteStory() };
    directionRtl.onclick = function () { toggleDirection('rtl') };
    directionLtr.onclick = function () { toggleDirection('ltr') };

    document.getElementById('menuToggle').onclick = function () {
        const menu = document.getElementById('menuTray');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };

    toggleLanguage()
}

document.addEventListener('DOMContentLoaded', function () {
    initPage()
});
import './css/App.css';
import TextReader from './TextReader';

function App() {
    const sampleText = `The quick brown fox jumps over the lazy dog. The dog, not amused, barked back at the fox. 
Meanwhile, another quick fox watched silently from the shadows. Quick reflexes are common among foxes.`;
 `Hello there! This is a test. Click any word (not punctuation) to highlight it. "Cool," right?`;

    return (
        <TextReader text={sampleText} />
    );
}

export default App;
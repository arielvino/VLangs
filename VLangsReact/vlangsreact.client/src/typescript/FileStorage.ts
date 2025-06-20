export function saveFile(name: string, data: ArrayBuffer): Promise<void> {
    return saveFileToIndexedDB(name, data);
}

export function loadFile(name: string): Promise<ArrayBuffer | undefined> {
    return loadFileFromIndexedDB(name);
}

function saveFileToIndexedDB(name: string, data: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FileStoreDB', 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files');
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction('files', 'readwrite');
            const store = tx.objectStore('files');
            store.put(data, name);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };

        request.onerror = () => reject(request.error);
    });
}


function loadFileFromIndexedDB(name: string): Promise<ArrayBuffer | undefined> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FileStoreDB', 1);

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction('files', 'readonly');
            const store = tx.objectStore('files');
            const getRequest = store.get(name);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}
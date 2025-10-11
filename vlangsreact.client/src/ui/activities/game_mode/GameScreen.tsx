//import React, { useState, useEffect } from 'react';
//import TextReader from '../reading/TextReader';

//type AdventureResponse = {
//    story: string;
//    choices: string[];
//};

//type TextAdventureProps = {
//    targetLanguage: string;
//    difficulty: 'beginner' | 'intermediate' | 'advanced';
//    theme?: string;
//};

//export const TextAdventure: React.FC<TextAdventureProps> = ({
//    targetLanguage,
//    difficulty,
//    theme,
//}) => {
//    const [adventure, setAdventure] = useState<AdventureResponse | null>(null);
//    const [isLoading, setIsLoading] = useState<boolean>(false);
//    const [error, setError] = useState<string | null>(null);

//    // Start the adventure when component mounts
//    useEffect(() => {
//        startAdventure();
//    }, []);

//    const startAdventure = async () => {
//        setIsLoading(true);
//        setError(null);
//        try {
//            const response = await fetch('/api/adventure/start', {
//                method: 'GET',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//                body: JSON.stringify({
//                    targetLanguage,
//                    difficulty,
//                    theme,
//                    // maybe also a "history" or "context" if needed
//                }),
//            });
//            if (!response.ok) {
//                throw new Error(`HTTP error! status: ${response.status}`);
//            }
//            const data: AdventureResponse = await response.json();
//            setAdventure(data);
//        } catch (e) {
//            setError((e as Error).message);
//        } finally {
//            setIsLoading(false);
//        }
//    };

//    const chooseOption = async (choice: string) => {
//        setIsLoading(true);
//        setError(null);
//        try {
//            const response = await fetch('/api/generateAdventure', {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//                body: JSON.stringify({
//                    targetLanguage,
//                    difficulty,
//                    theme,
//                    // pass context/history plus the chosen option
//                    previousStory: adventure?.story,
//                    chosenOption: choice,
//                    // maybe also previous choices
//                }),
//            });
//            if (!response.ok) {
//                throw new Error(`HTTP error! status: ${response.status}`);
//            }
//            const data: AdventureResponse = await response.json();
//            setAdventure(data);
//        } catch (e) {
//            setError((e as Error).message);
//        } finally {
//            setIsLoading(false);
//        }
//    };

//    return (
//        <div className="text-adventure-container">
//            {isLoading && <p>Loading...</p>}
//            {error && <p className="error">Error: {error}</p>}
//            {adventure && (
//                <>
//                    <TextReader text={adventure.story} />
//                    <div className="choices">
//                        {adventure.choices.map((choice, idx) => (
//                            <button
//                                key={idx}
//                                onClick={() => chooseOption(choice)}
//                                disabled={isLoading}
//                            >
//                                {choice}
//                            </button>
//                        ))}
//                    </div>
//                </>
//            )}
//        </div>
//    );
//};
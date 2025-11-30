import { useEffect, useState } from "react";
import { useTab } from "../../../contexts/TabContext";
import LearnableText from "../../components/LearnableText";
import { Box, CircularProgress, Typography } from "@mui/material";

interface TextLoaderProps {
    page: number;
}

const TextLoader: React.FC<TextLoaderProps> = ({ page }) => {
    const tab = useTab();
    const [text, setText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setText(null);
        setIsLoading(true);
        setError(null);

        tab.getPageText(page)
            .then((loadedText) => {
                console.log('Content loaded:', loadedText?.substring(0, 100));
                setText(loadedText);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load content:', err);
                setError(err.message || 'Failed to load content');
                setIsLoading(false);
            });
    }, [tab, page]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Loading content...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Typography variant="h6" color="error">
                    Error Loading Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {error}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Unable to load the requested content.
                </Typography>
            </Box>
        );
    }

    if (!text || text.trim().length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    No content found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The content appears to be empty or couldn't be extracted.
                </Typography>
            </Box>
        );
    }

    return <LearnableText text={text} />;
};

export default TextLoader;

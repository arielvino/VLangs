import { useEffect } from "react";
import { useTab } from "../../../contexts/TabContext";
import LearnableText from "../../components/LearnableText";

interface TabTextLoaderProps {
    page: number;
}

const TabTextLoader: React.FC<TabTextLoaderProps> = ({ page }) => {
    const tab = useTab();

    useEffect(() => {
        tab.loadPage(page);
    }, [page]);

    return <LearnableText />;
};

export default TabTextLoader;

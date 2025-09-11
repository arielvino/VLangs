import { Button, Stack } from "@mui/material";
import React from "react";

interface LandingScreenProps {
    onNavigateToTabsMenu: () => void
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigateToTabsMenu }) => {
    return (
        <Stack direction={"column"} spacing={2}>
            <p>Hello world!</p>
            <Button onClick={onNavigateToTabsMenu} >*START*</Button>
        </Stack>
    );
}

export default LandingScreen;
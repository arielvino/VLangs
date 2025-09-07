import { Box, Stack, Typography, useTheme } from "@mui/material";
import type React from "react";
import { useDictionary } from "../localization/Strings";
import { InfoOutlined } from "@mui/icons-material";

interface InfoComponentProps {
    message: string;
}

const InfoComponent: React.FC<InfoComponentProps> = ({ message }) => {
    const theme = useTheme();
    const dict = useDictionary();

    return <Stack
        direction="row"
        alignItems="center"
        flexDirection={dict.direction === 'ltr' ? 'row' : 'row-reverse'}
        sx={{
            border: `1px solid ${theme.palette.info.main}`,
            p: 1, // optional padding so content doesn’t touch the border
            borderRadius: 1, // optional rounding
        }}
    >
        <InfoOutlined
            color="info"
        />
        <Box width={0.03} />
        <Typography
            align="justify"
            fontSize={12}
            color="info"
            dir={dict.direction === 'ltr' ? 'ltr' : 'rtl'}
        >
            {message}
        </Typography>
    </Stack>;
}

export default InfoComponent;
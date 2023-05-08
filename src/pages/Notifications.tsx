import { Box, Divider, Typography, useTheme } from '@mui/material'

export function Notifications(): JSX.Element {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '20px',
                background: theme.palette.background.paper,
                minHeight: '100%',
                overflow: 'scroll'
            }}
        >
            <Typography variant="h2" gutterBottom>
                Notifications
            </Typography>
            <Divider />
        </Box>
    )
}

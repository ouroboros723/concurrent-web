import { Box, IconButton, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { type EmojiPackage, type RawEmojiPackage } from '../model'

export interface EmojipackCardProps {
    src: string
    icon: JSX.Element
    onClick?: (pack: EmojiPackage) => void
}

export const EmojipackCard = (props: EmojipackCardProps): JSX.Element => {
    const [preview, setPreview] = useState<EmojiPackage | null>(null)

    useEffect(() => {
        if (props.src) {
            fetch(props.src)
                .then((j) => j.json())
                .then((p: RawEmojiPackage) => {
                    setPreview({ ...p, packageURL: props.src })
                })
                .catch(() => {
                    setPreview(null)
                })
        } else {
            setPreview(null)
        }
    }, [props.src])

    return (
        <Paper
            variant="outlined"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 1,
                gap: 1,
                justifyContent: 'space-between'
            }}
        >
            <Box display="flex">
                <Box component="img" src={preview?.iconURL} alt={preview?.name} height="3rem" />
            </Box>
            <Typography variant="h4" gutterBottom>
                {preview?.name}
            </Typography>
            <IconButton
                onClick={() => {
                    if (props.onClick && preview) {
                        props.onClick(preview)
                    }
                }}
            >
                {props.icon}
            </IconButton>
        </Paper>
    )
}

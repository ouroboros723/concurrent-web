import { Box, SwipeableDrawer, styled, useMediaQuery, useTheme } from '@mui/material'
import grey from '@mui/material/colors/grey'

export interface CCDrawerProps {
    children?: JSX.Element | JSX.Element[]
    open: boolean
    onOpen?: () => void
    onClose?: () => void
}

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 1,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)'
}))

export const CCDrawer = (props: CCDrawerProps): JSX.Element => {
    const theme = useTheme()
    const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <SwipeableDrawer
            disableSwipeToOpen
            anchor={greaterThanSm ? 'right' : 'bottom'}
            open={props.open}
            onOpen={() => {
                props.onOpen?.()
            }}
            onClose={() => {
                props.onClose?.()
            }}
            PaperProps={{
                sx: {
                    width: {
                        xs: '100%',
                        sm: '500px'
                    },
                    height: {
                        xs: '80vh',
                        sm: '100%'
                    },
                    borderRadius: {
                        xs: '10px 10px 0 0',
                        sm: '10px 0 0 10px'
                    },
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }
            }}
        >
            <Puller visibility={greaterThanSm ? 'hidden' : 'visible'} />
            {props.children}
        </SwipeableDrawer>
    )
}

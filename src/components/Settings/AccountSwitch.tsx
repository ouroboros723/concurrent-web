import {
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Typography,
    useTheme
} from '@mui/material'
import { ThemeCreator } from '../ThemeCreator'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type User } from '@concurrent-world/client'
import { useClient } from '../../context/ClientContext'
import { usePreference } from '../../context/PreferenceContext'
import { type ConcurrentTheme } from '../../model'
import { Themes, loadConcurrentTheme } from '../../themes'
import { DummyMessageView } from '../Message/DummyMessageView'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { ThemeCard } from '../ThemeCard'
import { OwnAccountManager } from './AccountSwitch/OwnAccountManager'

export const AccountSwitch = (): JSX.Element => {
    // const { client } = useClient()
    // const [userList, setUserList] = useState<Array<User|null|undefined>>([])
    const { t } = useTranslation('', { keyPrefix: 'ui' })

    const [menuElem, setMenuElem] = useState<[string, null | HTMLElement]>(['', null])

    // useEffect(() => {
    //     const credentialRaw = localStorage.getItem('credentials')
    //     if (!credentialRaw) return
    //     const credentials = JSON.parse(credentialRaw)
    //     Object.keys(credentials).map((e) => {
    //         console.log(e)
    //         client.getUser(e).then((user: User|null) => {
    //             console.log(user)
    //             let loggedInUsers: Array<User | null | undefined> = userList
    //             loggedInUsers.push(user)
    //             setUserList(loggedInUsers)
    //             loggedInUsers = []
    //             console.log(userList)
    //         })
    //     })
    // }, [localStorage.getItem('credentials')])

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <OwnAccountManager />
        </Box>
    )
}

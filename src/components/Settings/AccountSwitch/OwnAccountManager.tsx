import { memo, useEffect, useState } from 'react'
import { useClient } from '../../../context/ClientContext'
import { Avatar, Box, Button, Divider, IconButton, Link, Paper, TextField, Typography } from '@mui/material'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { CCDrawer } from '../../ui/CCDrawer'
import CredentialStorage from '../../../utils/CredentialStorage'
import { type User } from '@concurrent-world/client'

interface Stats {
    ownAccounts: string[]
}

export const OwnAccountManager = (): JSX.Element => {
    const { client } = useClient()
    const [stats, setStats] = useState<Stats | null>(null)
    const [userID, setUserID] = useState('')
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [userList, setUserList] = useState<Array<User | null | undefined>>([])

    const anotherLogin = (target: string): void => {
        client.api
            .fetchWithCredential(client.api.host, `/ap/api/follow/${target}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(async (res) => await res.json())
            .then((data) => {
                console.log(data)
                getOwnAccounts()
                setDrawerOpen(false)
            })
    }

    const logout = (targetCcid: string): void => {
        CredentialStorage.destroyAccount(targetCcid)
    }

    const getOwnAccounts = (): void => {
        const credentialRaw = localStorage.getItem('credentials')
        if (!credentialRaw) return
        const credentials = JSON.parse(credentialRaw)
        Object.keys(credentials).forEach((e) => {
            console.log(e)
            client.getUser(e).then((user: User | null) => {
                console.log(user)
                let loggedInUsers: Array<User | null | undefined> = userList
                loggedInUsers.push(user)
                setUserList(loggedInUsers)
                loggedInUsers = []
                console.log(userList)
            })
        })
    }

    useEffect(() => {
        getOwnAccounts()
    }, [localStorage.getItem('credentials')])

    return (
        <>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'column', md: 'row' }} gap={1}>
                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" height="40px">
                        <Typography variant="h2">{stats?.ownAccounts.length}個のアカウントにログイン</Typography>
                        <IconButton
                            sx={{
                                backgroundColor: 'primary.main',
                                mx: 1,
                                '&:hover': {
                                    backgroundColor: 'primary.dark'
                                }
                            }}
                            onClick={() => {
                                setDrawerOpen(true)
                            }}
                        >
                            <PersonAddAlt1Icon
                                sx={{
                                    color: 'primary.contrastText'
                                }}
                            />
                        </IconButton>
                    </Box>
                    {userList.map((value, index) => (
                        <OwnAccountCard
                            key={index}
                            userData={value}
                            logout={(a) => {
                                logout(a)
                            }}
                        />
                    ))}
                </Box>
            </Box>
            <CCDrawer
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                }}
            >
                <Box display="flex" flexDirection="column" p={1} gap={1}>
                    <Typography variant="h2">Activitypubユーザーのフォロー</Typography>
                    <Divider />
                    <TextField
                        label="follow"
                        placeholder="@username@host"
                        value={userID}
                        onChange={(x) => {
                            setUserID(x.target.value)
                        }}
                    />
                    <Button
                        onClick={() => {
                            anotherLogin(userID)
                        }}
                    >
                        follow
                    </Button>
                </Box>
            </CCDrawer>
        </>
    )
}

export const OwnAccountCard = memo<{ userData: User | null | undefined; logout?: (_: string) => void }>(
    (props: { userData: User | null | undefined; logout?: (_: string) => void }): JSX.Element => {
        const { client } = useClient()
        const [person, setPerson] = useState<any>(null)
        // const host = props.userData.split('/')[2]
        // const shortID = `@${person?.preferredUsername}@${host}`
        const accountKeyList: string[] = ['Domain', 'Mnemonic', 'PrivateKey', 'SubKey']

        useEffect(() => {
            setPerson(props.userData)
        }, [props.userData])

        console.log(person)

        if (!person) return <>loading...</>

        return (
            <Paper
                sx={{
                    display: 'flex',
                    p: 1,
                    backgroundImage: person.image ? `url(${person.image.url})` : undefined,
                    backgroundSize: 'cover',
                    gap: 1,
                    textDecoration: 'none'
                }}
            >
                <Avatar src={person.icon?.url} />
                <Box
                    sx={{
                        display: 'flex',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        p: 1,
                        borderRadius: 1,
                        flexDirection: 'column',
                        flex: 1
                    }}
                >
                    <Typography variant="h3">{person.name || person.preferredUsername}</Typography>
                    <Link
                        underline="hover"
                        onClick={() => {
                            CredentialStorage.setCurrentAccount(person.ccid)
                            const newUserData = CredentialStorage.getAccountItemAll(person.ccid)
                            accountKeyList.forEach((key: string) => {
                                console.log(newUserData[key])
                                localStorage.setItem(key, JSON.stringify(newUserData[key] ?? ''))
                            })
                            window.location.reload()
                        }}
                        rel="noopener noreferrer"
                    >
                        test
                    </Link>
                </Box>
                {props.logout && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <IconButton
                            onClick={() => props.logout?.(props.userData?.ccid ?? '')}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,1)'
                                }
                            }}
                        >
                            <PersonRemoveIcon />
                        </IconButton>
                    </Box>
                )}
            </Paper>
        )
    }
)

OwnAccountCard.displayName = 'OwnAccountCard'

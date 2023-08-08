import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Checkbox,
    Divider,
    IconButton,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material'
import { type Commonstream, Schemas, type Stream } from '@concurrent-world/client'
import { useApi } from '../context/api'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { CCDrawer } from '../components/ui/CCDrawer'
import Background from '../resources/defaultbg.png'

import Fuse from 'fuse.js'
import { CCEditor } from '../components/ui/cceditor'
import { useSnackbar } from 'notistack'

import DoneAllIcon from '@mui/icons-material/DoneAll'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import { AddListButton } from '../components/AddListButton'

interface StreamWithDomain {
    domain: string
    stream: Stream
}

export function Explorer(): JSX.Element {
    const client = useApi()
    const theme = useTheme()
    const navigate = useNavigate()

    const [domains, setDomains] = useState<string[]>([])
    const [selectedDomains, setSelectedDomains] = useState<string[]>([client.api.host])

    const [streams, setStreams] = useState<StreamWithDomain[]>([])
    const [searchResult, setSearchResult] = useState<StreamWithDomain[]>([])
    const [search, setSearch] = useState<string>('')

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    const fuse = useRef<Fuse<StreamWithDomain> | null>(null)

    const { enqueueSnackbar } = useSnackbar()

    const load = (): void => {
        client.api.getKnownHosts().then((e) => {
            if (!client.api.host) return
            const domains = [client.api.host, ...e.filter((e) => e.fqdn !== client.api.host).map((e) => e.fqdn)]
            setDomains(domains)
        })
    }

    useEffect(() => {
        if (selectedDomains.length === 0) {
            setStreams([])
            setSearchResult([])
            return
        }
        Promise.all(
            selectedDomains.map(async (e) => {
                const streams = await client.getCommonStreams(e)
                return streams.map((stream) => {
                    return {
                        domain: e,
                        stream
                    }
                })
            })
        ).then((e) => {
            const streams = e.flat()
            setStreams(streams)
            setSearchResult(streams)
        })
    }, [selectedDomains])

    const createNewStream = (stream: Commonstream): void => {
        client.api
            .createStream(Schemas.commonstream, stream)
            .then((e: any) => {
                const id: string = e.id
                if (id) navigate('/stream#' + id)
                else enqueueSnackbar('ストリームの作成に失敗しました', { variant: 'error' })
            })
            .catch((e) => {
                console.error(e)
                enqueueSnackbar('ストリームの作成に失敗しました', { variant: 'error' })
            })
    }

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        if (streams.length === 0) return
        fuse.current = new Fuse(streams, {
            keys: ['stream.name', 'stream.description'],
            threshold: 0.3
        })
    }, [streams])

    useEffect(() => {
        if (fuse.current === null) return
        if (search === '') {
            setSearchResult(streams)
            return
        }
        setSearchResult(fuse.current.search(search).map((e) => e.item))
    }, [search])

    if (!client.api.host) return <>loading...</>

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                padding: '20px',
                background: theme.palette.background.paper,
                minHeight: '100%',
                overflowY: 'scroll'
            }}
        >
            <Typography variant="h2" gutterBottom>
                Explorer
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Domains
                </Typography>
                <Box>
                    <IconButton
                        onClick={() => {
                            setSelectedDomains([])
                        }}
                    >
                        <RemoveDoneIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDomains(domains)
                        }}
                    >
                        <DoneAllIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2
                }}
            >
                {domains.map((e) => {
                    return (
                        <Paper
                            key={e}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                gap: 1,
                                outline: selectedDomains.includes(e)
                                    ? '2px solid ' + theme.palette.primary.main
                                    : 'none'
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                {e}
                            </Typography>
                            <Checkbox
                                checked={selectedDomains.includes(e)}
                                onChange={(event) => {
                                    if (event.target.checked) setSelectedDomains([...selectedDomains, e])
                                    else setSelectedDomains(selectedDomains.filter((f) => f !== e))
                                }}
                            />
                        </Paper>
                    )
                })}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h3" gutterBottom>
                    ストリーム
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        setDrawerOpen(true)
                    }}
                >
                    新しく作る
                </Button>
            </Box>
            <TextField
                label="search"
                variant="outlined"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
            />
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2
                }}
            >
                {searchResult.map((value) => {
                    return (
                        <Card key={value.stream.id}>
                            <CardActionArea component={Link} to={'/stream#' + value.stream.id}>
                                <CardMedia component="img" height="140" image={value.stream.banner || Background} />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {value.stream.name}
                                        {value.stream.author === client.ccid ? ' (owner)' : ''}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {value.stream.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {value.domain}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <AddListButton stream={value.stream.id} />
                            </CardActions>
                        </Card>
                    )
                })}
            </Box>
            <CCDrawer
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                }}
            >
                <Box p={1}>
                    <Typography variant="h3" gutterBottom>
                        ストリーム新規作成
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        あなたの管轄ドメイン{client.api.host}に新しいストリームを作成します。
                    </Typography>
                    <Divider />
                    <CCEditor schemaURL={Schemas.commonstream} onSubmit={createNewStream} />
                </Box>
            </CCDrawer>
        </Box>
    )
}

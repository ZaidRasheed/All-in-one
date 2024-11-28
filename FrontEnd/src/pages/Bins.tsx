import { Button } from 'react-bootstrap'

import { Trash, Pencil, ExclamationTriangleFill, Repeat } from 'react-bootstrap-icons'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import useBins from '../hooks/useBins'

import { AppData, Bin } from '../context/appContext'
import { useMemo } from 'react'

const Bins = () => {

    const { data, refreshData } = AppData();

    const {
        id,
        setId,
        level,
        setLevel,
        bin,
        binIds,
        binLevels,
        showEnableDisableBin,
        EnableDisableModal,
        DeleteModal,
        showDeleteBin,
        EditModal,
        showEditBin
    } = useBins(data)


    const filteredData = useMemo(() => {
        const tempData: Bin[] = [];
        
        if(!id.length && !level.length) return data;

        if (id.length) {
            data.forEach(bin => {
                bin.id.includes(id) && tempData.push(bin)
            })
        }
        if (level.length) {
            data.forEach(bin => {
                bin.level === level && tempData.push(bin)
            })
        }
        return tempData
    }, [data, id, level])

    return (
        <TableContainer sx={{ margin: 1, padding: 5 }} style={{ maxHeight: '100vh', overflow: 'hidden' }}>
            {DeleteModal}
            {EditModal}
            {EnableDisableModal}
            <h1 className='display-2'>Search</h1>
            <Box sx={{ flexGrow: 1, marginBottom: 3, marginTop: 4 }}>
                <Grid container spacing={10}>
                    <Grid item xs={4}>
                        <Autocomplete
                            disablePortal
                            selectOnFocus
                            clearOnBlur
                            options={binIds}
                            onChange={(e, value) => {
                                if (value) 
                                    setId(value.label)
                                else
                                    setId('')
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="ID" />}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            disablePortal
                            selectOnFocus
                            clearOnBlur
                            options={binLevels}
                            onChange={(e, value) => {
                                if (value)
                                    setLevel(value.label)
                                else
                                    setLevel('')
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Level" />}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant='outline-secondary'
                            onClick={() => { refreshData() }}>
                            <Repeat size={40} />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Paper
                style={{ minHeight: 'auto', maxHeight: '900px', overflow: 'auto' }}
            >
                <Table
                    stickyHeader
                    sx={{ maxHeight: 400 }}
                    aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: 'white', backgroundColor: '#242A31' }}>Bin ID</TableCell>
                            <TableCell style={{ color: 'white', backgroundColor: '#242A31' }} align="center">Level</TableCell>
                            <TableCell style={{ color: 'white', backgroundColor: '#242A31' }} align="center">Edit</TableCell>
                            <TableCell style={{ color: 'white', backgroundColor: '#242A31' }} align="center">Enabled /Disabled</TableCell>
                            <TableCell style={{ color: 'white', backgroundColor: '#242A31' }} align="center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData?.map((bin, i) => (
                            <TableRow
                                key={bin.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" >
                                    {bin.id}
                                </TableCell>
                                <TableCell align="center" style={{ color: bin.level === 'full' ? 'red' : bin.level === 'half' ? 'orange' : 'green' }}>
                                    <b>{bin.level.charAt(0).toUpperCase() + String(bin.level).slice(1)}</b>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant='outline-success'
                                        onClick={() => { showEditBin(bin) }}>
                                        <Pencil />
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant={bin.enabled ? 'outline-warning' : 'warning'}
                                        onClick={() => { showEnableDisableBin(bin) }}>
                                        <ExclamationTriangleFill />
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant='outline-danger'
                                        onClick={() => { showDeleteBin(bin) }}>
                                        <Trash />
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </TableContainer >
    );
}

export default Bins;

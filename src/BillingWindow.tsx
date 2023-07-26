import React, { useState, useRef } from 'react';
import {
    Button, Alert, Chip,
    Dialog, DialogContent, DialogActions, DialogTitle, TextField,
    FormGroup, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Box,
} from '@mui/material';
import { Settings } from './types'
import useStore from './store'
import { ThemeMode } from './theme/index';
import { useThemeSwicher } from './theme/ThemeSwitcher';
import { Trans, useTranslation } from 'react-i18next'
import { handleSSE } from './client'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { LLM } from './types'

interface Props {
    open: boolean
    close(): void
}

const columns = [
    "Language Models",
    "Credits",
    "Actions"
]

const llms: LLM[] = [
    {
        name: "gpt-4-32K",
        description: "gpt4 with 32K tokens",
        credits: () => {return "200"},
        action: () => {}
    }
]

export default function CreditsWindow(props: Props) {
    const { t } = useTranslation()
    const [, { setMode }] = useThemeSwicher();


    const store = useStore()
    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog open={props.open} fullWidth >
            <DialogTitle>{t('credits')}</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => {
                                    return (<TableCell>{column}</TableCell>)
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>Row {index + 1}, Data 1</TableCell>
                                    <TableCell>Row {index + 1}, Data 2</TableCell>
                                    <TableCell>Row {index + 1}, Data 3</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <DialogActions>
                    <Button onClick={props.close}>{t('cancel')}</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

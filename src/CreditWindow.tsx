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

interface Props {
    open: boolean
    close(): void
}


export default function CreditsWindow(props: Props) {
    const { t } = useTranslation()
    const [, { setMode }] = useThemeSwicher();

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

    const store = useStore()

    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog open={props.open} fullWidth >
            <DialogTitle>{t('credits')}</DialogTitle>
            <DialogContent>
                <DialogActions>
                    <Button onClick={props.close}>{t('cancel')}</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

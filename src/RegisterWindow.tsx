import React from 'react';
import {
    Button, Alert, Chip,
    Dialog, DialogContent, DialogActions, DialogTitle, TextField,
    FormGroup, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Box,
} from '@mui/material';
import { Settings } from './types'
import { ThemeMode } from './theme/index';
import { useThemeSwicher } from './theme/ThemeSwitcher';
import { Trans, useTranslation } from 'react-i18next'

const { useEffect } = React
interface Props {
    open: boolean
    close(): void
}

export default function RegisterWindow(props: Props) {
    const { t } = useTranslation()

    const [, { setMode }] = useThemeSwicher();

    const [openRegisterWindow, setOpenRegisterWindow] = React.useState(false)

    const onRegister = () => {
        props.close()
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog open={props.open} fullWidth >
            <DialogTitle>{t('settings')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('account')}
                    type="text"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('password')}
                    type="password"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
}

import React, { useState } from 'react';
import {
    Button, Alert, Chip,
    Dialog, DialogContent, DialogActions, DialogTitle, TextField,
    FormGroup, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Box,
} from '@mui/material';
import { Settings } from './types'
import { ThemeMode } from './theme/index';
import { useThemeSwicher } from './theme/ThemeSwitcher';
import { Trans, useTranslation } from 'react-i18next'
import { handleSSE } from './client'

const { useEffect } = React
interface Props {
    open: boolean
    close(): void
}

export default function RegisterWindow(props: Props) {
    const { t } = useTranslation()

    const [, { setMode }] = useThemeSwicher();

    const [msg, setMsg] = React.useState('')

    const onRegister = async () => {
        try {
        const response = await fetch(`https://bot100.app:7001/api/v1/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'no-cors',
            body: JSON.stringify({
                captcha: "111",
                captcha_id: "111",
                email: "111",
                location: "111",
                mobile: "111",
                nickname: "111",
                password: "111",
            }),
        });
        await handleSSE(response, (message) => {
            if (message === '[DONE]') {
                return;
            }
            const data = JSON.parse(message)
            if (data.error) {
                setMsg(data.error)
            }
        })
        } catch (error) {
            throw error
        }
    }

    const onCaptcha = async () => {
        const response = await fetch(`https://bot100.app:7001/api/v1/captcha`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'no-cors',
        });
        console.log(response)
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog open={props.open} fullWidth >
            <DialogTitle>{t('register')}</DialogTitle>
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
            <p>{msg}</p>
            <DialogActions>
                <Button onClick={props.close}>{t('cancel')}</Button>
                <Button onClick={onRegister}>{t('register')}</Button>
                <Button onClick={onCaptcha}>{t('captcha')}</Button>
            </DialogActions>
        </Dialog>
    );
}

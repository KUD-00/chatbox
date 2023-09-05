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

interface LoginSettings {
    authorization: string,
    apiNodeEndpoints: string[]
}

interface Props {
    open: boolean
    close(): void
    register(): void
    save(settings:LoginSettings): void
}

interface CaptchaResponse {
    captcha: string;
    captcha_id: string;
}

interface LoginResponse {
    api_node_endpoints: string[],
    authorization: string,
    expiration: string,
    user_balances: [
        {
            expire_date: string,
            free_points: 0,
            llm_model_code: string,
            llm_model_desc: string,
            llm_model_name: string,
            points: 0
        }
    ],
    user_uuid: string
}

interface LoginErrorResponse {
    error: string
}

export default function LoginWindow(props: Props) {
    const { t } = useTranslation()
    const [, { setMode }] = useThemeSwicher();
    const [msg, setMsg] = React.useState('')
    const [captchaData, setCaptchaData] = React.useState('')
    const [captchaID, setCaptchaID] = React.useState('')
    const emailRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const captchaRef = React.useRef<HTMLInputElement>(null)
    const phoneRef = React.useRef<HTMLInputElement>(null)

    const onLogin = async () => {
        const payload = {
            captcha: captchaRef.current?.value,
            captcha_id: captchaID,
            // email: emailRef.current?.value,
            mobile: phoneRef.current?.value,
            password: passwordRef.current?.value,
        };
        const response = await fetch("https://bot100.app:7001/api/v1/users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(payload),
        });
        const data: LoginResponse | LoginErrorResponse = await response.json()
        if ('api_node_endpoints' in data) {
            console.log(data)
            props.save({ authorization: data.authorization, apiNodeEndpoints: data.api_node_endpoints })
            //setMsg('Login Successful')
        } else {
            setMsg(data.error)
        }
    }

    const onCaptcha = async () => {
        const response = await fetch(`https://bot100.app:7001/api/v1/captcha`, {
            method: 'GET',
            headers: {
            },
            mode: 'cors',
        })
        const data: CaptchaResponse = await response.json()
        setCaptchaData(data.captcha)
        setCaptchaID(data.captcha_id)
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog open={props.open} fullWidth >
            <DialogTitle>{t('login')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('login id')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputRef={phoneRef}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('password')}
                    type="password"
                    fullWidth
                    variant="outlined"
                    inputRef={passwordRef}
                />
                <TextField style={{display:'none'}}
                    autoFocus
                    margin="dense"
                    label={t('captcha')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputRef={captchaRef}
                />
                <Button style={{display:'none'}} onClick={onCaptcha}>{t('captcha')}</Button>
                {captchaData && <img src={captchaData} />}
            </DialogContent>
            <p style={{ padding: '0 24px' }}>{msg}</p>
            <DialogActions>
                <Button onClick={props.register}>{t('register')}</Button>
                <Button onClick={props.close}>{t('cancel')}</Button>
                <Button onClick={onLogin}>{t('Ok')}</Button>
            </DialogActions>
        </Dialog>
    );
}

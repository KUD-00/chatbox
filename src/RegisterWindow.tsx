import React, { useState, useRef, useEffect } from 'react';
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
    login(): void
    save(settings: Settings): void
}

interface CaptchaResponse {
    captcha: string;
    captcha_id: string;
}

interface RegisterResponse {
    api_node_endpoints: [string],
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

interface RegisterErrorResponse {
    error: string
}

export default function RegisterWindow(props: Props) {
    const { t } = useTranslation()
    const [, { setMode }] = useThemeSwicher();
    const [msg, setMsg] = React.useState('')
    const [captchaData, setCaptchaData] = React.useState('')
    const [captchaID, setCaptchaID] = React.useState('')
    const emailRef = React.useRef<HTMLInputElement>(null)
    const nicknameRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const passwordConfirmRef = React.useRef<HTMLInputElement>(null)
    const captchaRef = React.useRef<HTMLInputElement>(null)
    const phoneRef = React.useRef<HTMLInputElement>(null)

    const store = useStore()

    useEffect(() => {
        onCaptcha
    }, [])

    const onRegister = async () => {
        if (passwordRef.current?.value != passwordConfirmRef.current?.value) {
            setMsg('password confirm error');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const pv = passwordRef.current?passwordRef.current.value:'';
        if (!passwordRegex.test(pv)) {
            //setMsg(t('password format error'));
            setMsg('password format error');
            return;
        }
        const payload = {
            captcha: captchaRef.current?.value,
            captcha_id: captchaID,
            // email: emailRef.current?.value,
            // location: "CN",
            mobile: phoneRef.current?.value,
            nickname: nicknameRef.current?.value,
            password: passwordRef.current?.value,
        };
        console.log(payload)
        const response = await fetch("https://bot100.app:7001/api/v1/users", {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(payload),
        });
        const data: RegisterResponse | RegisterErrorResponse = await response.json()
        if ('api_node_endpoints' in data) {
            props.save({...store.settings, authorization: data.authorization, apiNodeEndpoints: data.api_node_endpoints})
            setMsg('Register Success')
        } else {
            setMsg(data.error)
        }
    }

    const onCaptcha = async () => {
        const response = await fetch(`https://bot100.app:7001/api/v1/captcha`, {
            method: 'GET',
            headers: {
                //'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
        const data: CaptchaResponse = await response.json()
        setCaptchaData(data.captcha)
        setCaptchaID(data.captcha_id)
        console.log(store.settings)
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
                    label={t('email')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputRef={emailRef}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('nickname')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputRef={nicknameRef}
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
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('password confirm')}
                    type="password"
                    fullWidth
                    variant="outlined"
                    inputRef={passwordConfirmRef}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('phone number')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputRef={phoneRef}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('captcha')}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputRef={captchaRef}
                />
                <Button onClick={onCaptcha}>{t('captcha')}</Button>
                {captchaData && <img src={captchaData} />}
            </DialogContent>
            <p>{msg}</p>
            <DialogActions>
                <Button onClick={props.login}>{t('login')}</Button>
                <Button onClick={props.close}>{t('cancel')}</Button>
                <Button onClick={onRegister}>{t('OK')}</Button>
            </DialogActions>
        </Dialog>
    );
}

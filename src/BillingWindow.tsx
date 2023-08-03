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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { ProductsResponse, ProductsErrorResponse } from './types'

interface Props {
  open: boolean
  close(): void
  productID: number
  auth: string
}

export interface Products {
  product_id: number,
  name: string,
  description: string,
  unit_price: number,
}

export interface OrderPostRequest {
  coupon_code: string,
  memo: string,
  product_id: number,
  quantity: number,
  return_url: string
}

export interface OrderPostResponse {
  amount: 0,
  client_secret: string,
  coupon_amount: number,
  coupon_code: string,
  coupon_discount: number,
  coupon_name: string,
  coupon_type: number,
  created_at: string,
  currency: string,
  id: string,
  invoice_id: string,
  order_no: string,
  original_amount: number,
  request_id: string
}

export interface OrderPostErrorResponse {
  error: string,
}


export default function BillingWindow(props: Props) {
  const { t } = useTranslation()
  const [, { setMode }] = useThemeSwicher();
  const [msg, setMsg] = React.useState("")
  const amountRef = React.useRef<HTMLInputElement>(null)
 const couponRef = React.useRef<HTMLInputElement>(null)

  const onPurchase = async () => {
    const payload = {
      quantity: amountRef.current?.value,
      coupon_code: couponRef.current?.value,
      memo: "",
      return_url: "",
      product_id: props.productID,
    };
    console.log(payload)
    console.log(props.auth)
    const response = await fetch(`https://bot100.app:7002/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${props.auth}`,
        'Content-Type': 'application/json',
      },
      mode: "no-cors",
      body: JSON.stringify({payload}),
    });
    const data: OrderPostResponse | OrderPostErrorResponse = await response.json()
    if ('amount' in data) {
      setMsg("success")
    } else {
      setMsg(data.error)
    }
  }
  // @ts-ignore
  // @ts-ignore
  return (
    <Dialog open={props.open} fullWidth >
      <DialogTitle>{t('Buy')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t('amount')}
          type="text"
          fullWidth
          variant="outlined"
          inputRef={amountRef}
        />
        <TextField
          autoFocus
          margin="dense"
          label={t('coupon')}
          type="text"
          fullWidth
          variant="outlined"
          inputRef={couponRef}
        />
        <p>{msg}</p>
        <DialogActions>
          <Button onClick={onPurchase}>{t('BUY')}</Button>
          <Button onClick={props.close}>{t('cancel')}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

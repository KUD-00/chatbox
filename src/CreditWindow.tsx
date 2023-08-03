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

import { LLM, ProductsResponse, ProductsErrorResponse } from './types'

interface Props {
    open: boolean
    close(): void
    bill: (productID: number) => void
}

const columns = [
    "Language Models",
    "Credits",
    "Actions"
]

export interface Products {
    product_id: number,
    name: string,
    description: string,
    unit_price: number,
}

export default function CreditsWindow(props: Props) {
    const { t } = useTranslation()
    const [, { setMode }] = useThemeSwicher();
    const [products, setProducts] = useState<Products[] | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://bot100.app:7001/api/v1/products", {
                method: 'GET',
                headers: {},
                mode: 'cors',
            });
            const data: ProductsResponse | ProductsErrorResponse = await response.json()
            if ('products' in data) {
                let products: Products[] = []
                data.products.map((product) => {
                    products.push({
                        product_id: product.id,
                        name: product.name,
                        description: product.desc,
                        unit_price: product.unit_price,
                    })
                })
                setProducts(products)
            } else {
                // do some error handling here
            }
        }
        fetchData()
    },[])
    
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
                            {products?.map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.unit_price}</TableCell>
                                    <TableCell><Button onClick={props.bill(product.product_id)}>charge</Button></TableCell>
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

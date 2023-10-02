"use client"
import { useState, useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import {
    IconButton, Divider, ListItem, Typography, Grid, TextField, Menu, MenuProps, Tooltip,
    ButtonGroup,
    Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import { styled, alpha } from '@mui/material/styles';
import 'github-markdown-css/github-markdown-light.css'
import mila from 'markdown-it-link-attributes';
import { useTranslation, getI18n } from 'react-i18next';
import { Message, OpenAIRoleEnum, OpenAIRoleEnumType, Session, createMessage } from './types';
import './styles/Block.scss'
import Prompt from './i18n/locales/prompt.json'

type LanguagePrompts = {
    [key: string]: {
        description: string;
        prompts: {
            title: string;
            prompt: string;
        }[];
    };
};


const md = new MarkdownIt({
    linkify: true,
    breaks: true,
    highlight: (str: string, lang: string, attrs: string): string => {
        let content = str
        if (lang && hljs.getLanguage(lang)) {
            try {
                content = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
            } catch (e) {
                console.log(e)
                return str
            }
        } else {
            content = md.utils.escapeHtml(str)
        }

        // join actions html string
        lang = (lang || 'txt').toUpperCase()
        return [
            '<div class="code-block-wrapper">',
            `<div class="code-header"><span class="code-lang">${lang}</span><div class="copy-action">${getI18n().t('copy')}</div></div>`,
            '<pre class="hljs code-block">',
            `<code>${content}</code>`,
            '</pre>',
            '</div>',
        ].join('');
    },
});

md.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
md.use(mila, { attrs: { target: "_blank", rel: "noopener" } })



export interface Props {
    msg: string
    generate: (session: Session, promptMsgs: Message[], targetMsg: Message) => (void)
    currentSession: Session
    updateChatSession: (session: Session) => (void)
    language: string
}

function _Block(props: Props) {
    const { t } = useTranslation()
    const { msg, generate, currentSession, updateChatSession } = props;
    const language = props.language ? props.language : 'en'
    const [isHovering, setIsHovering] = useState(false)

    const generatePrompt = (promptString: string) => {
        const prompt = createMessage('user', promptString)
        const promptsMsgs = [...currentSession.messages, prompt]
        const newAssistantMsg = createMessage('assistant', '....')
        currentSession.messages = [...currentSession.messages, prompt, newAssistantMsg]
        updateChatSession(currentSession)
        generate(currentSession, promptsMsgs, newAssistantMsg)
        // messageScrollRef.current = { msgId: newAssistantMsg.id, smooth: true }
    }

    const prompt: LanguagePrompts = Prompt
    
    return (
        <ListItem
            id={"PromptBlock"}
            onMouseEnter={() => {
                setIsHovering(true)
            }}
            onMouseOver={() => {
                setIsHovering(true)
            }}
            onMouseLeave={() => {
                setIsHovering(false)
            }}
            sx={{
                padding: '10px',
            }}
            className={[
                'msg-block',
                'render-done',
                'system-msg',
            ].join(' ')}
        >
            <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                    <Box sx={{ marginTop: '8px' }}>
                        <Avatar><SettingsIcon /></Avatar>
                    </Box>
                </Grid>
                <Grid item xs sm container sx={{ width: '0px', paddingRight: '15px' }}>
                    <Grid item xs>
                        <Box
                            sx={{
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                            }}
                            className='msg-content'
                            dangerouslySetInnerHTML={{ __html: md.render(prompt[language].description) }}
                        />

                    </Grid>
                    <Grid item xs={1}>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                {prompt[language].prompts.map((prompt) => (
                    <Grid item>
                        <Button variant="outlined" size="small" color="primary" onClick={() => generatePrompt(prompt.prompt)}>
                            {prompt.title}
                        </Button>
                    </Grid>
                ))}
        </Grid>
        </ListItem>
    );
}

// <Divider variant="middle" light />
const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 140,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function PromptBlock(props: Props) {
    return <_Block {...props} />
}

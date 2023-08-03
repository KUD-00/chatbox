import { v4 as uuidv4 } from 'uuid';
import { ThemeMode } from './theme';

export type Message = OpenAIMessage & {
    id: string;
    cancel?: () => void;
    generating?: boolean
    model?: string
}

export interface Session{
    id: string
    name: string
    messages: Message[]
    starred?: boolean
}

export function createMessage(role: OpenAIRoleEnumType = OpenAIRoleEnum.User, content: string = ''): Message {
    return {
        id: uuidv4(),
        content: content,
        role: role,
    }
}

export function createSession(name: string = "Untitled"): Session {
    return {
        id: uuidv4(),
        name: name,
        messages: [
            {
                id: uuidv4(),
                role: 'system',
                content: 'You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.'
            }
        ],
    }
}

export interface Settings {
    account: string
    password: string
    apiNodeEndpoints: string[]
    authorization: string
    apiHost: string
    model: string
    maxContextSize: string
    temperature: number
    maxTokens: string
    showWordCount?: boolean
    showTokenCount?: boolean
    showModelName?: boolean
    theme: ThemeMode
    language: string
    fontSize: number
    test: string
}

export interface LLM {
    name: string
    description: string
    credits: () => string
    action: () => void
    price: {[key: string]: number;}
}

export const OpenAIRoleEnum = {
    System: 'system',
    User: 'user',
    Assistant: 'assistant'
} as const;

export type OpenAIRoleEnumType = typeof OpenAIRoleEnum[keyof typeof OpenAIRoleEnum]

export interface OpenAIMessage {
    'role': OpenAIRoleEnumType
    'content': string;
    'name'?: string;
}

export interface Config{
    uuid: string
}

export interface SponsorAd {
    text: string
    url: string
}

export interface SponsorAboutBanner {
    type: 'picture' | 'picture-text'
    name: string
    pictureUrl: string
    link: string
    title: string
    description: string
}

// API return types

export interface ProductsResponse {
        products: [
            {
                charge_unit: number,
                chat_num: number,
                code: string,
                createdAt: string,
                currency: string,
                deletedAt: string,
                desc: string,
                ID: number,
                img_id: number,
                llm_model: {
                    api_keys: [
                        {
                            "account": string,
                            "amount_quota": number,
                            "api_base": string,
                            "api_key": string,
                            "api_secret": string,
                            "api_type": string,
                            "api_version": string,
                            "createdAt": string,
                            "deletedAt": string,
                            "holder": string,
                            "id": number,
                            "llm_model_id": number,
                            "memo": string,
                            "password": string,
                            "updatedAt": string,
                            "url_scheme": string,
                            "used": number
                        }
                    ],
                    "api_provider_id": number,
                    "code": string,
                    "createdAt": string,
                    "deletedAt": string,
                    "desc": string,
                    "free_points": number,
                    "free_points_frequency": number,
                    "id": number,
                    "init_points": number,
                    "name": string,
                    "req_token_price": number,
                    "resp_token_price": number,
                    "status": number,
                    "token_unit": number,
                    "updatedAt": string
                },
                "llm_model_id": number,
                "name": string,
                "status": number,
                "thumbs_id": number,
                "unit_price": number,
                "updatedAt": string
            }
        ]
}

export interface ProductsErrorResponse {
    error: string
}

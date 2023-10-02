import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import i18n from './i18n'

interface ConfigStore {
    language: string
    setLanguage: (langcode: string) => void
}

export const useConfigStore = create<ConfigStore>()(
    persist(
        (set, get) => ({
            language: 'en',
            setLanguage: (langcode) => {
                set({ language: langcode })
                i18n.changeLanguage(langcode).then();
            },
        }),
        {
            name: 'config-storage', // name of the item in the storage (must be unique)
        }
    )
)
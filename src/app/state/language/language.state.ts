import * as Const from '../../app.const';

export interface LanguageState {
    currentLanguage: string;
}

export const initialState: LanguageState = {
    currentLanguage: Const.JP,
};
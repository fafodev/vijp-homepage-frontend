import { isDevMode } from "@angular/core";

/** ルーティングのベース */
export const rootingbase = '';

/**Webサービス情報パス */
export const service = 'webapi/hscglobal/';

/**
 * 開発、検証本番環境用
 * ビルド過程で稼働環境用のサーバー名に置き換え
 */
export function serverHost(): string {
    return 'https://www.ghrbc.com';
}

export const projectName = 'hsc';
export const fullPath: string = isDevMode() ? 'https://www.ghrbc.com' : 'https://www.ghrbc.com';

export const VI: string = 'VI';
export const JP: string = 'JP';
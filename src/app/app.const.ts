import { isDevMode } from "@angular/core";

/** ルーティングのベース */
export const rootingbase = '';

/**Webサービス情報パス */
export const service = 'webapi/vijp/';

/**
 * 開発、検証本番環境用
 * ビルド過程で稼働環境用のサーバー名に置き換え
 */
export function serverHost(): string {
    return 'http://72.61.143.252';
}

export const projectName = 'hsc';
export const fullPath: string = isDevMode() ? 'http://72.61.143.252/' : 'http://72.61.143.252/';

export const VI: string = 'VI';
export const JP: string = 'JP';
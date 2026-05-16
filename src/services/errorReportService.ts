import { Platform } from 'react-native';
import apiClient from './apiClient';
import { APP_VERSION, BUILD_NUMBER } from '../config/version';

export type ClientErrorType =
  | 'iap_purchase_failed'
  | 'iap_connection_failed'
  | 'iap_restore_failed'
  | 'iap_api_sync_failed'
  | 'general';

export interface ClientErrorPayload {
  error_type: ClientErrorType;
  error_code: string;
  error_message: string;
  sku?: string;
  context?: Record<string, unknown>;
}

export const ErrorReportService = {
  report(payload: ClientErrorPayload): void {
    apiClient
      .post('/errors/report', {
        ...payload,
        platform:     Platform.OS,
        app_version:  APP_VERSION,
        build_number: BUILD_NUMBER,
      })
      .catch(() => {});
  },

  reportIapPurchaseFailed(sku: string, errorCode: string, errorMessage: string): void {
    this.report({
      error_type:    'iap_purchase_failed',
      error_code:    errorCode,
      error_message: errorMessage,
      sku,
    });
  },

  reportIapConnectionFailed(errorMessage: string): void {
    this.report({
      error_type:    'iap_connection_failed',
      error_code:    'IAP_CONNECTION_FAILED',
      error_message: errorMessage,
    });
  },

  reportIapRestoreFailed(errorMessage: string): void {
    this.report({
      error_type:    'iap_restore_failed',
      error_code:    'IAP_RESTORE_FAILED',
      error_message: errorMessage,
    });
  },

  reportIapApiSyncFailed(sku: string, errorMessage: string): void {
    this.report({
      error_type:    'iap_api_sync_failed',
      error_code:    'IAP_API_SYNC_FAILED',
      error_message: errorMessage,
      sku,
    });
  },
};

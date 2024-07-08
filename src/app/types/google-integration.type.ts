import { GoogleIntegrationMode } from './misc.type';

export interface GoogleAuthUrl {
  url: string;
}
export interface GoogleIntegrationInfo {
  integrationMode: GoogleIntegrationMode;
  bookingProductId?: string | null;
  appointmentId?: string | null;
}

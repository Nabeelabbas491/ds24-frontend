import { MeetingType, SettingPageState } from './misc.type';

export interface VendorSettingsForm {
  file: FormData | null | ArrayBuffer | string;
  primaryColor: string;
  secondaryColor: string;
  outboundPhoneCall: boolean;
  inboundPhoneCall: boolean;
  phoneNumber: string;
  videoConference: boolean;
}

export interface VendorSettingCollection {
  meetingTypes: MeetingType[];
  vendorSetting: VendorSetting | null;
  pageState: SettingPageState;
}

export interface SaveVendorSetting {
  logo: File | undefined;
  primaryColor: string;
  secondaryColor: string;
  phoneNumber: string;
  meetingTypes: number[];
}

export interface VendorSetting {
  id: number;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  phoneNumber: string;
  meetingTypes: MeetingType[];
}

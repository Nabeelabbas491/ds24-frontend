export interface Tab {
  title: string;
  id: number;
  isSelected?: boolean;
  urlSegment?: string;
}

export enum VendorTabs {
  appointment = 0,
  booking = 1,
  settings = 2,
}

export enum VendorTabsName {
  appointments = 'appointments',
  booking = 'booking-templates',
  settings = 'settings',
}

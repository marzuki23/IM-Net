import { WiFiPackage, User, Role } from './types';

export const WIFI_PACKAGES: WiFiPackage[] = [
  { id: 'p1', name: 'Starter Pack', speed: '10 Mbps', price: 150000 },
  { id: 'p2', name: 'Family Pack', speed: '30 Mbps', price: 250000 },
  { id: 'p3', name: 'Pro Gamer', speed: '50 Mbps', price: 350000 },
  { id: 'p4', name: 'Ultimate Fiber', speed: '100 Mbps', price: 500000 },
];

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  fullName: 'Main Administrator',
  wifiName: 'N/A',
  wifiPassword: '',
  packageId: '',
  role: Role.ADMIN,
  customerId: 'ADM-001',
  dueDate: ''
};

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    username: 'john_doe',
    fullName: 'John Doe',
    wifiName: 'JohnHome_WiFi',
    wifiPassword: 'password123',
    packageId: 'p2',
    role: Role.USER,
    customerId: 'WIF-202401',
    dueDate: '2024-06-25T00:00:00.000Z'
  },
  {
    id: 'user-2',
    username: 'jane_smith',
    fullName: 'Jane Smith',
    wifiName: 'Smith_Net',
    wifiPassword: 'securepass456',
    packageId: 'p3',
    role: Role.USER,
    customerId: 'WIF-202402',
    dueDate: '2024-06-20T00:00:00.000Z'
  }
];
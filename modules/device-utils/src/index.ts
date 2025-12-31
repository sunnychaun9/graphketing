import { NativeModule, requireNativeModule } from 'expo-modules-core';

interface StorageInfo {
  totalBytes: number;
  availableBytes: number;
  usedBytes: number;
  totalGB: string;
  availableGB: string;
  usedGB: string;
  usedPercentage: string;
}

interface DeviceInfo {
  brand: string;
  model: string;
  device: string;
  sdkVersion: number;
  androidVersion: string;
}

interface DeviceUtilsModule extends NativeModule {
  vibratePattern(pattern: number[], repeat: number): boolean;
  vibrateSuccess(): void;
  vibrateError(): void;
  cancelVibration(): void;
  getStorageInfo(): StorageInfo;
  getDeviceInfo(): DeviceInfo;
}

const DeviceUtils: DeviceUtilsModule = requireNativeModule('DeviceUtils');

export function vibratePattern(pattern: number[], repeat: number = -1): boolean {
  return DeviceUtils.vibratePattern(pattern, repeat);
}

export function vibrateSuccess(): void {
  DeviceUtils.vibrateSuccess();
}

export function vibrateError(): void {
  DeviceUtils.vibrateError();
}

export function cancelVibration(): void {
  DeviceUtils.cancelVibration();
}

export function getStorageInfo(): StorageInfo {
  return DeviceUtils.getStorageInfo();
}

export function getDeviceInfo(): DeviceInfo {
  return DeviceUtils.getDeviceInfo();
}

export { StorageInfo, DeviceInfo };

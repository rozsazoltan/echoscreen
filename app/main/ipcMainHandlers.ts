/* eslint-disable no-restricted-syntax */
import { Display, ipcMain, BrowserWindow, screen } from 'electron';
import i18n from '../configs/i18next.config';
import ConnectedDevicesService from '../features/ConnectedDevicesService';
import SharingSession from '../features/SharingSessionService/SharingSession';
import RoomIDService from '../server/RoomIDService';
import getEchoScreenGlobal from '../utils/mainProcessHelpers/getEchoScreenGlobal';
import signalingServer from '../server';
import Logger from '../utils/LoggerWithFilePrefix';
import { IpcEvents } from './IpcEvents.enum';
import SharingSessionStatusEnum from '../features/SharingSessionService/SharingSessionStatusEnum';
import { ElectronStoreKeys } from '../enums/ElectronStoreKeys.enum';
import store from '../echoscreen-electron-store';

const log = new Logger(__filename);
const v4IPGetter = require('internal-ip').v4;

export default function initIpcMainHandlers(mainWindow: BrowserWindow) {
  ipcMain.on('client-changed-language', async (_, newLangCode) => {
    i18n.changeLanguage(newLangCode);
    if (store.has(ElectronStoreKeys.AppLanguage)) {
      if (store.get(ElectronStoreKeys.AppLanguage) === newLangCode) {
        return;
      }
      store.delete(ElectronStoreKeys.AppLanguage);
    }
    store.set(ElectronStoreKeys.AppLanguage, newLangCode);
  });

  ipcMain.handle('get-signaling-server-port', () => {
    if (mainWindow === null) return;
    mainWindow.webContents.send('sending-port-from-main', signalingServer.port);
  });

  ipcMain.handle('get-all-displays', () => {
    return screen.getAllDisplays();
  });

  ipcMain.handle('get-display-size-by-display-id', (_, displayID: string) => {
    const display = screen.getAllDisplays().find((d: Display) => {
      return `${d.id}` === displayID;
    });

    if (display) {
      return display.size;
    }
    return undefined;
  });

  ipcMain.handle('main-window-onbeforeunload', () => {
    const echoscreenGlobal = getEchoScreenGlobal();
    echoscreenGlobal.connectedDevicesService = new ConnectedDevicesService();
    echoscreenGlobal.roomIDService = new RoomIDService();
    echoscreenGlobal.sharingSessionService.sharingSessions.forEach(
      (sharingSession: SharingSession) => {
        sharingSession.denyConnectionForPartner();
        sharingSession.destroy();
      }
    );

    echoscreenGlobal.rendererWebrtcHelpersService.helpers.forEach(
      (helperWindow) => {
        helperWindow.close();
      }
    );

    echoscreenGlobal.sharingSessionService.waitingForConnectionSharingSession = null;
    echoscreenGlobal.rendererWebrtcHelpersService.helpers.clear();
    echoscreenGlobal.sharingSessionService.sharingSessions.clear();
  });

  ipcMain.handle('get-latest-version', () => {
    return getEchoScreenGlobal().latestAppVersion;
  });

  ipcMain.handle('get-current-version', () => {
    return getEchoScreenGlobal().currentAppVersion;
  });

  ipcMain.handle('get-local-lan-ip', async () => {
    if (
      process.env.RUN_MODE === 'dev' ||
      process.env.NODE_ENV === 'production'
    ) {
      const ip = await v4IPGetter();
      return ip;
    }
    return '255.255.255.255';
  });

  ipcMain.handle(IpcEvents.GetAppPath, () => {
    const echoscreenGlobal = getEchoScreenGlobal();
    return echoscreenGlobal.appPath;
  });

  ipcMain.handle(IpcEvents.UnmarkRoomIDAsTaken, (_, roomID) => {
    const echoscreenGlobal = getEchoScreenGlobal();
    echoscreenGlobal.roomIDService.unmarkRoomIDAsTaken(roomID);
  });

  function onDeviceConnectedCallback(device: Device): void {
    getEchoScreenGlobal().connectedDevicesService.setPendingConnectionDevice(
      device
    );
    mainWindow.webContents.send(IpcEvents.SetPendingConnectionDevice, device);
  }

  ipcMain.handle(IpcEvents.CreateWaitingForConnectionSharingSession, () => {
    getEchoScreenGlobal()
      .sharingSessionService.createWaitingForConnectionSharingSession()
      // eslint-disable-next-line promise/always-return
      .then((waitingForConnectionSharingSession) => {
        waitingForConnectionSharingSession.setOnDeviceConnectedCallback(
          onDeviceConnectedCallback
        );
      })
      .catch((e) => log.error(e));
  });

  ipcMain.handle(IpcEvents.ResetWaitingForConnectionSharingSession, () => {
    const sharingSession = getEchoScreenGlobal().sharingSessionService
      .waitingForConnectionSharingSession;
    sharingSession?.disconnectByHostMachineUser();
    sharingSession?.destroy();
    sharingSession?.setStatus(SharingSessionStatusEnum.NOT_CONNECTED);
    getEchoScreenGlobal().sharingSessionService.sharingSessions.delete(
      sharingSession?.id as string
    );
    getEchoScreenGlobal().sharingSessionService.waitingForConnectionSharingSession = null;
  });

  ipcMain.handle(IpcEvents.SetDeviceConnectedStatus, () => {
    if (
      getEchoScreenGlobal().sharingSessionService
        .waitingForConnectionSharingSession !== null
    ) {
      const sharingSession = getEchoScreenGlobal().sharingSessionService
        .waitingForConnectionSharingSession;
      sharingSession?.setStatus(SharingSessionStatusEnum.CONNECTED);
    }
  });

  ipcMain.handle(
    IpcEvents.GetSourceDisplayIDByDesktopCapturerSourceID,
    (_, sourceId) => {
      return getEchoScreenGlobal().desktopCapturerSourcesService.getSourceDisplayIDByDisplayCapturerSourceID(
        sourceId
      );
    }
  );

  ipcMain.handle(
    IpcEvents.DisconnectPeerAndDestroySharingSessionBySessionID,
    (_, sessionId) => {
      const sharingSession = getEchoScreenGlobal().sharingSessionService.sharingSessions.get(
        sessionId
      );
      if (sharingSession) {
        getEchoScreenGlobal().connectedDevicesService.disconnectDeviceByID(
          sharingSession.deviceID
        );
      }
      sharingSession?.disconnectByHostMachineUser();
      sharingSession?.destroy();
      getEchoScreenGlobal().sharingSessionService.sharingSessions.delete(
        sessionId
      );
    }
  );

  ipcMain.handle(
    IpcEvents.GetDesktopCapturerSourceIdBySharingSessionId,
    (_, sessionId) => {
      return getEchoScreenGlobal().sharingSessionService.sharingSessions.get(
        sessionId
      )?.desktopCapturerSourceID;
    }
  );

  ipcMain.handle(IpcEvents.GetConnectedDevices, () => {
    return getEchoScreenGlobal().connectedDevicesService.getDevices();
  });

  ipcMain.handle(IpcEvents.DisconnectDeviceById, (_, id) => {
    getEchoScreenGlobal().connectedDevicesService.disconnectDeviceByID(id);
  });

  ipcMain.handle(IpcEvents.DisconnectAllDevices, () => {
    getEchoScreenGlobal().connectedDevicesService.disconnectAllDevices();
  });

  ipcMain.handle(IpcEvents.AppLanguageChanged, (_, newLang) => {
    if (store.has(ElectronStoreKeys.AppLanguage)) {
      store.delete(ElectronStoreKeys.AppLanguage);
    }
    store.set(ElectronStoreKeys.AppLanguage, newLang);
    getEchoScreenGlobal().sharingSessionService.sharingSessions.forEach(
      (sharingSession) => {
        sharingSession?.appLanguageChanged();
      }
    );
  });

  ipcMain.handle(IpcEvents.GetDesktopCapturerServiceSourcesMap, () => {
    const map = getEchoScreenGlobal().desktopCapturerSourcesService.getSourcesMap();
    const res = {};
    // eslint-disable-next-line guard-for-in
    for (const key of map.keys()) {
      const source = map.get(key);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res[key] = {
        source: {
          thumbnail: source?.source.thumbnail?.toDataURL(),
          appIcon: source?.source.appIcon?.toDataURL(),
          name: source?.source.name,
        },
      };
    }
    return res;
  });

  ipcMain.handle(
    IpcEvents.GetWaitingForConnectionSharingSessionSourceId,
    () => {
      return getEchoScreenGlobal().sharingSessionService
        .waitingForConnectionSharingSession?.desktopCapturerSourceID;
    }
  );

  ipcMain.handle(
    IpcEvents.StartSharingOnWaitingForConnectionSharingSession,
    () => {
      const sharingSession = getEchoScreenGlobal().sharingSessionService
        .waitingForConnectionSharingSession;
      if (sharingSession !== null) {
        sharingSession.callPeer();
        sharingSession.status = SharingSessionStatusEnum.SHARING;
      }
      getEchoScreenGlobal().connectedDevicesService.addDevice(
        getEchoScreenGlobal().connectedDevicesService.pendingConnectionDevice
      );
      getEchoScreenGlobal().connectedDevicesService.resetPendingConnectionDevice();
    }
  );

  ipcMain.handle(IpcEvents.GetPendingConnectionDevice, () => {
    return getEchoScreenGlobal().connectedDevicesService.pendingConnectionDevice;
  });

  ipcMain.handle(IpcEvents.GetWaitingForConnectionSharingSessionRoomId, () => {
    if (
      getEchoScreenGlobal().sharingSessionService
        .waitingForConnectionSharingSession === null
    ) {
      return undefined;
    }
    return getEchoScreenGlobal().sharingSessionService
      .waitingForConnectionSharingSession?.roomID;
  });

  ipcMain.handle(
    IpcEvents.GetDesktopSharingSourceIds,
    (_, { isEntireScreenToShareChosen }) => {
      if (isEntireScreenToShareChosen === true) {
        return getEchoScreenGlobal()
          .desktopCapturerSourcesService.getScreenSources()
          .map((source) => source.id);
      }
      return getEchoScreenGlobal()
        .desktopCapturerSourcesService.getAppWindowSources()
        .map((source) => source.id);
    }
  );

  ipcMain.handle(IpcEvents.SetDesktopCapturerSourceId, (_, id) => {
    getEchoScreenGlobal().sharingSessionService.waitingForConnectionSharingSession?.setDesktopCapturerSourceID(
      id
    );
  });

  ipcMain.handle(IpcEvents.NotifyAllSessionsWithAppThemeChanged, () => {
    getEchoScreenGlobal().sharingSessionService.sharingSessions.forEach(
      (sharingSession) => {
        sharingSession?.appThemeChanged();
      }
    );
  });

  ipcMain.handle(IpcEvents.GetIsFirstTimeAppStart, () => {
    if (store.has(ElectronStoreKeys.IsNotFirstTimeAppStart)) {
      return false;
    }
    return true;
  });

  ipcMain.handle(IpcEvents.SetAppStartedOnce, () => {
    if (store.has(ElectronStoreKeys.IsNotFirstTimeAppStart)) {
      store.delete(ElectronStoreKeys.IsNotFirstTimeAppStart);
    }
    store.set(ElectronStoreKeys.IsNotFirstTimeAppStart, true);
  });

  ipcMain.handle(IpcEvents.GetIsAppDarkTheme, () => {
    if (store.has(ElectronStoreKeys.IsAppDarkTheme)) {
      return store.get(ElectronStoreKeys.IsAppDarkTheme);
    }
    return false;
  });

  ipcMain.handle(IpcEvents.SetIsAppDarkTheme, (_, isDarkTheme) => {
    if (store.has(ElectronStoreKeys.IsAppDarkTheme)) {
      store.delete(ElectronStoreKeys.IsAppDarkTheme);
    }
    store.set(ElectronStoreKeys.IsAppDarkTheme, isDarkTheme);
  });

  ipcMain.handle(IpcEvents.GetAppLanguage, () => {
    if (store.has(ElectronStoreKeys.AppLanguage)) {
      return store.get(ElectronStoreKeys.AppLanguage);
    }
    return 'en';
  });

  ipcMain.handle(IpcEvents.SetShouldAutomaticUpdates, (_, ShouldAutomaticUpdates) => {
    if (store.has(ElectronStoreKeys.ShouldAutomaticUpdates)) {
      store.delete(ElectronStoreKeys.ShouldAutomaticUpdates);
    }
    store.set(ElectronStoreKeys.ShouldAutomaticUpdates, ShouldAutomaticUpdates);
  });

  ipcMain.handle(IpcEvents.SetShouldAutomaticConnect, (_, ShouldAutomaticConnect) => {
    if (store.has(ElectronStoreKeys.ShouldAutomaticConnect)) {
      store.delete(ElectronStoreKeys.ShouldAutomaticConnect);
    }
    store.set(ElectronStoreKeys.ShouldAutomaticConnect, ShouldAutomaticConnect);
  });

  ipcMain.handle(IpcEvents.DestroySharingSessionById, (_, id) => {
    const sharingSession = getEchoScreenGlobal().sharingSessionService.sharingSessions.get(
      id
    );
    sharingSession?.setStatus(SharingSessionStatusEnum.DESTROYED);
    sharingSession?.destroy();
    getEchoScreenGlobal().sharingSessionService.sharingSessions.delete(id);
  });
}

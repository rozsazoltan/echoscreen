import { app } from 'electron';
import ConnectedDevicesService from '../../features/ConnectedDevicesService';
import SharingSessionService from '../../features/SharingSessionService';
import RendererWebrtcHelpersService from '../../features/PeerConnectionHelperRendererService';
import RoomIDService from '../../server/RoomIDService';
import DesktopCapturerSources from '../../features/DesktopCapturerSourcesService';
import { EchoScreenGlobal } from './EchoScreenGlobal';

export default (appPath: string) => {
  const echoscreenGlobal: EchoScreenGlobal = (global as unknown) as EchoScreenGlobal;

  echoscreenGlobal.appPath = appPath;

  echoscreenGlobal.rendererWebrtcHelpersService = new RendererWebrtcHelpersService(
    appPath
  );
  echoscreenGlobal.roomIDService = new RoomIDService();
  echoscreenGlobal.connectedDevicesService = new ConnectedDevicesService();
  echoscreenGlobal.sharingSessionService = new SharingSessionService(
    echoscreenGlobal.roomIDService,
    echoscreenGlobal.connectedDevicesService,
    echoscreenGlobal.rendererWebrtcHelpersService
  );
  echoscreenGlobal.desktopCapturerSourcesService = new DesktopCapturerSources();
  echoscreenGlobal.latestAppVersion = '';
  echoscreenGlobal.currentAppVersion = app.getVersion();
};

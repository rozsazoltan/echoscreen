/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clipboard, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Tooltip, Position } from '@blueprintjs/core';
import isProduction from '../../utils/isProduction';
import config from '../../api/config';
import { IpcEvents } from '../../main/IpcEvents.enum';

const { port } = config;

// TODO: change port to user defined port, if it is really defined
const CLIENT_VIEWER_PORT = isProduction() ? port : '3000';

const ScanQRStep: React.FC = () => {
  const { t } = useTranslation();

  const [roomID, setRoomID] = useState('');
  const [LOCAL_LAN_IP, setLocalLanIP] = useState('');

  useEffect(() => {
    const getRoomIdInterval = setInterval(async () => {
      const roomId = await ipcRenderer.invoke(
        IpcEvents.GetWaitingForConnectionSharingSessionRoomId
      );
      if (roomId) {
        setRoomID(roomId);
      }
    }, 1000);

    const ipInterval = setInterval(async () => {
      const gotIP = await ipcRenderer.invoke('get-local-lan-ip');
      if (gotIP) {
        setLocalLanIP(gotIP);
      }
    }, 1000);

    return () => {
      clearInterval(getRoomIdInterval);
      clearInterval(ipInterval);
    };
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Text>
          <span
            style={{
              backgroundColor: '#00f99273',
              fontWeight: 900,
              paddingRight: '8px',
              paddingLeft: '8px',
              borderRadius: '20px',
            }}
          >
            {t(
              'Make sure your computer and screen viewing device are connected to same Wi-Fi'
            )}
          </span>
        </Text>
      </div>

      <Tooltip content={t('Click to copy')} position={Position.LEFT}>
        <Button
          intent="primary"
          icon="duplicate"
          style={{ borderRadius: '100px' }}
          onClick={() => {
            clipboard.writeText(
              `http://${LOCAL_LAN_IP}:${CLIENT_VIEWER_PORT}/${roomID}`
            );
          }}
        >
          {`http://${LOCAL_LAN_IP}:${CLIENT_VIEWER_PORT}/${roomID}`}
        </Button>
      </Tooltip>
    </>
  );
};

export default ScanQRStep;

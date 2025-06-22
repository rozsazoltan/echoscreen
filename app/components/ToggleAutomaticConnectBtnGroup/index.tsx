import React, { useContext, useCallback } from 'react';
import { Button, ControlGroup } from '@blueprintjs/core';
import { ipcRenderer } from 'electron';
import { SettingsContext } from '../../containers/SettingsProvider';
import { IpcEvents } from '../../main/IpcEvents.enum';

export default function ToggleAutomaticConnectBtnGroup() {
  const { shouldAutomaticConnect, setShouldAutomaticConnectHook } = useContext(SettingsContext);

  const handleToggleStatus = useCallback(() => {
    setShouldAutomaticConnectHook(!shouldAutomaticConnect);
  }, [shouldAutomaticConnect, setShouldAutomaticConnectHook]);

  return (
    <ControlGroup fill vertical={false} style={{ width: '120px' }}>
      <Button
        id="enable-automatic-connect-btn"
        icon="tick"
        onClick={handleToggleStatus}
        active={shouldAutomaticConnect}
        style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
      />
      <Button
        id="disable-automatic-connect-btn"
        icon="cross"
        onClick={handleToggleStatus}
        active={!shouldAutomaticConnect}
        style={{
          borderTopRightRadius: '50px',
          borderBottomRightRadius: '50px',
        }}
      />
    </ControlGroup>
  );
}

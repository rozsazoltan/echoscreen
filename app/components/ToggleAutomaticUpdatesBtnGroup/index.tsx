import React, { useContext, useCallback } from 'react';
import { Button, ControlGroup } from '@blueprintjs/core';
import { ipcRenderer } from 'electron';
import { SettingsContext } from '../../containers/SettingsProvider';
import { IpcEvents } from '../../main/IpcEvents.enum';

export default function ToggleAutomaticUpdatesBtnGroup() {
  const { shouldAutomaticUpdates, setShouldAutomaticUpdatesHook } = useContext(SettingsContext);

  const handleToggleStatus = useCallback(() => {
    setShouldAutomaticUpdatesHook(!shouldAutomaticUpdates);
  }, [shouldAutomaticUpdates, setShouldAutomaticUpdatesHook]);

  return (
    <ControlGroup fill vertical={false} style={{ width: '120px' }}>
      <Button
        id="enable-automatic-updates-btn"
        icon="tick"
        onClick={handleToggleStatus}
        active={shouldAutomaticUpdates}
        style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
      />
      <Button
        id="disable-automatic-updates-btn"
        icon="cross"
        onClick={handleToggleStatus}
        active={!shouldAutomaticUpdates}
        style={{
          borderTopRightRadius: '50px',
          borderBottomRightRadius: '50px',
        }}
      />
    </ControlGroup>
  );
}

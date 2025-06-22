import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

export default function useAppVersions() {
  const [latestVersion, setLatestVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');

  useEffect(() => {
    const getVersions = async () => {
      const [gotLatestVersion, gotCurrentVersion] = await Promise.all([
        ipcRenderer.invoke('get-latest-version'),
        ipcRenderer.invoke('get-current-version'),
      ]);

      if (gotLatestVersion) setLatestVersion(gotLatestVersion);
      if (gotCurrentVersion) setCurrentVersion(gotCurrentVersion);
    };

    getVersions();
  }, []);

  return { latestVersion, currentVersion };
}

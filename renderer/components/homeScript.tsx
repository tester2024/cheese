import { useEffect, useState } from 'react';
import { router } from 'next/client';

interface Version {
  supportedVersions: string[];
  defaultVersion: string;
}


const HomeScript = () => {
  const ipc = window.ipc;

  useEffect(() => {
    if (!ipc) return

    ipc.on('handshake', (data: Version) => {
      const versionSelect = document.getElementById('version') as HTMLSelectElement;

      while (versionSelect.firstChild) {
        versionSelect.removeChild(versionSelect.firstChild);
      }

      data.supportedVersions.reverse().forEach((version) => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        if (version === data.defaultVersion) {
          option.selected = true;
        }
        versionSelect.appendChild(option);
      });
    });

    ipc.on("start-proxy", async ({success: success}) => {
      if (success) {
        await router.push('/monitor');
      }else{
        alert("Failed to start proxy");
      }
    })

    ipc.send('handshake', null);
  }, [ipc]);

  return null;
};

export default HomeScript;
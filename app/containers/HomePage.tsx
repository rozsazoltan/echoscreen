/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { shell } from 'electron';
import React, { useRef, useState } from 'react';
import { Classes, Callout, Text, Button, Dialog } from '@blueprintjs/core';
import { Row, Grid } from 'react-flexbox-grid';
import { ToastProvider, DefaultToast } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import useAppVersions from '../hooks/useAppVersions';
import { compare } from 'compare-versions';

import TopPanel from '../components/TopPanel';
import { LIGHT_UI_BACKGROUND } from './SettingsProvider';
import EchoScreenStepper from './EchoScreenStepper';

// @ts-ignore: it is ok here, be like js it is fine
// eslint-disable-next-line react/prop-types
export const CustomToastWithTheme = ({ children, ...props }) => {
  return (
    <DefaultToast
      components={{ Toast: CustomToastWithTheme }}
      {...props}
      // @ts-ignore: some minor type complain, it is fine here
      style={{
        // eslint-disable-next-line react/prop-types
        color: props.isdarktheme === 'false' ? '#293742' : '#BFCCD6',
        backgroundColor:
          // eslint-disable-next-line react/prop-types
          props.isdarktheme === 'false' ? LIGHT_UI_BACKGROUND : '#394B59',
      }}
    >
      <>{children}</>
    </DefaultToast>
  );
};

export default function HomePage() {
  const { t } = useTranslation();
  const { latestVersion, currentVersion } = useAppVersions();
  const [showUpdateMessage, setShowUpdateMessage] = useState(true);

  const stepperRef = useRef();

  const shouldShowUpdate =
    latestVersion !== '' &&
    currentVersion !== '' &&
    compare(latestVersion, currentVersion, '>') &&
    showUpdateMessage;

  return (
    <ToastProvider
      placement="top-center"
      autoDismissTimeout={5000}
      components={{ Toast: CustomToastWithTheme }}
    >
      <div className={Classes.TREE}>
        <TopPanel stepperRef={stepperRef} />
        <EchoScreenStepper ref={stepperRef} />
      </div>

      <Dialog isOpen={shouldShowUpdate} autoFocus usePortal>
        <Grid>
          <div>
            <Row style={{ marginTop: '20px' }}>
              <Callout
                id="new-version-header"
                intent="primary"
                title={t('v{{version}}', { version: latestVersion })}
              >
                <Text>
                  {t(
                    'A new stable version of EchoScreen is available! Using the latest version ensures better performance, new features, and important security fixes.',
                  )}
                </Text>
                <Button
                  text={t('Update Now')}
                  icon="cloud-download"
                  intent="primary"
                  large
                  style={{ margin: '0.7rem 0' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    shell.openExternal('https://github.com/rozsazoltan/echoscreen/releases/latest');
                  }}
                />
                <Button
                  text={t('Later')}
                  icon="heart-broken"
                  intent="none"
                  small
                  style={{ margin: '0.7rem 0.5rem', padding: '0.4rem 0.6rem' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    setShowUpdateMessage(false);
                  }}
                />
              </Callout>
            </Row>
          </div>
        </Grid>
      </Dialog>
    </ToastProvider>
  );
}

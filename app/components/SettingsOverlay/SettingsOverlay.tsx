/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { shell } from 'electron';
import React, { useContext } from 'react';
import {
  Overlay,
  Classes,
  H3,
  H6,
  Tabs,
  Tab,
  Icon,
  Text,
  Checkbox,
} from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import useAppVersions from '../../hooks/useAppVersions';
import { Col, Row } from 'react-flexbox-grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  DARK_UI_BACKGROUND,
  LIGHT_UI_BACKGROUND,
  SettingsContext,
} from '../../containers/SettingsProvider';
import CloseOverlayButton from '../CloseOverlayButton';
import SettingRowLabelAndInput from './SettingRowLabelAndInput';
import isWithReactRevealAnimations from '../../utils/isWithReactRevealAnimations';
import config from '../../api/config';
import LanguageSelector from '../LanguageSelector';
import ToggleThemeBtnGroup from '../ToggleThemeBtnGroup';

const { port } = config;

const Fade = require('react-reveal/Fade');

interface SettingsOverlayProps {
  isSettingsOpen: boolean;
  handleClose: () => void;
}

const useStylesWithTheme = (isDarkTheme: boolean) =>
  makeStyles(() =>
    createStyles({
      checkboxSettings: { margin: '0' },
      overlayInnerRoot: { width: '90%' },
      overlayInsideFade: {
        height: '90vh',
        backgroundColor: isDarkTheme ? DARK_UI_BACKGROUND : LIGHT_UI_BACKGROUND,
      },
      absoluteCloseButton: { position: 'absolute', left: 'calc(100% - 65px)' },
      tabNavigationRowButton: { fontWeight: 700 },
      iconInTablLeftButton: { marginRight: '5px' },
    })
  );

export default function SettingsOverlay(props: SettingsOverlayProps) {
  const { t } = useTranslation();

  const { handleClose, isSettingsOpen } = props;

  const { currentVersion } = useAppVersions();

  const { isDarkTheme } = useContext(SettingsContext);

  const getClassesCallback = useStylesWithTheme(isDarkTheme);

  const getAutomaticUpdatesCheckboxInput = () => {
    return (
      <Checkbox
        disabled
        className={getClassesCallback().checkboxSettings}
        label={t('Disabled')}
      />
    );
  };

  const GeneralSettingsPanel: React.FC = () => (
    <>
      <Row middle="xs">
        <H3 className="bp3-text-muted">{t('General Settings')}</H3>
      </Row>
      <SettingRowLabelAndInput
        icon="style"
        label={t('Color Theme')}
        input={<ToggleThemeBtnGroup />}
      />
      <SettingRowLabelAndInput
        icon="translate"
        label={t('Language')}
        input={<LanguageSelector />}
      />
      <SettingRowLabelAndInput
        icon="automatic-updates"
        label={t('Automatic Updates')}
        input={getAutomaticUpdatesCheckboxInput()}
      />
    </>
  );

  const SecurityPanel: React.FC = () => (
    <div>
      <H3>
        <Icon icon="shield" iconSize={20} />
        {t('Security Settings')}
      </H3>
      <H6 className={Classes.RUNNING_TEXT}>
        {`HTML is great for declaring static documents, but it falters when we try
        to use it for declaring dynamic views in web-applications. AngularJS
        lets you extend HTML vocabulary for your application. The resulting
        environment is extraordinarily expressive, readable, and quick to
        develop.`}
      </H6>
    </div>
  );

  const AboutPanel: React.FC = () => (
    <Row center="xs" middle="xs" style={{ height: 'calc(100vh - 40%)' }}>
      <div>
        <Col xs={12}>
          <img
            src={`http://127.0.0.1:${port}/logo512.png`}
            alt="logo"
            style={{ width: '100px' }}
          />
        </Col>
        <Col xs={12}>
          <H3>{t('About EchoScreen')}</H3>
        </Col>
        <Col xs={12}>
          <Text>
            {`${t('Version')}: ${currentVersion}`}
          </Text>
        </Col>
        <Col xs={12}>
          <Text>
            {`${t('Copyright')} © ${new Date().getFullYear()} `}
            <a
              onClick={() => {
                shell.openExternal('https://linkedin.com/in/rozsazoltan');
              }}
              style={
                isDarkTheme
                  ? {}
                  : {
                      color: '#00a6f4',
                      fontWeight: 700,
                    }
              }
            >
              Rózsa Zoltán
            </a>
          </Text>
        </Col>
        <Col xs={12}>
          <Text>
            {`${t('Website')}: `}
            <a
              onClick={() => {
                shell.openExternal('https://github.com/rozsazoltan/echoscreen');
              }}
              style={
                isDarkTheme
                  ? {}
                  : {
                      color: '#00a6f4',
                      fontWeight: 700,
                    }
              }
            >
              https://github.com/rozsazoltan/echoscreen
            </a>
          </Text>
        </Col>
      </div>
    </Row>
  );

  const getTabNavSecurityButton = () => {
    return (
      <Row middle="xs" className={getClassesCallback().tabNavigationRowButton} style={{ padding: '0 .2rem' }}>
        <Icon
          icon="shield"
          className={getClassesCallback().iconInTablLeftButton}
        />
        <Text className="bp3-text-large">{t('Security')}</Text>
      </Row>
    );
  };

  const getTabNavGeneralSettingsButton = () => {
    return (
      <Row middle="xs" className={getClassesCallback().tabNavigationRowButton} style={{ padding: '0 .2rem' }}>
        <Icon
          icon="wrench"
          className={getClassesCallback().iconInTablLeftButton}
        />
        <Text className="bp3-text-large">{t('General')}</Text>
      </Row>
    );
  };

  const getTabNavAboutButton = () => {
    return (
      <Row middle="xs" className={getClassesCallback().tabNavigationRowButton} style={{ padding: '0 .2rem' }}>
        <Icon
          icon="info-sign"
          className={getClassesCallback().iconInTablLeftButton}
        />
        <Text className="bp3-text-large">{t('About')}</Text>
      </Row>
    );
  };

  return (
    <Overlay
      onClose={handleClose}
      className={`${Classes.OVERLAY_SCROLL_CONTAINER} bp3-overlay-settings`}
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose
      enforceFocus
      hasBackdrop
      isOpen={isSettingsOpen}
      usePortal
      transitionDuration={0}
    >
      <div className={getClassesCallback().overlayInnerRoot}>
        <Fade duration={isWithReactRevealAnimations() ? 700 : 0}>
          <div
            id="settings-overlay-inner"
            className={`${getClassesCallback().overlayInsideFade} ${
              Classes.CARD
            }`}
          >
            <CloseOverlayButton
              className={getClassesCallback().absoluteCloseButton}
              onClick={handleClose}
              isDefaultStyles
            />
            <Tabs
              animate
              id="TabsExample"
              key="vertical"
              renderActiveTabPanelOnly
              vertical
            >
              <Tab id="rx" title="" panel={<GeneralSettingsPanel />}>
                {getTabNavGeneralSettingsButton()}
              </Tab>
              <Tab id="ng" disabled title="" panel={<SecurityPanel />}>
                {getTabNavSecurityButton()}
              </Tab>
              <Tab id="cc" title="" panel={<AboutPanel />}>
                {getTabNavAboutButton()}
              </Tab>
              <Tabs.Expander />
            </Tabs>
          </div>
        </Fade>
      </div>
    </Overlay>
  );
}

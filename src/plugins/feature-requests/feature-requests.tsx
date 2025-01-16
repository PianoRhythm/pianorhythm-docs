import React, {useEffect} from 'react';
import clsx from 'clsx';
import {useColorMode} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';

import cannyScript from './cannyScript';
// import { styles } from 'prism-react-renderer/themes/github';
import styles from './styles.module.css';

const BOARD_TOKEN = '9d9cedc9-727a-7ff0-0d7a-97fbf7ddb427';

function useCannyTheme() {
  const {colorMode} = useColorMode();
  return colorMode === 'light' ? 'light' : 'dark';
}

function CannyWidget({basePath}: {basePath: string}) {
  useEffect(() => {
    cannyScript();
  }, []);

  const theme = useCannyTheme();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {Canny} = window as any;
    Canny('render', {
      boardToken: BOARD_TOKEN,
      basePath,
      theme,
    });
  }, [basePath, theme]);
  return (
    <main
      key={theme} // widget needs a full reset: unable to update the theme
      className={clsx('container', 'margin-vert--lg', styles.main)}
      data-canny
    />
  );
}

export default function FeatureRequests({
  basePath,
}: {
  basePath: string;
}): JSX.Element {
  return (
    <Layout title="Feedback" description="PianoRhythm Feature Requests page">
      <CannyWidget basePath={basePath} />
    </Layout>
  );
}
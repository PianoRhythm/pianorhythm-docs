import React, { JSX } from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function ChangelogListHeader({
  blogTitle,
}: {
  blogTitle: string;
}): JSX.Element {
  return (
    <header className="margin-bottom--lg">
      <Heading as="h1" style={{fontSize: '3rem'}}>
        {blogTitle}
      </Heading>
    </header>
  );
}

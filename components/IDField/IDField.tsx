'use client';

import { useEffect, useState } from 'react';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton, TextInput } from '@mantine/core';

export default function IDField({ id }: { id: string }) {
  const [pathname, setPathname] = useState<string>('');

  useEffect(() => {
    setPathname(window.location.origin);
  }, []);

  return (
    <TextInput
      value={`${pathname}/feed/${id}`}
      disabled
      rightSection={
        <CopyButton value={`${pathname}/feed/${id}`}>
          {({ copied, copy }) => (
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} onClick={copy} />
          )}
        </CopyButton>
      }
    />
  );
}

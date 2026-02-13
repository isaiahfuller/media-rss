'use client';

import { useEffect, useState } from 'react';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton, Menu, MenuDropdown, NativeSelect, TextInput } from '@mantine/core';

export default function IDField({ id }: { id: string }) {
  const [pathname, setPathname] = useState<string>('');
  const [format, setFormat] = useState<string>('rss');

  useEffect(() => {
    setPathname(window.location.origin);
  }, []);

  return (
    <>
      <TextInput
        value={`${pathname}/feed/${id}/${format}`}
        disabled
        rightSection={
          <CopyButton value={`${pathname}/feed/${id}/${format}`}>
            {({ copied, copy }) => (
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} onClick={copy} />
            )}
          </CopyButton>
        }
      />
      <NativeSelect
        data={[
          { value: 'rss', label: 'RSS' },
          { value: 'atom', label: 'Atom' },
          { value: 'json', label: 'JSON' },
        ]}
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      />
    </>
  );
}

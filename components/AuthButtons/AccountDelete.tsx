'use client';

import { deleteUser } from '@/lib/deleteUser';
import { Button } from '@mantine/core';

export default function AccountDeleteButton({ id }: { id: string }) {
  async function deleteAccount() {
    const data = await deleteUser(id);
    console.log(data);
  }
  return (
    <Button color="red" onClick={deleteAccount}>
      {'Delete Account'}
    </Button>
  );
}

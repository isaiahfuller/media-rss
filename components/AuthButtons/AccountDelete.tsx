'use client';

import { Button } from '@mantine/core';
import { deleteUser } from '@/lib/deleteUser';

export default function AccountDeleteButton({ id }: { id: string }) {
  async function deleteAccount() {
    await deleteUser(id);
  }
  return (
    <Button color="red" onClick={deleteAccount}>
      Delete Account
    </Button>
  );
}

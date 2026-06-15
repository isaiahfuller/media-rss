import { createClient } from "@/lib/supabase/client";

export async function deleteUser(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.functions.invoke('delete-user', {
    body: {
      id
    }
  });
  if (error) {
    return Response.json(
      { msg: 'Failed to delete user' },
      {
        status: 500,
      }
    );
  }
  return Response.json({
    msg: 'User deleted successfully',
  });
}

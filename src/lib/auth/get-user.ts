import { createClient as createServerSideClient } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/client";

export const getUserFromServerSide = async () => {
  try {
    const supabase = await createServerSideClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error("Error fetching user from server:", error);
    return { user: null, error };
  }
};

export const getUserFromClientSide = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error("Error fetching user from client:", error);
    return { user: null, error };
  }
};

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { error } from "console";

export const useAuth = () => {
  const { data: user, error } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const supabase = await createClient();
      return supabase.auth.getUser();
    },
    refetchOnWindowFocus: false,
  });

  return {
    user: user,
    error: error,
  };
};

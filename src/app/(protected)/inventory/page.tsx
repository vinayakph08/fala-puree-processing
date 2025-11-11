import { getUserFromServerSide } from "@/lib/auth/get-user";
import InventoryClientComponent from "./components/client-component";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getInventory } from "@/lib/inventory";

async function InventoryPage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InventoryClientComponent />
    </HydrationBoundary>
  );
}

export default InventoryPage;

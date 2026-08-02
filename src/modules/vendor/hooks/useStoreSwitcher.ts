import { useCallback } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { selectCurrentUser } from "@/features/userSlice";
import {
  useGetMyStoresQuery,
  useSwitchStoreMutation,
} from "@/services/storeApi";
import { getCookieDomain } from "@/utils/subdomain";

export function useStoreSwitcher() {
  const currentUser = useSelector(selectCurrentUser);
  const { data: stores = [], isLoading } = useGetMyStoresQuery();
  const [switchStore, { isLoading: isSwitching }] = useSwitchStoreMutation();
  const activeStore = stores.find((s) => s.id === currentUser?.active_store_id);

  const handleSwitchStore = useCallback(
    async (storeId: string) => {
      if (storeId === currentUser?.active_store_id) return;
      try {
        const result = await switchStore(storeId).unwrap();
        if (result.access_token) {
          Cookies.set("token", result.access_token, {
            expires: 7,
            secure: window.location.protocol === "https:",
            sameSite: "lax",
            domain: getCookieDomain(),
          });
        }
        window.location.reload();
      } catch {
        return;
      }
    },
    [currentUser?.active_store_id, switchStore],
  );

  return {
    stores,
    isLoading,
    isSwitching,
    activeStore,
    handleSwitchStore,
  };
}

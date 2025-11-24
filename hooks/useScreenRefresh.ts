// hooks/useScreenRefresh.ts
import { useCallback, useState } from "react";

export function useScreenRefresh(onReload: () => Promise<void> | void) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await onReload();
    } finally {
      setRefreshing(false);
    }
  }, [onReload]);

  return { refreshing, handleRefresh };
}

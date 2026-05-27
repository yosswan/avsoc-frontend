import { entries, isNil, set } from "lodash";
import qs from "qs";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQueryParams<T = any>(
  defaults?: Partial<T>
): [T, (value?: Partial<T>) => void] {
  const router = useRouter();
  const params = router.query;

  const queryParams = useMemo(() => {
    return qs.parse(params as any, {
      ignoreQueryPrefix: true,
    });
  }, [params]);

  const setValue = useCallback((value?: Partial<T>) => {
    entries(value).forEach(([key, val]: any) => {
      if (isNil(val)) {
        delete queryParams[key];
      } else {
        set(queryParams, key, val);
      }
    });
    router.replace({
      query: qs.stringify(queryParams),
    });
  }, [queryParams, router]);

  return useMemo(
    () => [{ ...defaults, ...queryParams } as T, setValue],
    [defaults, queryParams, setValue]
  );
}

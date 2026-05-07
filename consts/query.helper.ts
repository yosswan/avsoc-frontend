import { entries, isNil, set } from "lodash";
import qs from "qs";
import { useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQueryParams<T = any>(
  defaults?: Partial<T>
): [T, (value?: Partial<T>) => void] {
  // const { pathname, search } = useLocation();
  // const navigate = useNavigate();
  const router = useRouter();
  const params = router.query;
  const pathname = router.pathname;

  const queryParams = useMemo(() => {
    return qs.parse(params as any, {
      ignoreQueryPrefix: true,
    });
  }, [params, router, pathname]);

  const setValue = (value?: Partial<T>) => {
    entries(value).forEach(([key, value]: any) => {
      if (isNil(value)) {
        delete queryParams[key];
      } else {
        set(queryParams, key, value);
      }
    });
    router.replace({
      query: qs.stringify(queryParams),
    });
  };

  return [{ ...defaults, ...queryParams } as T, setValue];
}

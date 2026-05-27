import { GET_USER } from "services";
import { ProfilApiService } from "services";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export const useUser = (fetchData = false) => {
  const { data: session, update } = useSession();

  const { data: queryData, isLoading, refetch } = useQuery<any>(
    [GET_USER],
    () => ProfilApiService.getUser(),
    {
      enabled: !!fetchData,
      refetchInterval: session?.user && !session?.user?.verificado ? 3000 : false,
    }
  );

  useEffect(() => {
    const userIsVerifiedInDatabase = queryData?.user?.verificado;
    const userNotVerifiedInSession = session?.user && !session?.user?.verificado;
    if (userNotVerifiedInSession && userIsVerifiedInDatabase) {
      update({ verificado: true });
    }
  }, [queryData?.user?.verificado, session?.user, update]);

  const data = useMemo(() => {
    if (!fetchData || isLoading) {
      return { ...session, scope_actual: session?.user?.scope_actual };
    }
    return queryData;
  }, [fetchData, isLoading, session, queryData]);

  return useMemo(
    () => ({ data, loading: isLoading, refetch }),
    [data, isLoading, refetch]
  );
};
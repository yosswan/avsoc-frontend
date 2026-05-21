import { GET_USER } from "services";
import { ProfilApiService } from "services";
import { QueryObserverResult, RefetchOptions, useQuery } from "react-query";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export const useUser = (fetchData = false) => {
  const { data: session, update } = useSession();
  let data: any;
  let isLoading: boolean = false;
  let refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, unknown>>|Promise<void> = async () => {};

	({ data, isLoading, refetch } = useQuery<any>(
		[GET_USER],
		() => ProfilApiService.getUser(),
		{
			enabled: !!fetchData,
			refetchInterval: session?.user && !session?.user?.verificado ? 3000 : false,
		}
	));

	useEffect(() => {
		const userIsVerifiedInDatabase = data?.user?.verificado;
		const userNotVerifiedInSession = session?.user && !session?.user?.verificado;

		if (userNotVerifiedInSession && userIsVerifiedInDatabase) {
			update({ verificado: true });
		}
	}, [data?.user?.verificado, session?.user, update]);

  if (!fetchData || isLoading) {
    data = { ...session, scope_actual: session?.user?.scope_actual };
  }

  return { data, loading: isLoading, refetch };
};
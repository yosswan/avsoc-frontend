import { GET_USER } from "services";
import { ProfilApiService } from "services";
import { QueryObserverResult, RefetchOptions, useQuery } from "react-query";
import { signIn, useSession } from "next-auth/client";

export const useUser = (fetchData = false) => {
  const [session] = useSession();
  // const user = session?.user ? (session.user as UserType) : undefined;
  // if (session) {
	let data: any;
	let isLoading: boolean = false;
	let refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, unknown>>|Promise<void> = async () => {};
	if (fetchData) {
		({ data, isLoading, refetch } = useQuery<any>(
			[GET_USER],
			() => ProfilApiService.getUser(),
			{
				refetchInterval: session?.user && !session?.user?.verificado ? 3000 : false
			}
		));
		if (session?.user?.email && !session?.user.verificado && data?.user?.verificado) {
			signIn("credentials", {
				newData: JSON.stringify({ user: { verificado: true }}),
				redirect: false,
				oldSession: JSON.stringify(session),
			});
		}
	} else {
		data = session;
	}

  // if (apiUser) {
  // 	console.log('api', apiUser);
  // 	apiUser = ProfileResponse.mapValuesTo(apiUser.data);
  // 	console.log('desp', apiUser);
  // }

  return { data, loading: isLoading, refetch };
  // }
};

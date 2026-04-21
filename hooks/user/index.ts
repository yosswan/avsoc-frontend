import { UserType } from "interfaces";
import { GET_USER } from "services";
import { ProfilApiService } from "services";
import { QueryObserverResult, RefetchOptions, useQuery } from "react-query";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useUser = (fetchData = false) => {
  const [session] = useSession();
  // const user = session?.user ? (session.user as UserType) : undefined;
  // if (session) {
  // console.log(session);
	let data: any;
	let isLoading: boolean = false;
	let refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, unknown>>|Promise<void> = async () => {};
	if (fetchData) {
		({ data, isLoading, refetch } = useQuery<any>([GET_USER], () =>
			ProfilApiService.getUser()
		));
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

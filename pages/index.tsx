import * as React from 'react';
import { GetServerSideProps } from 'next';
import { auth } from "../app/auth";
import { getToken } from 'next-auth/jwt';

const Home = () => {
	return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getToken({ req: context.req as any, secret: process.env.NEXTAUTH_SECRET });
	if (!session) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	}
	return {
		redirect: {
			destination: '/dashboard',
			permanent: false,
		},
	};
};

export default Home;

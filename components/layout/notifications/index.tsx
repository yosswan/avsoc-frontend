import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { XIcon } from '@heroicons/react/outline';
import { Typography } from 'components/common/typography';
import Styles from './styles.module.scss';

interface LayoutDashboardProps {
	title: string;
	isLoading?: boolean;
	sidebarOpen?: boolean;
	setSidebarOpen?: any;
	initialFocus?: any;
}
export const Notifications: React.FC<LayoutDashboardProps> = ({
	sidebarOpen = false,
	setSidebarOpen,
	initialFocus,
}) => {
	return (
		<Transition.Root show={sidebarOpen} as={Fragment}>
			<Dialog
				initialFocus={initialFocus}
				as="div"
				static
				className="fixed inset-0 z-40 justify-end flex bg-overlay"
				open={sidebarOpen}
				onClose={setSidebarOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="transition-opacity ease-linear duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Dialog.Overlay className="fixed inset-0 bg-transparent-600" />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="transition ease-in-out duration-300 transform"
					enterFrom="translate-x-full"
					enterTo="-translate-x-0"
					leave="transition ease-in-out duration-300 transform"
					leaveFrom="-translate-x-0"
					leaveTo="translate-x-full"
				>
					<div
						className={clsx(
							'relative flex-1 flex flex-col md:max-w-md max-w-sm w-full bg-secondary',
							Styles.marginNotification
						)}
					>
						<div className="flex-1 px-5 h-0 pb-4 overflow-y-auto bg-white">
							<div className="relative text-white p-6 flex items-center justify-center flex-col pl-1 pr-3 py-1 sm:pl-3 sm:py-3">
								<Typography
									type="span"
									className="mt-2 f-36 font-semibold text-gray-500"
								>
									Notifications
								</Typography>
							</div>
							<div className="divider-full px-4 mt-6 mb-3"></div>
							<div className="space-y-1">
								<div className="flex">
									<div className="flex-1">icon</div>
									<div className="flex-auto">
										Lorem ipsum dolor sit amet.
										<div className="flex justify-between">
											<div>recarga</div>
											<div>Hoy, 9:13 am</div>
										</div>
									</div>
								</div>
							</div>

							<div className="absolute top-0 left-0 pt-2">
								<button
									className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
									onClick={() => setSidebarOpen(false)}
								>
									<span className="sr-only">Close sidebar</span>
									<XIcon
										className="w-full p-1 text-gray-500"
										aria-hidden="true"
									/>
								</button>
							</div>
						</div>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition.Root>
	);
};

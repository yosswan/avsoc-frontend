import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Icons } from "consts";
import { Fragment, useCallback, useRef, useState } from "react";

export const useModal = () => {
	const [isShow, setIsShow] = useState(false);
	const ref = useRef<any>(null);
	const hide = useCallback(() => {
		setIsShow(false);
	}, []);

	const show = useCallback(() => {
		setIsShow(true);
	}, []);

	const Modal = useCallback(({ children, isShow }: { children?: React.ReactNode; isShow: boolean }) => {
		return (
			isShow && (
				<Transition.Root show={isShow} as={Fragment}>
					<Dialog
						as="div"
						static
						className="fixed z-20 inset-0 overflow-y-auto"
						initialFocus={ref}
						open={isShow}
						onClose={hide}
					>
						<div
							ref={ref}
							className="flex items-center justify-center pb-20 pt-4 px-4 min-h-screen text-center sm:block sm:p-0 bg-overlay"
						>
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Dialog.Overlay className="fixed inset-0 bg-[#18191B] opacity-75 transition-opacity" />
							</Transition.Child>

							<span
								className="hidden sm:inline-block sm:align-middle sm:h-screen"
								aria-hidden="true"
							>
								&#8203;
							</span>
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<div className="bg-custom-gray-2 rounded-lg inline-block align-bottom text-left shadow-xl overflow-hidden transform transition-all sm:align-middle sm:my-8 w-full md:max-w-2xl">
									<div className="pb-5 pt-6 bg-gray-0 sm:pb-8 px-4">
										<h1
											onClick={hide}
											className={clsx(
												"text-2xl md:text-4xl text-gray-200 absolute right-1 top-0 cursor-pointer"
											)}
										>
											<img src={Icons.close} alt="close" />
										</h1>
										{children}
									</div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>
			)
		);
	}, [hide]);

	return { Modal, hide, isShow, show };
};

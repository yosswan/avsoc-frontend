import { Typography } from "components/common/typography";
import clsx from "clsx";
import React from "react";
import { formatDateComplete, ValidateString } from "lib/helper";
import moment from "moment";
import { DocumentTextIcon } from "@heroicons/react/solid";
import Restricted from "context/PermissionProvider/Restricted";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import { Button } from "components/common/button";

type InformeViewProps = {
	index: number;
	informe: any;
	handlePreviewImage: (src: string) => void;
	isFirmado: (informe: any) => any;
	handleShowApprove: (id: any) => any;
	handleShowLoadScore: (data: any) => any;
};

export const InformeView: React.FC<InformeViewProps> = ({ index, informe, handlePreviewImage, isFirmado, handleShowApprove, handleShowLoadScore }) => {
	return (
		<div
			key={index}
			className="container-form shadow-md pb-10 px-5 w-full my-16 "
		>
			<div className="gap-x-6 gap-y-10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 text-left ">
				<React.Fragment key={index}>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Descripcion
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{ValidateString(informe?.descripcion)}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Objetivo
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{ValidateString(informe?.objetivo)}
						</Typography>
					</div>

					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Participantes
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.participantes}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Fecha de Realización
						</Typography>
						{
							informe?.fecha_realizado.map((f: string) => 
								<Typography
									type="span"
									className={clsx(
										"ml-3 font-normal mb-2 block f-18"
									)}
								>
									{moment(f).format(formatDateComplete)}
								</Typography>
							)
						}
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Fecha Enviado
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{moment(
								informe?.fecha_enviado
							).format(formatDateComplete)}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Firma Anciano
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.firma_anciano ? (
								<span className="text-secondary font-bold">
									SI
								</span>
							) : (
								<span className="text-alert-error font-bold">
									NO
								</span>
							)}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Firma Consejo
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.firma_consejo_regional ? (
								<span className="text-secondary font-bold">
									SI
								</span>
							) : (
								<span className="text-alert-error font-bold">
									NO
								</span>
							)}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Firma Pastor
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.firma_pastor ? (
								<span className="text-secondary font-bold">
									SI
								</span>
							) : (
								<span className="text-alert-error font-bold">
									NO
								</span>
							)}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Puntuación
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.puntuacion
								? informe?.puntuacion
								: "N/A"}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Observación
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.observacion
								? informe?.observacion
								: "N/A"}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Estado
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{
								informe?.alert > 0
								? informe?.alert == 1 ?
									'Informe fuera de tiempo'
									: informe?.alert == 2 ?
									'Actividad fuera de tiempo'
									: 'Informe y actividad fuera de tiempo'
								: "N/A"
							}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Puntuación Maxima
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.puntuacion_maxima}
						</Typography>
					</div>
					<div className="item col-span-1">
						<Typography
							type="label"
							className={clsx(
								"ml-3 font-bold mb-2 block f-18"
							)}
						>
							Mes
						</Typography>
						<Typography
							type="span"
							className={clsx(
								"ml-3 font-normal mb-2 block f-18"
							)}
						>
							{informe?.nombre_mes}
						</Typography>
					</div>
					<div className="col-span-full container-images-informes flex-wrap flex justify-center gap-4 mt-0 md:mt-10 w-full">
						{
							[1, 2, 3].map((i) => {
								if (informe['imagen'+i]) {
									return informe['imagen'+i].endsWith('jpg') || informe['imagen'+i].startsWith('data:') ? 
											<img
												src={informe['imagen'+i]}
												className="hover:opacity-50 cursor-pointer w-52 h-40 md:w-64  md:h-64 object-cover rounded-2xl"
												alt={'archivo '+i}
												onClick={() =>
													handlePreviewImage(informe['imagen'+i])
												}
											/>
										: <a target="_blank" className="hover:opacity-50 cursor-pointer w-52 h-40 md:w-64  md:h-64" href={informe['imagen'+i]}>
											<DocumentTextIcon />
											<Typography type="title" className="font-bold text-center">
												{ informe['imagen'+i].split('.').at(-1)?.toLocaleUpperCase() }
											</Typography>
										</a>
								}
							})
						}
					</div>
				</React.Fragment>
			</div>
			{!isFirmado(informe) && (
				<Restricted
					module={ModuleEnums.EVENTO_PRECAMPOREE}
					typePermisse={
						PermissionsEnums.APPROVE_FORM
					}
				>
					{informe?.editar && (
						<div className="mt-28 justify-center text-center flex w-full">
							<Button
								labelProps="f-18 font-bold"
								label={"Aprobar Informe"}
								fill
								className="bg-alert-success border-alert-success max-w-[200px]"
								boderRadius="rounded-full"
								size="full"
								sizesButton="py-3"
								onClick={() =>
									handleShowApprove(informe?.id)
								}
							/>
						</div>
					)}
				</Restricted>
			)}
			{informe?.editar && (
				<Restricted
					module={ModuleEnums.EVENTO_PRECAMPOREE}
					typePermisse={PermissionsEnums.LOAD_SCORE}
				>
					<div className="mt-28 justify-center text-center flex w-full">
						<Button
							labelProps="f-18 font-bold"
							label={"Cargar Puntuación"}
							fill
							className="bg-alert-success border-alert-success max-w-[200px]"
							boderRadius="rounded-full"
							size="full"
							sizesButton="py-3"
							onClick={() =>
								handleShowLoadScore(informe)
							}
						/>
					</div>
				</Restricted>
			)}
		</div>
	);
}

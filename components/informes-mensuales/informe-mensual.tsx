import { isEmpty } from "lodash";
import * as React from "react";
import { Tabs } from "antd";
import { ActividadForm } from "components/informes-mensuales/form-actividad";
import { Button } from "components/common/button";
import { InformeForm } from "components/informes-mensuales/form-informe";
import Restricted from "context/PermissionProvider/Restricted";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import { Alert } from "components/common/alert";
import { Params } from "pages/dashboard/informes-mensuales";
import { TrashIcon } from '@heroicons/react/solid';
import { useModal } from "hooks/modal";
import DeleteActividad from "./delete-actividad";

const { TabPane } = Tabs;

type InformeMensualProps = {
  refetch: any;
	itemClub: any;
	params: Params;
	showCreateActivity: () => void;
	hideCreateActivity: () => void;
};

export const InformeMensual: React.FC<InformeMensualProps> = ({
  refetch, itemClub, params, showCreateActivity, hideCreateActivity
}) => {
	const {
    Modal: ModalDelete,
    hide: hideDelete,
    isShow: isShowDelete,
    show: showDelete,
  } = useModal();

	const [toDelete, setToDelete] = React.useState({
		id: 0,
		name: ''
	});

	const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
			const actividad = itemClub.informe.actividades[+targetKey];
			setToDelete({
				id: actividad.id,
				name: actividad.name,
			});
      showDelete();
    }
  };

	return <>
		<div className="flex gap-2 flex-wrap">
			{itemClub?.informe?.puntuacion && (
				<Alert
					className="mb-5 bg-alert-success rounded-xl"
					hideIcon
				>
					<p className="text-[white] text-base py-5">
						Puntuación:{"  "}
						<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
							{itemClub?.informe?.puntuacion}/
							{itemClub?.informe?.puntuacion_maxima}
						</span>
					</p>
				</Alert>
			)}
			<Alert
				className="mb-5 bg-primary rounded-xl"
				hideIcon
			>
				<p className="text-[white] text-base py-5">
					Firma Anciano:{"  "}
					<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
						{itemClub?.informe?.firma_anciano ? (
							<span className="text-secondary font-bold">
								SI
							</span>
						) : (
							<span className="text-alert-error font-bold">
								NO
							</span>
						)}
					</span>
				</p>
			</Alert>
			<Alert
				className="mb-5 bg-secondary rounded-xl"
				hideIcon
			>
				<p className="text-[white] text-base py-5">
					Firma Pastor:{"  "}
					<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
						{itemClub?.informe?.firma_pastor ? (
							<span className="text-secondary font-bold">
								SI
							</span>
						) : (
							<span className="text-alert-error font-bold">
								NO
							</span>
						)}
					</span>
				</p>
			</Alert>
			<Alert
				className="mb-5 bg-overlay rounded-xl"
				hideIcon
			>
				<p className="text-[white] text-base py-5">
					Firma Consejo Regional:{"  "}
					<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
						{itemClub?.informe?.firma_consejo_regional ? (
							<span className="text-secondary font-bold">
								SI
							</span>
						) : (
							<span className="text-alert-error font-bold">
								NO
							</span>
						)}
					</span>
				</p>
			</Alert>
			<Alert
				className="mb-5 bg-success rounded-xl"
				hideIcon
			>
				<p className="text-[black] text-base py-5">
					Fecha de envío:{" "}
					<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
						{itemClub?.informe?.fecha}
					</span>
				</p>
			</Alert>
			{itemClub?.informe?.observacion && (
				<Alert className=" bg-overlay rounded-xl mb-5" whiteIcon={true}>
					<div className="flex items-center gap-2 text-[white] text-base py-5">
						<span className="whitespace-nowrap">Observación:</span>
						<div className="bg-white text-[black] rounded-lg px-3 py-1 text-center w-full">
							{itemClub?.informe?.observacion}
						</div>
					</div>
				</Alert>
			)}
			{itemClub?.informe?.alert > 0 && (
				<Alert className=" bg-[#ffc107] rounded-xl mb-5">
					<div className="flex items-center gap-2 text-[black] text-base py-5">
						<span className="whitespace-nowrap">Estado:</span>
						<div className="bg-white rounded-lg px-3 py-1 text-center w-full">
							{
								itemClub?.informe?.alert == 1 ?
								'Informe fuera de tiempo'
								: itemClub?.informe?.alert == 2 ?
								'Actividad fuera de tiempo'
								: 'Informe y actividad fuera de tiempo'
							}
						</div>
					</div>
				</Alert>
			)}
		</div>


		<Restricted
			module={ModuleEnums.INFORMES_MENSUALES}
			typePermisse={PermissionsEnums.LOAD_FORMS}
		>
			<div className="my-10">
				<div className="max-w-[600px] mx-auto">
					<InformeForm
						refetch={refetch}
						className="shadow-lg"
						data={itemClub?.informe}
						isEditable={itemClub.informe?.editar}
					/>
				</div>
			</div>
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-10 mt-20">
				Actividades
			</h2>
			{itemClub?.informe?.editar && (
				<div className="flex justify-end">
					<Button
						className="bg-primary max-w-[200px] border-[black] hover:bg-transparent hover:text-alert-success hover:border-alert-success"
						labelProps="f-18 font-normal"
						label={"+ Crear actividad"}
						fill
						boderRadius="rounded-full"
						size="full"
						type="submit"
						sizesButton="py-3"
						onClick={showCreateActivity}
					/>
				</div>
			)}

			<div className="mt-10">
				<Tabs
					type={ itemClub.informe.actividades.length > 1 ? "editable-card" : "card" }
					className="tabs-antd-custom justify-center"
					onEdit={ onEdit }
					hideAdd
					items={
						itemClub?.informe?.actividades?.map(
							(item: any, index: any) => {
								return {
									key: index,
									label: item?.name,
									className: "mb-10",
									closeIcon: <div className="w-4 text-overlay hover:text-primary"><TrashIcon /></div>,
									children: (
										<div
											key={index}
											className="mt-0 w-full md:max-w-[650px] mx-auto mb-20"
										>
											<ActividadForm
												key={index}
												className="shadow-lg"
												refetch={refetch}
												hide={hideCreateActivity}
												data={item}
												isEditable={
													itemClub.informe?.editar
												}
												dateSelected={params.fecha}
											></ActividadForm>
										</div>
									)
								}
							}
						)
					}
				>
				</Tabs>
			</div>
			<ModalDelete isShow={isShowDelete}>
				<DeleteActividad hide={hideDelete} refetch={refetch} id_actividad={toDelete.id} name_actividad={toDelete.name} />
			</ModalDelete>
		</Restricted>

		<Restricted
			module={ModuleEnums.INFORMES_MENSUALES}
			typePermisse={PermissionsEnums.VIEW_DATA_FORMS}
		>
			<div className="mt-8 flex flex-col justify-center">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
					<div className="inline-block min-w-min mx-auto py-2 align-middle md:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-yellow ring-opacity-5 md:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50"></thead>
								<tbody className="divide-y divide-yellow bg-white">
									<tr
										key=""
										className="divide-x divide-yellow"
									>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
											Nº Reuniones
										</td>
										<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
											{itemClub?.informe?.nro_reuniones}
										</td>
										<td className="whitespace-nowrap font-bold p-4 text-sm text-[black]">
											% Asistencia
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 font-medium">
											{itemClub?.informe?.porcentaje_asistencia?.toFixed(
												2
											)}
											%
										</td>
									</tr>
									<tr
										key=""
										className="divide-x divide-yellow"
									>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
											Nº Juntas Planeación:
										</td>
										<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
											{
												itemClub?.informe
													?.reuniones_directiva
											}
										</td>
										<td className="whitespace-nowrap font-bold p-4 text-sm text-[black]">
											Nº Juntas con Padres:
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 font-medium">
											{
												itemClub?.informe
													?.reuniones_padres
											}
										</td>
									</tr>
									<tr
										key=""
										className="divide-x divide-yellow"
									>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
											N° Células Juveniles:
										</td>
										<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
											{itemClub?.informe?.numero_gpss}
										</td>
										<td className="whitespace-nowrap font-bold p-4 text-sm text-[black]">
											Involucrados en SJ:
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 font-medium">
											{itemClub?.informe?.involucrados_sj}
										</td>
									</tr>

									<tr
										key=""
										className="divide-x divide-yellow"
									>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
											Inscritos del mes:
										</td>
										<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
											{itemClub?.informe?.inscritos_mes}
										</td>
										<td className="whitespace-nowrap font-bold p-4 text-sm text-[black]">
											Bautismos del mes:
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 font-medium">
											{
												itemClub?.informe
													?.numero_bautismos
											}
										</td>
									</tr>

									<tr
										key=""
										className="divide-x divide-yellow"
									>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
											Blanco de Estudios Bíblicos:
										</td>
										<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
											{
												itemClub?.informe
													?.blanco_estudios_biblicos
											}
										</td>
										<td className="whitespace-nowrap font-bold p-4 text-sm text-[black]">
											Blanco de Reclutas:
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 font-medium">
											{itemClub?.informe?.blanco_reclutas}
										</td>
									</tr>

									<tr
										key=""
										className="divide-x divide-yellow"
									>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
											Miembros Dando Estudio Bíblico:
										</td>
										<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
											{
												itemClub?.informe
													?.miembros_dando_e_b
											}
										</td>
										<td className="whitespace-nowrap font-bold p-4 text-sm text-[black]">
											Miembros Recibiendo Estudio Bíblico:
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 font-medium">
											{
												itemClub?.informe
													?.miembros_recibiendo_e_b
											}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-10">
				{!isEmpty(itemClub?.informe?.actividades) && (
					<div className="mt-20 w-full md:w-[80%] mx-auto mb-20">
						{/* {tabs && <Tabs tabs={tabs} setTabs={setTabs} /> */}
						<Tabs
							type="card"
							className="tabs-antd-custom justify-center"
						>
							{itemClub?.informe?.actividades?.map(
								(item: any, index: number) => {
									return (
										<TabPane
											tab={item?.name}
											key={index}
											className="mb-10"
										>
											<div className="container-actividad border border-gray-200 p-2 rounded-3xl">
												<div className="mt-8 flex flex-col justify-center">
													<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
														<div className="inline-block min-w-full mx-auto py-2 align-middle md:px-6 lg:px-8">
															<div className="overflow-hidden shadow ring-1 ring-yellow ring-opacity-5 md:rounded-none">
																<table className="min-w-full divide-y divide-gray-300">
																	<thead className="bg-gray-50"></thead>
																	<tbody className="divide-y divide-yellow bg-white">
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Tipo:
																			</td>
																			<td className="whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
																				{item?.tipo}
																			</td>
																		</tr>
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Lugar:
																			</td>
																			<td className="p-4 text-sm text-gray-500 font-medium">
																				{item?.lugar}
																			</td>
																		</tr>
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Fecha:
																			</td>
																			<td className="p-4 text-sm text-gray-500 font-medium">
																				{item?.fecha}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>

												<div className="flex flex-col justify-center">
													<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
														<div className="inline-block min-w-full mx-auto py-2 align-middle md:px-6 lg:px-8">
															<div className="overflow-hidden shadow ring-1 ring-yellow ring-opacity-5 md:rounded-none">
																<table className="min-w-full divide-y divide-gray-300">
																	<thead className="bg-gray-50"></thead>
																	<tbody className="divide-y divide-yellow bg-white">
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="text-center whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Descripción
																			</td>
																		</tr>
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="text-center p-4 text-sm text-gray-500 font-medium">
																				{
																					item?.descripcion
																				}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>

												<div className="flex flex-col justify-center">
													<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
														<div className="inline-block min-w-full mx-auto py-2 align-middle md:px-6 lg:px-8">
															<div className="overflow-hidden shadow ring-1 ring-yellow ring-opacity-5 md:rounded-none">
																<table className="min-w-full divide-y divide-gray-300">
																	<thead className="bg-gray-50"></thead>
																	<tbody className="divide-y divide-yellow bg-white">
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="text-center whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Objetivo
																			</td>
																		</tr>
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="text-center p-4 text-sm text-gray-500 font-medium">
																				{item?.objetivo}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>

												<div className="flex flex-col justify-center">
													<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
														<div className="inline-block min-w-full mx-auto py-2 align-middle md:px-6 lg:px-8">
															<div className="overflow-hidden shadow ring-1 ring-yellow ring-opacity-5 md:rounded-none">
																<table className="min-w-full divide-y divide-gray-300">
																	<thead className="bg-gray-50"></thead>
																	<tbody className="divide-y divide-yellow bg-white">
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="text-center whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Asistencia
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>

												<div className="flex flex-col justify-center">
													<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
														<div className="inline-block min-w-full mx-auto py-2 align-middle md:px-6 lg:px-8">
															<div className="shadow ring-1 ring-yellow ring-opacity-5 md:rounded-none">
																<table className="min-w-full divide-y divide-gray-300">
																	<thead className="bg-gray-50"></thead>
																	<tbody className="divide-y divide-yellow bg-white">
																		<tr
																			key=""
																			className="divide-x divide-yellow"
																		>
																			<td className="text-center py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Nº Miembros:
																			</td>
																			<td className="text-center whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
																				{
																					item?.asistencia_miembros
																				}
																			</td>
																			<td className="text-center py-4 pl-4 pr-4 text-sm font-bold text-[black] sm:pl-6">
																				Nº Visitas:
																			</td>
																			<td className="text-center whitespace-nowrap p-4 text-sm text-gray-500 font-medium">
																				{
																					item?.asistencia_no_miembros
																				}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>

												<div className="text-center flex justify-center mt-5">
													<img
														src={item?.foto}
														className="max-w-sm rounded-lg"
														alt=""
													/>
												</div>
											</div>
										</TabPane>
									);
								}
							)}
						</Tabs>
					</div>
				)}
			</div>
		</Restricted>
	</>
}
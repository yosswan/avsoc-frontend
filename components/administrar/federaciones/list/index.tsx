import { Icon } from "components/icon";
import { Icons } from "consts";
import { getSession, ValidateImage, ValidateImageUser, ValidateString } from "lib/helper";
import { GetServerSideProps } from "next";
import * as React from "react";
const TableFederacion = ({ data }: any) => {
  return (
    <div className="flex flex-col mb-16">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow-md overflow-hidden border-b border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yellow">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Presidente de Consejo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Nro. <br /> Iglesias
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Nro. <br /> Clubes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Nro. <br /> Conquis
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Nro. <br /> GM
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="w-10 h-10 object-cover object-center rounded-full"
                            src={ValidateImage(item.logo)}
                            alt=""
                          />
                        </div>
                        <div className="ml-5">
                          <div className="text-sm font-medium text-gray-900">
                            {item.abreviatura}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="w-10 rounded-full"
                            src={ValidateImageUser(item.foto_presidente)}
                            alt=""
                          />
                        </div>
                        <div className="ml-5">
                          <div className="text-sm font-medium text-gray-900">
                            {ValidateString(item.presidente)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item?.nro_iglesias}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.nro_clubes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.nro_conquistadores}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.nro_gm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-8">
                          <Icon
                            src={Icons.edit}
                            fill="white"
                            className="max-w-[50px] w-8"
                          />
                        </div>
                        <div className="flex-shrink-0 h-10 w-8 ml-5">
                          <Icon
                            src={Icons.more}
                            fill="var(--color-primary)"
                            className="max-w-[50px] w-8"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableFederacion;

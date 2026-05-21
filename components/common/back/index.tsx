import clsx from "clsx";
import { Icon } from "components/icon";
import { Icons } from "consts";
import { useRouter } from "next/router";
import React from "react";

export default function Back({ className }: any) {
  const router = useRouter();
  return (
    <div
      className={clsx("flex justify-items-start text-left w-full", className)}
    >
      <div
        className="container-back flex gap-3 items-center border-yellow px-4 border rounded-md py-1 hover:bg-yellow cursor-pointer"
        onClick={() => router.back()}
      >
        <Icon
          src={Icons.arrowSolidLeft}
          fillPath
          className="w-2 text-yellow "
        />
        <span className="text-xl font-bold text-black text-left">Atrás</span>
      </div>
    </div>
  );
}

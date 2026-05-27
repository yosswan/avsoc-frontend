import clsx from "clsx";
import { Icon } from "components/icon";
import { Icons } from "consts";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const Back = React.memo(({ className }: any) => {
  const router = useRouter();
  const handleBack = useCallback(() => { router.back(); }, [router]);
  return (
    <div
      className={clsx("flex justify-items-start text-left w-full", className)}
    >
      <div
        className="container-back flex gap-3 items-center border-yellow px-4 border rounded-md py-1 hover:bg-yellow cursor-pointer"
        onClick={handleBack}
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
});

export default Back;

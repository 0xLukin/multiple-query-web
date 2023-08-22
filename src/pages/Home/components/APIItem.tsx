import ProgressBar from "@/components/ProgressBar";
import PortalModalCenter from "@/components/portalDialog/PortalModalCenter";
import classNames from "classnames";
import { useState } from "react";
import SubscribePlansModal from "./SubscribePlansModal";
import { TApiDetails, TApi } from "@/types";
import { uppercaseFirstLetter, formatDate } from "../../../utils/utils";
import useAPI from "@/hooks/useAPI";
import { LoadingIcon } from "@/components/icons";
import { useTranslation } from "react-i18next";

interface APIItemProps {
  name: TApi;
  apiDetails: TApiDetails | null;
}

const APIItem: React.FC<APIItemProps> = ({ name, apiDetails }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-2 flex max-w-3xl flex-col justify-between overflow-auto rounded-lg bg-white/50 p-2 transition duration-300 hover:bg-white/70 hover:shadow">
      <section className="mb-2 flex justify-between gap-4">
        <span className="text-xl font-bold">
          {t(uppercaseFirstLetter(name))}
        </span>

        <UnOrSubscribeButton api={name} active={!!apiDetails} />
      </section>
      <section
        className={classNames("", {
          "text-center": !apiDetails,
        })}
      >
        {apiDetails ? (
          <div>
            <section>
              <span className="mb-1 block text-sm text-slate-500">
                {t("Plan")}:{" "}
                <span className="font-bold capitalize text-black/60">
                  {t(uppercaseFirstLetter(apiDetails.plan))}
                </span>
              </span>

              <span className="mb-4 block text-sm text-slate-500">
                {t("Next payment")}:{" "}
                <span className="font-bold text-black/60">
                  {formatDate(apiDetails.expire_at)}
                </span>
              </span>

              <span className="mb-1 block text-sm text-slate-500">
                {t("Total tokens")}:{" "}
                <span className="font-bold text-black/60">
                  {apiDetails.total_tokens}
                </span>
              </span>

              <span className="mb-1 block text-sm text-slate-500">
                {t("Remaining tokens")}:{" "}
                <span className="font-bold text-blue-600">
                  {apiDetails.remaining_tokens}
                </span>
              </span>

              {apiDetails.total_tokens && apiDetails.remaining_tokens && (
                <ProgressBar
                  numerator={apiDetails.remaining_tokens}
                  denominator={apiDetails.total_tokens}
                />
              )}
            </section>
          </div>
        ) : (
          <span className="font-extralight italic text-stone-400">
            {t("Subscribe to activate this API")}
          </span>
        )}
      </section>
    </div>
  );
};

interface SubscribeButtonProps {
  api: TApi;
  active: boolean;
}
const UnOrSubscribeButton: React.FC<SubscribeButtonProps> = ({
  api,
  active,
}) => {
  const [isShowSubscribeModal, setIsShowSubscribeModal] = useState(false);
  const [isLoadingManage, setIsLoadingManage] = useState(false);
  const { fetcherManagePlan } = useAPI();
  const { t } = useTranslation();

  const handleClickManage = async () => {
    try {
      setIsLoadingManage(true);
      const resp = await fetcherManagePlan();
      window.location.href = resp.url;
    } catch (error) {
      console.error(error);
      setIsLoadingManage(false);
    }
  };

  const handleClickSubsribe = () => {
    setIsShowSubscribeModal(true);
  };
  return (
    <>
      {active ? (
        <>
          {isLoadingManage ? (
            <span className="animate-spin">
              <LoadingIcon />
            </span>
          ) : (
            <button
              onClick={handleClickManage}
              className="rounded-lg border bg-white px-1 text-sm text-slate-500 transition duration-200 hover:scale-105 hover:border-2 hover:border-black hover:font-bold hover:text-black active:scale-110 "
            >
              {t("Manage")}
            </button>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleClickSubsribe}
            className="rounded-lg border bg-white px-1 text-sm text-slate-500 transition duration-200 hover:scale-105 hover:border-2 hover:border-blue-400 hover:font-bold hover:text-blue-500 active:scale-110 "
          >
            {t("Subscribe")}
          </button>
          <PortalModalCenter
            show={isShowSubscribeModal}
            setIsShow={setIsShowSubscribeModal}
          >
            <SubscribePlansModal
              api={api}
              setIsShow={setIsShowSubscribeModal}
            />
          </PortalModalCenter>
        </>
      )}
    </>
  );
};
export default APIItem;

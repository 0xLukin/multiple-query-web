import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "@/hooks/useAPI";
import { TCollectionData } from "@/types";
import CodeField from "./CodeField";
import useInjectChatbot from "@/hooks/useInjectChatbot";

const WebAPI = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<TCollectionData | undefined>(
    undefined
  );
  const { fetcherQueryCollection } = useAPI();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleInjectChatbot, handleRemoveChatbot, handleSetupCollectionId } =
    useInjectChatbot();

  const handleCheckPermission = useCallback(async () => {
    if (!collectionId) {
      navigate("/");
      return;
    }
    try {
      setIsChecking(true);
      const resp = await fetcherQueryCollection(collectionId);
      setCollection(resp);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  }, [collectionId, navigate, fetcherQueryCollection]);

  useEffect(() => {
    if (isChecking) {
      return;
    }

    const timer = setTimeout(() => {
      handleCheckPermission();
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [isChecking, handleCheckPermission]);

  useEffect(() => {
    if (collectionId) {
      handleSetupCollectionId(collectionId);
      handleInjectChatbot();
    }
    return () => {
      handleRemoveChatbot();
    };
  }, [
    collectionId,
    handleInjectChatbot,
    handleRemoveChatbot,
    handleSetupCollectionId,
  ]);

  return (
    <div className="mb-4 flex items-center gap-6">
      {collection ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold">{collection?.name}</h1>
          <p className="mb-8 text-base">{collection?.description}</p>

          <p className="text-xl font-bold text-slate-500">
            {t(
              "Click the chatbot bubble in the lower right corner to preview the chatbot."
            )}
          </p>

          <CodeField collectionId={collection.id} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-64">
            <Skeleton className="text-3xl" />
          </div>
          <div className="mb-8 w-80">
            <Skeleton className="text-xl" />
          </div>

          <div className="mb-8 w-96">
            <Skeleton className="text-2xl" />
          </div>

          <div className="w-96">
            <Skeleton className="text-xl" />
            <Skeleton className="h-64" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebAPI;

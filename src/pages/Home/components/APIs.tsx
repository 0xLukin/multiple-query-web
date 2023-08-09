import APIItem from "./APIItem";
import { useEffect, useState, useCallback } from "react";
import TitleWithRefreshButton from "@/components/TitleWithRefreshButton";
import Skeleton from "react-loading-skeleton";
import useAPI from "@/hooks/useAPI";
import { UserPlanDetail } from "@/config/constants";

const APIs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initLoaded, setInitLoaded] = useState(false);
  const [planDetials, setPlanDetails] = useState<UserPlanDetail>({
    web: null,
    instagram: null,
    line: null,
  });
  const { fetcherUserPlanDetail } = useAPI();

  const fetchUserPlanDetails = useCallback(async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setInitLoaded(true);
      const resp = await fetcherUserPlanDetail();
      setPlanDetails(resp);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetcherUserPlanDetail, isLoading]);

  useEffect(() => {
    if (!initLoaded) {
      const timer = setTimeout(() => {
        fetchUserPlanDetails();
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [fetchUserPlanDetails, initLoaded]);

  return (
    <div className="mb-8">
      <TitleWithRefreshButton
        title="APIs"
        isLoading={isLoading}
        handleClickRefresh={fetchUserPlanDetails}
      />

      {!isLoading ? (
        <section>
          <APIItem name="web" apiDetails={planDetials.web} />
          <APIItem name="instagram" apiDetails={planDetials.instagram} />
          <APIItem name="line" apiDetails={planDetials.line} />
        </section>
      ) : (
        <section className="flex flex-col gap-2">
          <Skeleton className="h-20 max-w-3xl rounded-full" />
          <Skeleton className="h-20 max-w-3xl" />
          <Skeleton className="h-20 max-w-3xl" />
        </section>
      )}
    </div>
  );
};
export default APIs;

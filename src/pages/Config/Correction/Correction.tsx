import classNames from "classnames";
import { useState } from "react";

import CustomButton from "@/components/buttons/CustomButton";
import { CloseIcon, ConfigIcon, LoadingIcon } from "@/components/icons";
import { TDocumentSplit, TDocumentSplitsResp } from "@/types";

import Word from "./Word";
import ConfigAPIURL from "./ConfigAPIURL";
import fetcher from "@/utils/fetcher";

const Correction = () => {
  const [word, setWord] = useState("");
  const [word_Affiliation, setWord_Affiliation] = useState("");
  const [matchedWords, setMatchedWords] = useState<TDocumentSplit[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // const fetcherQueryWords = async (
  //   word: string
  // ): Promise<TDocumentSplitsResp> => {
  //   const collection_id = localStorage.getItem("collection-id");
  //   const top_k = localStorage.getItem("display-count");

  //   return fetcher.post(
  //     `/query/${collection_id}`,
  //     {
  //       queries: [
  //         {
  //           query: word,
  //           top_k,
  //         },
  //       ],
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTExNjIzOTAyMn0.dxXcGF5oPXlVnR26X_yxcl9KcdCPOEN07Si_oaJoSgE`,
  //       },
  //     }
  //   );
  // };

  const fetcherMultipleQuery = async (
    word_FacilityName: string,
    word_Affiliation: string
  ): Promise<TDocumentSplitsResp> => {
    return fetcher.post(
      `/multiple-query`,
      {
        FacilityName: word_FacilityName,
        Affiliation: word_Affiliation,
      },
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTExNjIzOTAyMn0.dxXcGF5oPXlVnR26X_yxcl9KcdCPOEN07Si_oaJoSgE`,
        },
      }
    );
  };

  const fetchQueryWords = async (
    word_FacilityName: string,
    word_Affiliation: string
  ) => {
    if (word_FacilityName.trim() === "") {
      return;
    }
    if (word_Affiliation.trim() === "") {
      return;
    }

    try {
      setIsLoading(true);
      // const resp = await fetcherQueryWords(word);
      const resp = await fetcherMultipleQuery(
        word_FacilityName,
        word_Affiliation
      );
      console.log(resp);
      setMatchedWords(resp.results[0].results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !isLoading &&
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      fetchQueryWords(word, word_Affiliation);
    }
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col p-4 sm:p-8">
      <div>
        <section className="mb-4">
          <section className="m-4 mb-4 flex justify-center">
            <button title="config" onClick={() => setShowConfig(!showConfig)}>
              {showConfig ? (
                <CloseIcon className="text-slate-500" />
              ) : (
                <ConfigIcon />
              )}
            </button>
          </section>
          {showConfig && <ConfigAPIURL />}
        </section>
        <section className="mb-6 flex w-full flex-col items-start rounded-lg border bg-white p-2 transition hover:shadow-md">
          <label className="mb-1 font-bold" htmlFor="word">
            FacilityName
          </label>

          <input
            className={classNames(
              "mb-2 w-full rounded border bg-gray p-1 outline-2 focus-within:bg-white focus-within:outline focus-within:outline-blue-500"
            )}
            placeholder="Enter a word here"
            onChange={(event) => {
              setWord(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            id="word"
            value={word}
          />

          <label className="mb-1 font-bold" htmlFor="word">
            Affiliation
          </label>

          <input
            className={classNames(
              "mb-2 w-full rounded border bg-gray p-1 outline-2 focus-within:bg-white focus-within:outline focus-within:outline-blue-500"
            )}
            placeholder="Enter a word here"
            onChange={(event) => {
              setWord_Affiliation(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            id="word_Affiliation"
            value={word_Affiliation}
          />

          {!isLoading ? (
            <>
              <CustomButton
                name="Query"
                classNames="text-white"
                handleClick={() => fetchQueryWords(word, word_Affiliation)}
              />
            </>
          ) : (
            <div className="animate-spin">
              <LoadingIcon />
            </div>
          )}
        </section>

        {matchedWords.length !== 0 && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Matched words</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {matchedWords.map((matchedWord) => {
                return <Word matchedWord={matchedWord} key={matchedWord.id} />;
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
export default Correction;

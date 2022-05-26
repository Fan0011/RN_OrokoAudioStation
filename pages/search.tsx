import fuzzysort from "fuzzysort";
import { InferGetStaticPropsType } from "next";
import { ChangeEvent, useMemo, useState } from "react";
import Meta from "../components/Meta";
import { getSearchPage } from "../lib/contentful/pages/search";
import {
  ArticleInterface,
  ArtistInterface,
  ShowInterface,
} from "../types/shared";
import Card from "../components/Card";
import Show from "../components/Show";

interface SearchShowInterface extends ShowInterface {
  type: "SHOW";
}

interface SearchArtistInterface extends ArtistInterface {
  type: "ARTIST";
  title: string;
}

interface SearchArticleInterface extends ArticleInterface {
  type: "ARTICLE";
}

export async function getStaticProps({ preview = false }) {
  return {
    props: {
      preview,
      data: (await getSearchPage()) as Array<
        SearchShowInterface | SearchArtistInterface | SearchArticleInterface
      >,
    },
    revalidate: 60 * 60,
  };
}

export default function SearchPage({
  preview,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState("");
  const searchOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value?.toLowerCase());

  const result = fuzzysort.go(search ? search.trim() : undefined, data, {
    keys: ["title", "artist"],
    allowTypo: true,
    threshold: -999,
    limit: 20,
  });

  const showResults = useMemo(() => {
    if (search) {
      return result.filter((el) => el.obj.type === "SHOW").map((el) => el.obj);
    }

    return data.filter((el) => el.type === "SHOW").slice(0, 5);
  }, [result, search, data]);

  const articleResults = useMemo(() => {
    if (search) {
      return result
        .filter((el) => el.obj.type === "ARTICLE")
        .map((el) => el.obj);
    }

    return data.filter((el) => el.type === "ARTICLE").slice(0, 5);
  }, [result, search, data]);

  const artistResults = useMemo(() => {
    if (search) {
      return result
        .filter((el) => el.obj.type === "ARTIST")
        .map((el) => el.obj);
    }

    return data.filter((el) => el.type === "ARTIST").slice(0, 5);
  }, [result, search, data]);

  const hasNoResults =
    showResults.length === 0 &&
    artistResults.length === 0 &&
    articleResults.length === 0;

  return (
    <>
      <Meta title="Search" />

      <section className="bg-offBlack border-b-2 border-black">
        <div className="p-4 sm:p-8 xl:p-12 text-center">
          <input
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            className="max-w-full bg-offBlack text-white placeholder-white border-r-0 border-t-0 border-b-0 border-l-2 text-4xl xl:text-5xl font-serif border-white focus:ring-white focus:ring-2 focus:border-offBlack"
            id="search"
            name="search"
            onChange={searchOnChange}
            placeholder="Search Oroko"
            type="search"
            value={search}
          />
        </div>
      </section>

      {hasNoResults && (
        <section className="bg-orokoBlue min-h-[50vh]">
          <div className="p-4 sm:p-8">
            <div className="pt-10">
              <p>
                No results for{" "}
                <span className="font-medium">{`"${search}"`}</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {showResults.length > 0 && (
        <section className="bg-orokoBlue border-b-2 border-black p-4 py-12">
          <div className="flex justify-center items-end mb-8">
            <h2 className="font-serif text-4xl md:text-5xl xl:text-6xl mr-2 inline">
              Shows
            </h2>
            {search ? <span>({showResults.length})</span> : null}
          </div>

          <div className="h-5" />

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 sm:gap-8">
            {showResults?.map((show: any) => (
              <li key={show.slug} className="border-2 border-black bg-white">
                <Card
                  imageUrl={show.coverImage.url}
                  title={show.name}
                  link={`/radio/${show.slug}`}
                >
                  <Show show={show} cityColor="black" />
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {articleResults.length > 0 && (
        <section>
          <div className="p-4 sm:p-8">
            <h2>News</h2>

            <div className="h-5" />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 sm:gap-8">
              {articleResults?.map((article) => (
                <li key={article.slug}>
                  <p>{article.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {artistResults.length > 0 && (
        <section>
          <div className="p-4 sm:p-8">
            <h2>Artists</h2>

            <div className="h-5" />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 sm:gap-8">
              {artistResults?.map((artist) => {
                const _artist = {
                  ...artist,
                  name: artist.title,
                };

                return (
                  <li key={artist.slug}>
                    <p>{_artist.name}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

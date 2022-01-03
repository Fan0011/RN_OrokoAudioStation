import Link from "next/link";
import { getRadioPageSingle } from "../../lib/contentful/pages/radio";
import { getShowPathsToPreRender } from "../../lib/contentful/paths";
import { playerWidget, showKey } from "../../lib/mixcloud";
import { ShowInterface } from "../../types/shared";
import { getMixcloudKey } from "../../util";
import SinglePage from "../../views/SinglePage";
import dayjs from "dayjs";
import Tag from "../../components/Tag";
import { renderRichTextWithImages } from "../../lib/rich-text";
import TitleBox from "../../components/TitleBox";
import PlayButton from "../../components/ui/PlayButton";
import ShareButton from "../../components/ui/ShareButton";

type Props = {
  show: ShowInterface;
  relatedShows?: ShowInterface[];
  preview: boolean;
};

export default function Show({ show, relatedShows, preview }: Props) {
  const {
    coverImage,
    title,
    slug,
    date,
    content,
    artistsCollection,
    genresCollection,
    mixcloudLink,
  } = show;

  return (
    <SinglePage
      coverImage={coverImage.url}
      coverImageAlt={title}
      withBackButton
    >
      <TitleBox>
        {mixcloudLink && (
          <div className="grid grid-cols-2 auto-rows-fr md:grid-cols-1 md:absolute right-0 top-0 h-full border-b-2 md:border-b-0 md:border-l-2 border-black text-black">
            <div className="border-black md:order-2 bg-orokoYellow border-r-2 md:border-r-0 flex justify-center">
              <div className="self-center">
                <ShareButton details={{ title, slug }} />
              </div>
            </div>
            <div className="border-black md:order-1 bg-orokoBlue md:border-b-2 flex justify-center align-middle xl:px-16">
              <PlayButton mixcloudLink={mixcloudLink} />
            </div>
          </div>
        )}
        <div className="container max-w-4xl mx-auto">
          {date && (
            <p className="pt-6 md:pt-0 mb-4 lg:mb-8 font-sans font-semibold tracking-wide text-xl lg:text-2xl">
              {dayjs(date).format("ddd DD MMMM YYYY @ HH") + "H"}
            </p>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-7xl mb-0 font-heading md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            {title}
          </h1>
          <h2 className="font-serif text-4xl lg:text-6xl mb-6 lg:mb-10">
            {" "}
            With{" "}
            {artistsCollection.items &&
              artistsCollection.items.map(({ name, slug }, idx) => (
                <span key={slug}>
                  <Link href={`/artists/${slug}`} passHref>
                    <span className="border-b-2 border-black cursor-pointer">
                      {name}
                    </span>
                  </Link>
                  {idx !== artistsCollection.items.length - 1 && ", "}
                </span>
              ))}
          </h2>
          <div className="flex gap-1">
            <Tag text={artistsCollection.items[0].city.name} color="black" />
            {genresCollection &&
              genresCollection.items.map(({ name }, idx) => (
                <Tag text={name} color="white" key={idx} />
              ))}
          </div>
        </div>
      </TitleBox>
      <section className="container max-w-4xl mx-auto rich-text py-10 mb-24">
        {renderRichTextWithImages(content)}
      </section>
    </SinglePage>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getRadioPageSingle(params.slug, preview);

  return {
    props: { preview, ...data },
    revalidate: 60 * 60,
  };
}

export async function getStaticPaths() {
  const paths = await getShowPathsToPreRender();

  return { paths, fallback: "blocking" };
}

import { bricolage_grotesque } from "@/lib/fonts";
import { FeedCard } from "./ui/FeedCard";

const todayFeeds = [
  {
    quote: "Team brainstormed new feature ideas for next sprint.",
    author: "Niyaf",
    likes: 14,
    comments: 4,
    categories: "Product",
  },
  {
    quote: "UI review for dashboard layout completed successfully.",
    author: "Aisha",
    likes: 9,
    comments: 2,
    categories: "Design",
  },
  {
    quote: "Discussed integration of cloud backup with MongoDB.",
    author: "Ravi",
    likes: 20,
    comments: 5,
    categories: "Engineering",
  },
  {
    quote: "Planned beta testing for new booking feature.",
    author: "Sara",
    likes: 11,
    comments: 3,
    categories: "Testing",
  },
  {
    quote: "Reviewed feedback from FOSS Hack mentors.",
    author: "Irfan",
    likes: 8,
    comments: 1,
    categories: "Community",
  },
];

const yesterdayFeeds = [
    {
    quote: "UI review for dashboard layout completed successfully.",
    author: "Aisha",
    likes: 9,
    comments: 2,
    categories: "Design",
  },
  {
    quote: "Discussed integration of cloud backup with MongoDB.",
    author: "Ravi",
    likes: 20,
    comments: 5,
    categories: "Engineering",
  },
  {
    quote: "Planned beta testing for new booking feature.",
    author: "Sara",
    likes: 11,
    comments: 3,
    categories: "Testing",
  },
  {
    quote: "Setup CI/CD pipeline for faster deployment.",
    author: "Devraj",
    likes: 15,
    comments: 2,
    categories: "DevOps",
  },
  {
    quote: "Conducted user research for UI improvements.",
    author: "Meena",
    likes: 6,
    comments: 1,
    categories: "Research",
  },
];

function FeedComponent() {
  return (
    <div className="px-20 pt-20 pb-10 bg-black text-white">
      {/* Today’s Highlights */}
      <section>
        <h2
          className={`${bricolage_grotesque} text-3xl font-semibold text-white`}
        >
          Today’s Highlights
        </h2>

        <div className="flex flex-wrap gap-6 justify-start mt-8">
          {todayFeeds.map((feed, index) => (
            <div key={index} className="w-[400px]">
              <FeedCard {...feed} />
            </div>
          ))}
        </div>
      </section>

      {/* Yesterday’s Highlights */}
      <section className="mt-16">
        <h2
          className={`${bricolage_grotesque} text-3xl font-semibold text-white`}
        >
          Yesterday’s Highlights
        </h2>

        <div className="flex flex-wrap gap-6 justify-start mt-8">
          {yesterdayFeeds.map((feed, index) => (
            <div key={index} className="w-[400px]">
              <FeedCard {...feed} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FeedComponent;

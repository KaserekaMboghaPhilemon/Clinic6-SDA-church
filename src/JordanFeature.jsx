import React from "react";
import { Link } from "react-router-dom";
import jordanVideo from "./assets/first-storm.mp4";

const jordanPoolImage = "https://i.pinimg.com/736x/55/e5/96/55e5968bf992a715ac4a1c5b0e74bff7.jpg";

const JordanFeature = () => {
  return (
    <section className="bg-slate-900 text-white py-16 px-4 md:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-5">
          <figure className="rounded-xl overflow-hidden shadow-2xl">
            <img
              src={jordanPoolImage}
              alt="Dream baptism pool for Jordan construction ministry"
              className="w-full h-full object-cover"
            />
          </figure>

          <figure className="rounded-xl overflow-hidden shadow-2xl bg-black/20">
            <video
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              aria-label="Community members preparing and filling a lined baptism pit"
            >
              <source src={jordanVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </figure>
        </div>

        <div className="lg:pt-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">The Jordan Initiative</h2>
          <p className="text-slate-300 leading-relaxed text-base md:text-lg">
            In Kakuma, Kenya, faith is not an abstract idea. It is lived, carried, and built by
            hand. Our community worships in a semi-arid region where there are no natural rivers
            to support baptism, yet families still gather with reverence to mark this sacred step
            of commitment. When the time comes, members of the church and neighborhood work side
            by side to dig a pit in hard ground, line it carefully, and then transport water
            manually until there is enough for the ceremony. What others might see as an obstacle,
            we have answered with unity, endurance, and devotion.
            <br />
            <br />
            This effort reflects extraordinary resilience, but it also reveals a clear and urgent
            need. Temporary pits are labor-intensive, vulnerable to contamination, and difficult to
            maintain in extreme weather. Each event requires significant physical effort from people
            already managing limited resources. The Jordan Initiative is our response: a fundable,
            practical plan to develop sustainable and dignified water storage infrastructure that can
            safely support baptisms and other community needs. With partner support, we can move
            from repeated emergency preparation to a reliable system designed for health, safety, and
            continuity. Investing in this initiative means protecting a core expression of faith,
            honoring local leadership, and strengthening a community that has already proven what is
            possible when hope is matched with action.
          </p>

          <Link
            to="/give"
            className="cta-donate-pop inline-flex mt-7 items-center justify-center rounded-lg bg-amber-400 px-6 py-3 text-slate-900 font-semibold shadow-lg transition-all hover:bg-amber-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Support Our Infrastructure
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JordanFeature;

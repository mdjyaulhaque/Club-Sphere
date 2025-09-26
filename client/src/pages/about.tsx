import { Users, Sparkles, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-primary">About Us</h1>
          <p className="mb-4 text-lg">
            At <span className="font-semibold">ClubSphere</span>, we believe
            every student deserves the chance to find their community, share
            their passions, and grow as a leader. Clubs aren’t just activities —
            they’re where friendships are made, skills are developed, and
            memories last a lifetime.
          </p>
          <p className="text-muted-foreground">
            Whether you’re looking to discover your next passion or take your
            club to the next level, ClubSphere is here to help you connect,
            create, and thrive.
          </p>
        </div>

        {/* Illustration / Image placeholder */}
        <div className="flex justify-center">
          <img
            src="https://images.pexels.com/photos/5212697/pexels-photo-5212697.jpeg/"
            alt="Students connecting"
            className="w-full max-w-sm rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition">
          <Users className="mx-auto h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Discover Clubs</h3>
          <p className="text-muted-foreground">
            Explore clubs across different interests and find the perfect fit
            for you.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition">
          <Sparkles className="mx-auto h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Stay Engaged</h3>
          <p className="text-muted-foreground">
            Keep track of events, announcements, and opportunities to
            participate.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition">
          <HeartHandshake className="mx-auto h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Empower Leaders</h3>
          <p className="text-muted-foreground">
            Tools that make it simple for leaders to organize and grow their
            communities.
          </p>
        </div>
      </div>
    </div>
  );
}

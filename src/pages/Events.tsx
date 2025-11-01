import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const Events = () => {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: "Annual Temple Festival",
      date: "March 15, 2025",
      time: "6:00 AM - 9:00 PM",
      location: "Main Temple Premises",
      description: "Join us for our grand annual festival with special pujas, cultural programs, and prasad distribution.",
      image: "https://images.unsplash.com/photo-1544980919-e17526d4ed0a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Weekly Bhajan Evening",
      date: "Every Saturday",
      time: "7:00 PM - 9:00 PM",
      location: "Temple Hall",
      description: "Devotional singing and spiritual discourse. All are welcome to participate.",
      image: "https://images.unsplash.com/photo-1604608672516-f1b9b1362ca3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Spiritual Discourse",
      date: "Every Sunday",
      time: "10:00 AM - 12:00 PM",
      location: "Main Hall",
      description: "Weekly spiritual discourse by learned scholars on ancient scriptures and modern life.",
      image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Temple Events</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Events;

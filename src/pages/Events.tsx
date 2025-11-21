import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, Save, X } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  status: string;
}

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState("");

  const fetchEventsAndCheckAdmin = useCallback(async () => {
    try {
      // Check if user is admin
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);
        
        setIsAdmin(roles?.some((r) => r.role === "admin") || false);
      }

      // Fetch events
      const { data, error } = await supabase
        .from("temple_events")
        .select("*")
        .eq("status", "published")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEventsAndCheckAdmin();
  }, [fetchEventsAndCheckAdmin]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setEventTime("");
    setLocation("");
    setImageUrl("");
    setIsRecurring(false);
    setRecurrencePattern("");
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        title,
        description,
        event_date: eventDate,
        event_time: eventTime,
        location,
        image_url: imageUrl || null,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : null,
        status: "published",
      };

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from("temple_events")
          .update(eventData)
          .eq("id", editingEvent.id);

        if (error) throw error;

        toast({
          title: "Event Updated",
          description: "Event has been updated successfully",
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from("temple_events")
          .insert(eventData);

        if (error) throw error;

        toast({
          title: "Event Created",
          description: "New event has been created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchEventsAndCheckAdmin();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setEventDate(event.event_date);
    setEventTime(event.event_time);
    setLocation(event.location);
    setImageUrl(event.image_url || "");
    setIsRecurring(event.is_recurring);
    setRecurrencePattern(event.recurrence_pattern || "");
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingEventId) return;

    try {
      const { error } = await supabase
        .from("temple_events")
        .delete()
        .eq("id", deletingEventId);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "Event has been deleted successfully",
      });

      setDeleteDialogOpen(false);
      setDeletingEventId(null);
      fetchEventsAndCheckAdmin();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20 md:pb-0">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Temple Events</h1>
          <div className="flex gap-2">
            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                    <DialogDescription>
                      {editingEvent ? "Update the event details below" : "Fill in the details to create a new temple event"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g., Annual Temple Festival"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        placeholder="Describe the event..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="eventDate">Date *</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventTime">Time *</Label>
                        <Input
                          id="eventTime"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          required
                          placeholder="e.g., 6:00 AM - 9:00 PM"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        placeholder="e.g., Main Temple Premises"
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Image URL (optional)</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isRecurring" className="cursor-pointer">
                        Recurring Event
                      </Label>
                    </div>
                    {isRecurring && (
                      <div>
                        <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                        <Input
                          id="recurrencePattern"
                          value={recurrencePattern}
                          onChange={(e) => setRecurrencePattern(e.target.value)}
                          placeholder="e.g., Every Saturday, Weekly, Monthly"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDialogOpen(false);
                          resetForm();
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {editingEvent ? "Update" : "Create"} Event
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              Back
            </Button>
          </div>
        </div>

        {events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No events scheduled at the moment.</p>
            {isAdmin && (
              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Event" to create your first event.
              </p>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(event)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setDeletingEventId(event.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="flex flex-col gap-2 mt-2">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event.is_recurring && event.recurrence_pattern
                        ? event.recurrence_pattern
                        : formatDate(event.event_date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.event_time}
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
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingEventId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileNav />
    </div>
  );
};

export default Events;

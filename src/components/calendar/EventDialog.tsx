import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addHours } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: "work" | "personal" | "meeting" | "reminder" | "other";
}

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  defaultDate?: Partial<{start: Date, end: Date}>;
  onSave: (event: Partial<Event>) => void;
  onDelete?: () => void;
}

export default function EventDialog({
  isOpen,
  onClose,
  event,
  defaultDate,
  onSave,
  onDelete,
}: EventDialogProps) {
  const isNewEvent = !event?.id;
  
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [type, setType] = useState<string>(event?.type || "other");
  const [startDate, setStartDate] = useState<Date | undefined>(event?.start || defaultDate?.start || new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(event?.end || defaultDate?.end || addHours(new Date(), 1));
  const [location, setLocation] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);

  // Update form when event or defaultDate changes
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setType(event.type);
      setStartDate(event.start);
      setEndDate(event.end);
    } else if (defaultDate) {
      setStartDate(defaultDate.start);
      setEndDate(defaultDate.end || (defaultDate.start ? addHours(defaultDate.start, 1) : undefined));
    }
  }, [event, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startDate || !endDate) {
      return;
    }
    
    onSave({
      ...event,
      title,
      description,
      type: type as "work" | "personal" | "meeting" | "reminder" | "other",
      start: startDate,
      end: endDate,
    });
    
    // Reset form fields
    if (isNewEvent) {
      setTitle("");
      setDescription("");
      setType("other");
      setStartDate(new Date());
      setEndDate(new Date());
    }
  };

  const eventTypes = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "meeting", label: "Meeting" },
    { value: "reminder", label: "Reminder" },
    { value: "other", label: "Other" }
  ];
  
  const getEventColor = () => {
    switch (type) {
      case "work": return "var(--event-work)";
      case "personal": return "var(--event-personal)";
      case "meeting": return "var(--event-meeting)";
      case "reminder": return "var(--event-reminder)";
      default: return "var(--event-other)";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl overflow-hidden p-0">
        <div className="p-6" style={{ backgroundColor: `${getEventColor()}20` }}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium">{isNewEvent ? "Create Event" : "Edit Event"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 py-6">
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  required
                  className="border-none bg-transparent text-lg font-semibold focus-visible:ring-0 px-0 placeholder:text-foreground/50"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full flex items-center justify-center" style={{ backgroundColor: getEventColor() }}>
                  <CalendarIcon className="text-white size-5" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="start-date" className="text-sm text-muted-foreground">Start</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          {startDate ? format(startDate, "MMM d, yyyy h:mm a") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 flex flex-col">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(new Date(
                            date.setHours(
                              startDate ? startDate.getHours() : 9,
                              startDate ? startDate.getMinutes() : 0,
                              0
                            )
                          ))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                        <div className="border-t p-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="start-hour" className="text-xs text-muted-foreground mb-1 block">Hour</Label>
                              <Select 
                                value={startDate ? startDate.getHours().toString() : "9"}
                                onValueChange={(value) => {
                                  if (startDate) {
                                    const newDate = new Date(startDate);
                                    newDate.setHours(parseInt(value));
                                    setStartDate(newDate);
                                  }
                                }}
                              >
                                <SelectTrigger id="start-hour" className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 24 }).map((_, hour) => (
                                    <SelectItem key={hour} value={hour.toString()}>
                                      {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="start-minute" className="text-xs text-muted-foreground mb-1 block">Minute</Label>
                              <Select 
                                value={startDate ? (startDate.getMinutes() === 0 ? "0" : startDate.getMinutes() === 30 ? "30" : startDate.getMinutes().toString()) : "0"}
                                onValueChange={(value) => {
                                  if (startDate) {
                                    const newDate = new Date(startDate);
                                    newDate.setMinutes(parseInt(value));
                                    setStartDate(newDate);
                                  }
                                }}
                              >
                                <SelectTrigger id="start-minute" className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">00</SelectItem>
                                  <SelectItem value="15">15</SelectItem>
                                  <SelectItem value="30">30</SelectItem>
                                  <SelectItem value="45">45</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="end-date" className="text-sm text-muted-foreground">End</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          {endDate ? format(endDate, "MMM d, yyyy h:mm a") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 flex flex-col">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(new Date(
                            date.setHours(
                              endDate ? endDate.getHours() : 10,
                              endDate ? endDate.getMinutes() : 0,
                              0
                            )
                          ))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                        <div className="border-t p-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="end-hour" className="text-xs text-muted-foreground mb-1 block">Hour</Label>
                              <Select 
                                value={endDate ? endDate.getHours().toString() : "10"}
                                onValueChange={(value) => {
                                  if (endDate) {
                                    const newDate = new Date(endDate);
                                    newDate.setHours(parseInt(value));
                                    setEndDate(newDate);
                                  }
                                }}
                              >
                                <SelectTrigger id="end-hour" className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 24 }).map((_, hour) => (
                                    <SelectItem key={hour} value={hour.toString()}>
                                      {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="end-minute" className="text-xs text-muted-foreground mb-1 block">Minute</Label>
                              <Select 
                                value={endDate ? (endDate.getMinutes() === 0 ? "0" : endDate.getMinutes() === 30 ? "30" : endDate.getMinutes().toString()) : "0"}
                                onValueChange={(value) => {
                                  if (endDate) {
                                    const newDate = new Date(endDate);
                                    newDate.setMinutes(parseInt(value));
                                    setEndDate(newDate);
                                  }
                                }}
                              >
                                <SelectTrigger id="end-minute" className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">00</SelectItem>
                                  <SelectItem value="15">15</SelectItem>
                                  <SelectItem value="30">30</SelectItem>
                                  <SelectItem value="45">45</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full flex items-center justify-center bg-muted">
                  <MapPin className="size-5 text-muted-foreground" />
                </div>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="flex-1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm text-muted-foreground">Event Category</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full" style={{ backgroundColor: `var(--event-${type.value})` }}></div>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm text-muted-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between px-0">
              <div>
                {!isNewEvent && onDelete && (
                  <Button type="button" variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="size-4 mr-1" /> Delete
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">{isNewEvent ? "Create" : "Update"}</Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Filter, Tag as TagIcon, SortAsc, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TaskFilterProps {
  priorityFilter: string;
  dateFilter: Date | undefined;
  tagFilter: string[];
  sortOption: string;
  showCompleted: boolean;
  onChangePriority: (priority: string) => void;
  onChangeDate: (date: Date | undefined) => void;
  onChangeTagFilter: (tags: string[]) => void;
  onChangeSortOption: (sortOption: string) => void;
  onChangeShowCompleted: (show: boolean) => void;
  onClearFilters: () => void;
  availableTags: string[];
}

export default function TaskFilter({ 
  priorityFilter, 
  dateFilter,
  tagFilter,
  sortOption,
  showCompleted,
  onChangePriority,
  onChangeDate,
  onChangeTagFilter,
  onChangeSortOption,
  onChangeShowCompleted,
  onClearFilters,
  availableTags
}: TaskFilterProps) {
  const [tagsMenuOpen, setTagsMenuOpen] = useState(false);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  
  // Helper to toggle a tag in the filter
  const toggleTag = (tag: string) => {
    if (tagFilter.includes(tag)) {
      onChangeTagFilter(tagFilter.filter(t => t !== tag));
    } else {
      onChangeTagFilter([...tagFilter, tag]);
    }
  };
  
  // Calculate if any filters are active
  const hasActiveFilters = priorityFilter !== "all" || 
                          dateFilter !== undefined || 
                          tagFilter.length > 0 || 
                          !showCompleted;
  
  return (
    <>
      {/* Mobile filter button */}
      {isMobile && (
        <div className="w-full mb-3">
          <Popover open={filtersMenuOpen} onOpenChange={setFiltersMenuOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between h-10"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters & Sort</span>
                </div>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="center">
              <div className="space-y-3">
                <h3 className="font-medium">Filter Tasks</h3>
                <div className="space-y-3">
                  {/* Priority filter */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Priority</label>
                    <Select 
                      value={priorityFilter} 
                      onValueChange={onChangePriority}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Date filter */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Due Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start h-9", 
                            dateFilter && "bg-primary/10"
                          )}
                        >
                          <CalendarDays className="h-4 w-4 mr-2" />
                          {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Any date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFilter}
                          onSelect={onChangeDate}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Tags filter */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Tags</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start h-9", 
                            tagFilter.length > 0 && "bg-primary/10"
                          )}
                        >
                          <TagIcon className="h-4 w-4 mr-2" />
                          {tagFilter.length > 0 ? `Selected (${tagFilter.length})` : "Any tag"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-2" align="start">
                        {availableTags.length > 0 ? (
                          <div className="space-y-2">
                            <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                              {availableTags.map(tag => (
                                <div key={tag} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`mobile-tag-${tag}`} 
                                    checked={tagFilter.includes(tag)}
                                    onCheckedChange={() => toggleTag(tag)}
                                  />
                                  <label 
                                    htmlFor={`mobile-tag-${tag}`}
                                    className="text-sm flex-1 truncate cursor-pointer"
                                  >
                                    {tag}
                                  </label>
                                </div>
                              ))}
                            </div>
                            
                            {tagFilter.length > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full h-8"
                                onClick={() => onChangeTagFilter([])}
                              >
                                Clear tags
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground py-1">No tags available</div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Sort options */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Sort by</label>
                    <Select 
                      value={sortOption} 
                      onValueChange={onChangeSortOption}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueDate">Due date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="dateCreated">Date created</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Show completed checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox 
                      id="mobile-show-completed" 
                      checked={showCompleted}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          onChangeShowCompleted(checked);
                        }
                      }}
                    />
                    <label 
                      htmlFor="mobile-show-completed"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Show completed tasks
                    </label>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          onClearFilters();
                          setFiltersMenuOpen(false);
                        }}
                      >
                        Clear all
                      </Button>
                    )}
                    <Button 
                      className="flex-1"
                      onClick={() => setFiltersMenuOpen(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* Desktop filters */}
      <div className={cn(
        "flex flex-wrap items-center gap-2",
        isMobile && "hidden"
      )}>
      {/* Priority filter */}
      <Select 
        value={priorityFilter} 
        onValueChange={onChangePriority}
      >
        <SelectTrigger className="h-9 gap-1 w-[120px] sm:w-[140px]">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Date filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "h-9 gap-1", 
              dateFilter && "bg-primary/10"
            )}
          >
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFilter}
            onSelect={onChangeDate}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
      
      {/* Tags filter */}
      <Popover open={tagsMenuOpen} onOpenChange={setTagsMenuOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "h-9 gap-1", 
              tagFilter.length > 0 && "bg-primary/10"
            )}
          >
            <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
            {tagFilter.length > 0 ? `Tags (${tagFilter.length})` : "Tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          {availableTags.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Filter by tags</div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                {availableTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={tagFilter.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm flex-1 truncate cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
              
              {tagFilter.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-8 mt-1"
                  onClick={() => onChangeTagFilter([])}
                >
                  Clear tags
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-1">No tags available</div>
          )}
        </PopoverContent>
      </Popover>
      
      {/* Sort options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px]">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className={cn(sortOption === "dueDate" && "bg-muted")} 
              onClick={() => onChangeSortOption("dueDate")}
            >
              Due date
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={cn(sortOption === "priority" && "bg-muted")} 
              onClick={() => onChangeSortOption("priority")}
            >
              Priority
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={cn(sortOption === "title" && "bg-muted")} 
              onClick={() => onChangeSortOption("title")}
            >
              Title
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={cn(sortOption === "dateCreated" && "bg-muted")} 
              onClick={() => onChangeSortOption("dateCreated")}
            >
              Date created
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Show completed checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-completed" 
          checked={showCompleted}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              onChangeShowCompleted(checked);
            }
          }}
        />
        <label 
          htmlFor="show-completed"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Show completed
        </label>
      </div>
      
      {/* Clear filters button - only show if filters are applied */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 px-2"
          onClick={onClearFilters}
        >
          Clear all
        </Button>
      )}
      </div>
    </>
  );
}

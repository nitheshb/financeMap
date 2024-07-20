"use client";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useGetEvents } from "@/features/events/api/use-get-events";
import { useNewEvent } from "@/features/events/hooks/use-new-event";
import { useBulkDeleteEvents } from "@/features/events/api/use-bulk-delete-events";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { columns } from "./columns";
import { NewEventSheet } from "@/features/events/components/new-event-sheet"; 

const EventsPage = () => {
  const { isOpen, onOpen, onClose } = useNewEvent(); 
  const deleteEvents = useBulkDeleteEvents();
  const eventsQuery = useGetEvents();
  const events = eventsQuery.data || [];

  const isDisabled =
    eventsQuery.isLoading ||
    deleteEvents.isPending;

  if (eventsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Events page
          </CardTitle>
          <Button onClick={onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="title"
            columns={columns}
            data={events}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteEvents.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>

      {/* Render NewEventSheet component with props */}
      <NewEventSheet isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default EventsPage;

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewWorksheet } from "@/features/worksheets/hooks/use-new-worksheet";
import { useGetWorksheets } from "@/features/worksheets/api/use-get-worksheets";
import { NewWorksheetSheet } from "@/features/worksheets/components/new-work-sheet";
import { Row } from "@tanstack/react-table";
import { UploadButton } from "./upload-button";
import { Loader2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";

const WorksheetPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [worksheets, setWorksheets] = useState([]); 

  const { onOpen } = useNewWorksheet();
  const worksheetsQuery = useGetWorksheets();

  useEffect(() => {
  
    if (!worksheetsQuery.isLoading && worksheetsQuery.data) {
      setIsLoading(false);
      setWorksheets(worksheetsQuery.data);
    }
  }, [worksheetsQuery.isLoading, worksheetsQuery.data]);

  function handleUpload(results: any): void {
    throw new Error("Function not implemented.");
  }

  if (isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Worksheet</CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              onClick={onOpen}
              size="sm"
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={handleUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="title"
            data={worksheets}
            columns={columns}
            onDelete={(rows: Row<never>[]): void => {
              throw new Error("Function not implemented.");
            }}
          />
        </CardContent>
      </Card>
      <NewWorksheetSheet />
    </div>
  );
};

export default WorksheetPage;

"use client";

import { Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadButton } from "./upload-button";
import { Row } from "@tanstack/react-table";
import { useNewWorksheet } from "@/features/worksheets/hooks/use-new-worksheet";
import { NewWorksheetSheet } from "@/features/worksheets/components/new-work-sheet";




const WorksheetPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [worksheets, setWorksheets] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { onOpen } = useNewWorksheet(); 

  useEffect(() => {
    // Simulate a loading state
    setTimeout(() => {
      setIsLoading(false);
      setWorksheets([
        /* Sample data */
      ]);
    }, 2000);
  }, []);

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
            <UploadButton onUpload={() => {}} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="title"
            data={worksheets}
            disabled={isDisabled}
            columns={[]}
            onDelete={function (rows: Row<never>[]): void {
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

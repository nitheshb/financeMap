"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetAccounts, useGetPrideStalls } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";

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
import { fetchPrideStalls, steamStallsList } from "@/db/dbQueryFirebase";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const deleteAccounts = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const stallsQuery = useGetPrideStalls();
  const accounts = stallsQuery.data || [];
  const [leadsFetchedData, setLeadsFetchedData] = useState([])
  useEffect(() => {
    getLeadsDataFun()
  }, [])
  
  const getLeadsDataFun = async () => {
    console.log('fetched details are')

    const unsubscribe = steamStallsList(
      'pride',
      (querySnapshot:any) => {
        const usersListA = querySnapshot.docs.map((docSnapshot:any) =>
          docSnapshot.data()
        )
        console.log('fetched details are', usersListA)
        setLeadsFetchedData(usersListA)
      },
      () => setLeadsFetchedData([])
    )
  
    return unsubscribe
    
  }
  const isDisabled =
    stallsQuery.isLoading ||
    deleteAccounts.isPending;

  if (stallsQuery.isLoading) {
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
          Stalls List ({leadsFetchedData?.length})
          </CardTitle>
          <Button onClick={newAccount.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns} 
            data={leadsFetchedData}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};
 
export default AccountsPage;

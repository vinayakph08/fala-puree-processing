"use client";
import { useState, useCallback } from "react";
import { useFarmers } from "@/app/(protected)/farmers/hooks/use-farmers";
import { DataTable } from "../data-table";
import { columns, IFarmers } from "../data-table/columns";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

function FarmersListClientComponent() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading, error, updatePagination, updateSearch } =
    useFarmers();

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateSearch(value);
    }, 500),
    [updateSearch]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching farmers</div>;

  return (
    <div>
      <div className='hidden md:flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Farmers</h1>
          <p className='text-muted-foreground'>
            List of all registered farmers
          </p>
        </div>
      </div>
      <div className='mt-4'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter by farm ID/name/location...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='max-w-sm'
          />
        </div>
        <DataTable<IFarmers, any>
          columns={columns}
          data={data?.data || []}
          pagination={data.pagination}
          updatePagination={updatePagination}
        />
      </div>
    </div>
  );
}

export default FarmersListClientComponent;

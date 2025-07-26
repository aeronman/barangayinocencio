import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

function TableComponent({
  columns = [],
  data = [],
  title = "Items",
  actions = [],
  loading = false,
  topComponent = <></>,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      ...(actions?.length > 0
        ? [
            {
              header: "Actions",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex gap-2 justify-content-center">
                  {actions(row.original.id).map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      onClick={action.onClick}
                      className={action.className}
                    >
                      <i className={action.icon}></i> {action.label}
                    </a>
                  ))}
                </div>
              ),
            },
          ]
        : []),
    ],
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (typeof value !== "string") return false;
    
      const regex = new RegExp(`\\b${filterValue.trim()}\\b`, 'i');
      return regex.test(value);
    },
    
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="border shadow-lg p-5 rounded-4 mb-5 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {topComponent}
        <h4 className="fw-bold mb-0 text-dark">{`List of ${title}`}</h4>
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-semibold">
            Fetching data, please wait...
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && (
                        <span className="text-primary"> 🔼</span>
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <span className="text-primary"> 🔽</span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns?.length + (actions?.length > 0 ? 1 : 0)}
                    className="text-center text-muted"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          {table.getPageCount()}
        </div>

        <div className="d-flex align-items-center">
          <label htmlFor="page-size-selector" className="me-2">
            Show:
          </label>
          <select
            id="page-size-selector"
            className="form-select form-select-sm w-auto"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="btn-group">
          <button
            className="btn btn-outline-secondary rounded-start px-3 btn-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <i className="bi bi-arrow-bar-left"></i>
          </button>

          <button
            className="btn btn-outline-secondary px-3 btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <button
            className="btn btn-outline-secondary px-3 btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          <button
            className="btn btn-outline-secondary rounded-end px-3 btn-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <i className="bi bi-arrow-bar-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;

import React from "react";

const DataTable = ({ columns, data, emptyMessage }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                {emptyMessage || "No data available."}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 border-b text-gray-600">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

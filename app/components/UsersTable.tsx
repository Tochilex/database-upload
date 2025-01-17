"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

import { details } from "@prisma/client";
import { createBulkUsers, deleteUsers, UserProps } from "@/actions/users";

export default function UsersTable({ users }: { users: details[] }) {
  //Save file
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingData, setDeletingData] = useState(false);

  //Preview Json string
  const [jsonData, setJsonDate] = useState("");
  console.log(file);

  function previewData() {
    // Get file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        //Get data from file
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          //Sheetname
          const sheetName = workbook.SheetNames[0];
          //Worksheet
          const workSheet = workbook.Sheets[sheetName];
          //Json
          const json = XLSX.utils.sheet_to_json(workSheet);

          setJsonDate(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  }
  function saveData() {
    // Get file
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        //Get data from file
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          //Sheetname
          const sheetName = workbook.SheetNames[0];
          //Worksheet
          const workSheet = workbook.Sheets[sheetName];
          //Json
          const json: UserProps[] = XLSX.utils.sheet_to_json(workSheet);
          //Save to the DB
          try {
            //console.log(json);
            await createBulkUsers(json);
            setLoading(false);
          } catch (error) {
            console.log(error);
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  async function clearData() {
    try {
      setDeletingData(true);
      await deleteUsers();
      setDeletingData(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Buttons */}
      <div className="flex item-center gap-8">
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept=".xls,.xlsx,.csv"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <button
          onClick={previewData}
          className="py-2 px-6 rounded bg-slate-300 text-slate-900"
        >
          Preview Data
        </button>

        <button
          onClick={saveData}
          className="py-2 px-6 rounded bg-purple-600 text-slate-900"
        >
          Save Data
        </button>

        <button
          onClick={clearData}
          className="py-2 px-6 rounded bg-red-600 text-slate-900"
        >
          Clear Data
        </button>
      </div>

      <pre>{jsonData}</pre>

      {/* Table */}
      {deletingData && <p>Deleting Data Please Wait ...</p>}
      {loading ? (
        <p>Saving Data Please Wait ...</p>
      ) : (
        <div className="relative overflow-x-auto">
          {users && users.length > 0 && (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3">
                    City
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th scope="row">{user.name}</th>
                      <td className="px-6 py-4">{user.age}</td>
                      <td className="px-6 py-4">{user.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

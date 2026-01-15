"use client";

import TimeEntryForm from "@/components/TimeEntryForm/TimeEntryForm";
import { useEffect, useState, useCallback } from "react";
import EntryHistory from "../components/EntryHistory/EntryHistory";


export default function Home() {
  const [entries, setEntries] = useState([]);


  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  }, []);

  
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]); 
  return (
    <main className="min-h-screen bg-[#FFF9FA] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        
        <div className="lg:sticky lg:top-12 w-full lg:w-auto">
          <TimeEntryForm onSuccess={fetchEntries} />
        </div>

        
        <div className="flex-1 w-full">
          <EntryHistory entries={entries} />
        </div>
        
      </div>
    </main>
  );
}
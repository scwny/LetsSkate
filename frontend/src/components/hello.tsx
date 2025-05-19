import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Fetch function
const fetchHello = async (): Promise<string> => {
  const res = await fetch('/api/hello');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.text();
};

export function Hello() {
  const { data, isLoading, error } = useQuery(['hello'], fetchHello);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return <div className="text-lg font-medium">{data}</div>;
}

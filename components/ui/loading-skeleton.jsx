import React from "react";

export const LoadingSkeleton = ({ className = "", ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <LoadingSkeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <LoadingSkeleton className="h-4 w-3/4 mb-2" />
        <LoadingSkeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
      <LoadingSkeleton className="h-4 w-4/5" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <LoadingSkeleton className="h-6 w-32" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-center gap-4">
            <LoadingSkeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-1/4" />
              <LoadingSkeleton className="h-3 w-1/3" />
            </div>
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <LoadingSkeleton className="h-6 w-32" />
      <LoadingSkeleton className="h-8 w-24" />
    </div>
    <div className="space-y-4">
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-5/6" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
    <div className="mt-6 flex justify-center">
      <LoadingSkeleton className="w-32 h-32 rounded-full" />
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
    <div className="space-y-6">
      <div>
        <LoadingSkeleton className="h-5 w-24 mb-2" />
        <LoadingSkeleton className="h-10 w-full" />
      </div>
      <div>
        <LoadingSkeleton className="h-5 w-20 mb-2" />
        <LoadingSkeleton className="h-10 w-full" />
      </div>
      <div>
        <LoadingSkeleton className="h-5 w-16 mb-2" />
        <LoadingSkeleton className="h-10 w-full" />
      </div>
      <LoadingSkeleton className="h-12 w-full rounded-lg" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="text-center space-y-4">
      <LoadingSkeleton className="h-12 w-64 mx-auto" />
      <LoadingSkeleton className="h-6 w-48 mx-auto" />
      <LoadingSkeleton className="h-4 w-96 mx-auto" />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>

    {/* Budgets Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-6 w-32" />
        <LoadingSkeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

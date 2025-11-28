'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/dateUtils';
import { Application } from '@prisma/client';
import ApplicationDetail from './ApplicationDetail';
import FilterControls from './FilterControls';
import PaginationControls from './PaginationControls';

interface ApplicationTableProps {
  applications: Application[];
  onUpdate: (updatedApplication: Application) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications, onUpdate }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: null as string | null,
    endDate: null as string | null,
  });

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of applications per page

  // Get unique statuses for the filter dropdown
  const statusOptions = useMemo(() => {
    const statuses = new Set<string>();
    applications.forEach(app => statuses.add(app.status));
    return Array.from(statuses);
  }, [applications]);

  // Apply multiple filters to the applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Search filter (position, company, platform, notes)
      const matchesSearch =
        !filters.search ||
        app.position.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.company_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (app.platform && app.platform.toLowerCase().includes(filters.search.toLowerCase())) ||
        (app.notes && app.notes.toLowerCase().includes(filters.search.toLowerCase()));

      // Status filter
      const matchesStatus =
        !filters.status ||
        app.status === filters.status;

      // Date filters
      const appDate = new Date(app.date_applied);
      const matchesStartDate =
        !filters.startDate ||
        appDate >= new Date(filters.startDate);

      const matchesEndDate =
        !filters.endDate ||
        appDate <= new Date(filters.endDate);

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [applications, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      startDate: null,
      endDate: null,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WISHLIST': return 'bg-gray-500';
      case 'APPLIED': return 'bg-blue-500';
      case 'SCREENING': return 'bg-yellow-500';
      case 'INTERVIEW_HR': case 'INTERVIEW_USER': return 'bg-purple-500';
      case 'OFFERING': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'GHOSTED': return 'bg-gray-700';
      default: return 'bg-gray-500';
    }
  };

  const handleOpenDetail = (application: Application) => {
    setSelectedApplication(application);
    setDetailOpen(true);
  };

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="space-y-4">
      <FilterControls
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        statusOptions={statusOptions}
      />

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Position</TableHead>
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              paginatedApplications.map((application) => (
                <TableRow
                  key={application.id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleOpenDetail(application)}
                >
                  <TableCell className="font-medium">
                    <div className="truncate max-w-xs">{application.position}</div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-xs">{application.company_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-[100px]">{application.platform || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {application.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {application.date_applied ? formatDate(application.date_applied) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-[100px]">{application.location || '-'}</div>
                  </TableCell>
                  <TableCell>
                    {application.salary_expectation ? `Rp ${application.salary_expectation}` : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        Showing {(startIndex + 1)}-{Math.min(startIndex + itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
      </div>

      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default ApplicationTable;
/**
 * Admin Tournaments List Page
 * 
 * This component displays a comprehensive list of tournaments with filtering,
 * search capabilities, and navigation to participant management.
 * 
 * Features:
 * - Responsive table/card layout
 * - Search and filter functionality
 * - Loading states with skeleton UI
 * - Error handling and empty states
 * - Accessibility compliance (ARIA labels, keyboard navigation)
 * - Real-time participant count display
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Trophy, Users, Calendar, MapPin, Filter, Eye, CircleAlert as AlertCircle, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockApi } from "@/lib/mockData";
import { Tournament } from "@/types/tournament";
import { toast } from "sonner";

/**
 * Tournament status configuration for badges and filtering
 */
const TOURNAMENT_STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  ongoing: {
    label: 'Ongoing',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  completed: {
    label: 'Completed',
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'secondary' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
};

export default function AdminTournamentsPage() {
  // State management
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Tournament['status'] | 'all'>('all');
  
  const router = useRouter();

  /**
   * Fetch tournaments from the API with current filters
   */
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockApi.getUpcomingTournaments({
        limit: 100,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm.trim() || undefined
      });
      
      if (response.success && response.data) {
        setTournaments(response.data.items);
      } else {
        throw new Error(response.message || 'Failed to fetch tournaments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to load tournaments', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch tournaments on component mount and when filters change
  useEffect(() => {
    fetchTournaments();
  }, [statusFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTournaments();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Navigate to tournament participants page
   */
  const handleViewParticipants = (tournamentId: string) => {
    router.push(`/admin/tournaments/${tournamentId}/participants`);
  };

  /**
   * Get status badge component
   */
  const getStatusBadge = (status: Tournament['status']) => {
    const config = TOURNAMENT_STATUS_CONFIG[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  /**
   * Render loading skeleton
   */
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  /**
   * Render error state
   */
  const renderError = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTournaments}
          className="ml-4"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Trophy className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No tournaments found
        </h3>
        <p className="text-gray-500 text-center mb-4">
          {searchTerm || statusFilter !== 'all' 
            ? 'Try adjusting your search or filter criteria.'
            : 'No tournaments have been created yet.'
          }
        </p>
        <Button variant="outline" onClick={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Tournament Management</h2>
            <p className="text-gray-600 mt-2">
              Manage tournaments and their participants
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tournament
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tournaments by name, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Search tournaments"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as Tournament['status'] | 'all')}
              >
                <SelectTrigger className="w-full sm:w-48" aria-label="Filter by status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tournaments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Tournaments ({tournaments.length})
            </CardTitle>
            <CardDescription>
              {statusFilter === 'all' 
                ? 'All tournaments in the system'
                : `${TOURNAMENT_STATUS_CONFIG[statusFilter as Tournament['status']].label} tournaments`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              renderLoadingSkeleton()
            ) : error ? (
              renderError()
            ) : tournaments.length === 0 ? (
              renderEmptyState()
            ) : (
              /* Desktop Table View */
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournaments.map((tournament) => (
                      <TableRow key={tournament.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {tournament.name}
                            </div>
                            {tournament.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {tournament.description}
                              </div>
                            )}
                            {tournament.organizer && (
                              <div className="text-xs text-gray-400 mt-1">
                                by {tournament.organizer}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <time dateTime={tournament.date}>
                              {formatDate(tournament.date)}
                            </time>
                          </div>
                        </TableCell>
                        <TableCell>
                          {tournament.location ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="truncate max-w-xs">
                                {tournament.location}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {tournament.participant_count}
                            </span>
                            {tournament.max_participants && (
                              <span className="text-gray-500">
                                / {tournament.max_participants}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(tournament.status)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewParticipants(tournament.id)}
                            aria-label={`View participants for ${tournament.name}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Participants
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Mobile Card View */}
            {!loading && !error && tournaments.length > 0 && (
              <div className="md:hidden space-y-4">
                {tournaments.map((tournament) => (
                  <Card key={tournament.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {tournament.name}
                          </h3>
                          {tournament.organizer && (
                            <p className="text-xs text-gray-500 mb-2">
                              by {tournament.organizer}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(tournament.status)}
                      </div>

                      {tournament.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {tournament.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={tournament.date}>
                            {formatDate(tournament.date)}
                          </time>
                        </div>
                        
                        {tournament.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{tournament.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {tournament.participant_count}
                            {tournament.max_participants && ` / ${tournament.max_participants}`} participants
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewParticipants(tournament.id)}
                        className="w-full"
                        aria-label={`View participants for ${tournament.name}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Participants
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
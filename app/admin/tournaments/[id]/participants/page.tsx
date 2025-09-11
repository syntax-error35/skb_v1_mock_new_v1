/**
 * Tournament Participants Management Page
 * 
 * This component provides comprehensive participant management for a specific tournament,
 * including search, filtering, and deletion capabilities with proper accessibility support.
 * 
 * Features:
 * - Breadcrumb navigation
 * - Advanced search and filtering
 * - Participant deletion with confirmation
 * - Real-time participant count updates
 * - Responsive design with mobile-first approach
 * - Comprehensive error handling and loading states
 * - Full accessibility compliance
 */

"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Search, 
  Users, 
  Trash2, 
  Filter,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Trophy,
  User,
  Shield
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockApi } from "@/lib/mockData";
import { Tournament, Participant } from "@/types/tournament";
import { toast } from "sonner";


/**
 * Participant status configuration for badges and filtering
 */
const PARTICIPANT_STATUS_CONFIG = {
  registered: {
    label: 'Registered',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
};

/**
 * Belt levels for filtering
 */
const BELT_LEVELS = [
  'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Brown',
  'Black Belt (1st Dan)', 'Black Belt (2nd Dan)', 'Black Belt (3rd Dan)',
  'Black Belt (4th Dan)', 'Black Belt (5th Dan)'
];

/**
 * Age categories for filtering
 */
const AGE_CATEGORIES = [
  'Cadet (12-13)', 'Youth (14-15)', 'Junior (16-17)', 'Senior (18+)'
];

export default function TournamentParticipantsPage() {
  // URL parameters
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  // State management
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Participant['status'] | 'all'>('all');
  const [beltFilter, setBeltFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [deletingParticipant, setDeletingParticipant] = useState<string | null>(null);

  /**
   * Fetch tournament details and participants
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tournament details and participants in parallel
      const [tournamentResponse, participantsResponse] = await Promise.all([
        mockApi.getTournament(tournamentId),
        mockApi.getTournamentParticipants(tournamentId, {
          limit: 100,
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm.trim() || undefined,
          belt_level: beltFilter === 'all' ? undefined : beltFilter,
          age_category: ageFilter === 'all' ? undefined : ageFilter
        })
      ]);

      if (!tournamentResponse.success || !tournamentResponse.data) {
        throw new Error(tournamentResponse.message || 'Tournament not found');
      }

      if (!participantsResponse.success || !participantsResponse.data) {
        throw new Error(participantsResponse.message || 'Failed to fetch participants');
      }

      setTournament(tournamentResponse.data);
      setParticipants(participantsResponse.data.items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to load data', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [tournamentId, statusFilter, beltFilter, ageFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  /**
   * Handle participant deletion
   */
  const handleDeleteParticipant = async (participantId: string, participantName: string) => {
    try {
      setDeletingParticipant(participantId);
      
      const response = await mockApi.deleteParticipant(participantId);
      
      if (response.success) {
        toast.success('Participant removed', {
          description: `${participantName} has been removed from the tournament.`
        });
        
        // Refresh data to get updated participant count
        await fetchData();
      } else {
        throw new Error(response.message || 'Failed to remove participant');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to remove participant', {
        description: errorMessage
      });
    } finally {
      setDeletingParticipant(null);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get status badge component
   */
  const getStatusBadge = (status: Participant['status']) => {
    const config = PARTICIPANT_STATUS_CONFIG[status];
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
    <div className="space-y-6">
      {/* Tournament header skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Participants table skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
          onClick={fetchData}
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
        <Users className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No participants found
        </h3>
        <p className="text-gray-500 text-center mb-4">
          {searchTerm || statusFilter !== 'all' || beltFilter !== 'all' || ageFilter !== 'all'
            ? 'Try adjusting your search or filter criteria.'
            : 'No participants have registered for this tournament yet.'
          }
        </p>
        <Button variant="outline" onClick={() => {
          setSearchTerm('');
          setStatusFilter('all');
          setBeltFilter('all');
          setAgeFilter('all');
        }}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        {renderLoadingSkeleton()}
      </AdminLayout>
    );
  }

  if (error || !tournament) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/tournaments')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tournaments
          </Button>
          {renderError()}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/admin/tournaments"
                className="flex items-center gap-1"
              >
                <Trophy className="h-4 w-4" />
                Tournaments
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tournament.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Tournament Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {tournament.name}
                </h1>
                {tournament.description && (
                  <p className="text-gray-600 mb-4">
                    {tournament.description}
                  </p>
                )}
              </div>
              <Badge 
                variant={tournament.status === 'upcoming' ? 'default' : 'secondary'}
                className={tournament.status === 'upcoming' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
                }
              >
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  {new Date(tournament.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {tournament.location && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-400" />
                  <span>{tournament.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>
                  {tournament.participant_count} participants
                  {tournament.max_participants && ` / ${tournament.max_participants} max`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Participant Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search participants by name, email, or SKB ID"
                />
              </div>
              
              {/* Status Filter */}
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as Participant['status'] | 'all')}
              >
                <SelectTrigger aria-label="Filter by registration status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Belt Level Filter */}
              <Select 
                value={beltFilter} 
                onValueChange={setBeltFilter}
              >
                <SelectTrigger aria-label="Filter by belt level">
                  <SelectValue placeholder="All Belt Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Belt Levels</SelectItem>
                  {BELT_LEVELS.map((belt) => (
                    <SelectItem key={belt} value={belt}>
                      {belt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Age Category Filter */}
              <Select 
                value={ageFilter} 
                onValueChange={setAgeFilter}
              >
                <SelectTrigger aria-label="Filter by age category">
                  <SelectValue placeholder="All Age Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Age Categories</SelectItem>
                  {AGE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Participants List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({participants.length})
            </CardTitle>
            <CardDescription>
              Manage tournament participants and their registration status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Belt Level</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Registration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow key={participant.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {participant.name}
                              </div>
                              {participant.skb_id && (
                                <div className="text-sm text-gray-500">
                                  SKB ID: {participant.skb_id}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <a 
                                  href={`mailto:${participant.email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {participant.email}
                                </a>
                              </div>
                              {participant.phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <a 
                                    href={`tel:${participant.phone}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {participant.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {participant.belt_level || 'Not specified'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {participant.age_category || 'Not specified'}
                              {participant.weight_category && (
                                <div className="text-xs text-gray-500">
                                  {participant.weight_category}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <time dateTime={participant.registration_date}>
                                {formatDate(participant.registration_date)}
                              </time>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(participant.status)}
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={deletingParticipant === participant.id}
                                  aria-label={`Remove ${participant.name} from tournament`}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Participant</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove <strong>{participant.name}</strong> from this tournament? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteParticipant(participant.id, participant.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remove Participant
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {participants.map((participant) => (
                    <Card key={participant.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {participant.name}
                            </h3>
                            {participant.skb_id && (
                              <p className="text-sm text-gray-500 mb-2">
                                SKB ID: {participant.skb_id}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(participant.status)}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a 
                              href={`mailto:${participant.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {participant.email}
                            </a>
                          </div>
                          
                          {participant.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <a 
                                href={`tel:${participant.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {participant.phone}
                              </a>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Shield className="h-4 w-4" />
                            <span>{participant.belt_level || 'Not specified'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{participant.age_category || 'Not specified'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Registered {formatDate(participant.registration_date)}</span>
                          </div>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deletingParticipant === participant.id}
                              className="w-full"
                              aria-label={`Remove ${participant.name} from tournament`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove from Tournament
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Participant</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove <strong>{participant.name}</strong> from this tournament? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteParticipant(participant.id, participant.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove Participant
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
// COMMENTED OUT - ORIGINAL BACKEND IMPORT
// import { makeAuthenticatedRequest } from "@/lib/auth";
// MOCK DATA IMPORT - TEMPORARY
import { mockApi } from "@/lib/mockData";
import { toast } from "sonner";

interface Member {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  belt: string;
  skbId: string;
  joinDate: string;
  isActive: boolean;
  dateOfBirth: string;
  gender: string;
  profession: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBelt, setSelectedBelt] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const belts = [
    'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Brown',
    'Black Belt (1st Dan)', 'Black Belt (2nd Dan)', 'Black Belt (3rd Dan)',
    'Black Belt (4th Dan)', 'Black Belt (5th Dan)'
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/members?limit=100');
      const data = await response.json();
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getMembers({ limit: 100, search: searchTerm, belt: selectedBelt === 'all' ? undefined : selectedBelt });
      
      if (data.success) {
        setMembers(data.data.members);
      } else {
        toast.error("Failed to fetch members");
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error("Error fetching members");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/members/${memberId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      */
      
      // MOCK DELETE - TEMPORARY REPLACEMENT
      const data = await mockApi.deleteMember(memberId);
      
      if (data.success) {
        toast.success("Member deleted successfully");
        fetchMembers();
      } else {
        toast.error("Failed to delete member");
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error("Error deleting member");
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skbId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBelt = selectedBelt === 'all' || member.belt === selectedBelt;
    return matchesSearch && matchesBelt;
  });

  const getBeltColor = (belt: string) => {
    if (belt.includes('Black')) return 'bg-black text-white';
    if (belt === 'Brown') return 'bg-amber-800 text-white';
    if (belt === 'Blue') return 'bg-blue-600 text-white';
    if (belt === 'Green') return 'bg-green-600 text-white';
    if (belt === 'Orange') return 'bg-orange-500 text-white';
    if (belt === 'Yellow') return 'bg-yellow-400 text-black';
    return 'bg-gray-200 text-black';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Members</h2>
            <p className="text-gray-600 mt-2">
              Manage karate club members
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or SKB ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedBelt} onValueChange={setSelectedBelt}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by belt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Belts</SelectItem>
                  {belts.map((belt) => (
                    <SelectItem key={belt} value={belt}>
                      {belt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Members ({filteredMembers.length})</CardTitle>
            <CardDescription>
              A list of all registered members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKB ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Belt</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.skbId}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge className={getBeltColor(member.belt)}>
                            {member.belt}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(member.joinDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.isActive ? "default" : "secondary"}>
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedMember(member);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMember(member._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Member Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedMember?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-900">{selectedMember.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">SKB ID</label>
                  <p className="text-sm text-gray-900">{selectedMember.skbId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedMember.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile</label>
                  <p className="text-sm text-gray-900">{selectedMember.mobile}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Belt</label>
                  <Badge className={getBeltColor(selectedMember.belt)}>
                    {selectedMember.belt}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedMember.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMember.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Profession</label>
                  <p className="text-sm text-gray-900">{selectedMember.profession}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Join Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMember.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge variant={selectedMember.isActive ? "default" : "secondary"}>
                    {selectedMember.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
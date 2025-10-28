'use client';

import { useEffect, useState } from 'react';
import { dummyData } from '@/lib/dummy-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Eye, Search, MessageSquare, User, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Ticket, TicketReply } from '@/lib/dummy-data';

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newReply, setNewReply] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (assignedFilter !== 'all') {
      if (assignedFilter === 'unassigned') {
        filtered = filtered.filter(ticket => !ticket.assigned_admin_id);
      } else {
        filtered = filtered.filter(ticket => ticket.assigned_admin_id === assignedFilter);
      }
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, assignedFilter]);

  async function fetchTickets() {
    try {
      const data = await dummyData.getTickets();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }

  async function updateTicketStatus(ticketId: string, status: string) {
    try {
      await dummyData.updateTicket(ticketId, { status: status as Ticket['status'] });
      toast.success('Ticket status updated successfully');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  }

  async function updateTicketPriority(ticketId: string, priority: string) {
    try {
      await dummyData.updateTicket(ticketId, { priority: priority as Ticket['priority'] });
      toast.success('Ticket priority updated successfully');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to update ticket priority');
    }
  }

  async function assignTicket(ticketId: string, adminId: string) {
    try {
      await dummyData.updateTicket(ticketId, { assigned_admin_id: adminId });
      toast.success('Ticket assigned successfully');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to assign ticket');
    }
  }

  async function submitReply() {
    if (!selectedTicket || !newReply.trim()) return;

    try {
      await dummyData.createTicketReply({
        ticket_id: selectedTicket.id,
        user_id: 'user_1', // Assuming current admin user
        message: newReply.trim(),
      });
      toast.success('Reply added successfully');
      setNewReply('');
      setIsReplyDialogOpen(false);
      fetchTickets();
      // Refresh selected ticket details
      const updatedTicket = await dummyData.getTicketById(selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      toast.error('Failed to add reply');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'destructive';
      case 'In Progress':
        return 'secondary';
      case 'Resolved':
        return 'default';
      case 'Closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4" />;
      case 'In Progress':
        return <Clock className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'destructive';
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ticket Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Priority:</span>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Assigned:</span>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="user_1">Admin User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">#{ticket.id.split('_')[1]}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.user?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{ticket.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ticket.assigned_admin ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{ticket.assigned_admin.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Ticket #{selectedTicket?.id.split('_')[1]} - {selectedTicket?.subject}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedTicket && (
                          <div className="space-y-6">
                            {/* Ticket Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <p><strong>Name:</strong> {selectedTicket.user?.full_name}</p>
                                <p><strong>Email:</strong> {selectedTicket.user?.email}</p>
                                {selectedTicket.order && (
                                  <p><strong>Order:</strong> #{selectedTicket.order.id.split('_')[1]}</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Ticket Information</h4>
                                <p><strong>Created:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</p>
                                <p><strong>Updated:</strong> {new Date(selectedTicket.updated_at).toLocaleString()}</p>
                                <p><strong>Attachments:</strong> {selectedTicket.attachments?.length || 0}</p>
                              </div>
                            </div>

                            {/* Status and Priority Controls */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                  value={selectedTicket.status}
                                  onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Priority</label>
                                <Select
                                  value={selectedTicket.priority}
                                  onValueChange={(value) => updateTicketPriority(selectedTicket.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Assign Admin */}
                            <div>
                              <label className="text-sm font-medium">Assigned Admin</label>
                              <Select
                                value={selectedTicket.assigned_admin_id || 'unassigned'}
                                onValueChange={(value) => assignTicket(selectedTicket.id, value === 'unassigned' ? '' : value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unassigned">Unassigned</SelectItem>
                                  <SelectItem value="user_1">Admin User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Description */}
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
                                <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                              </div>
                            </div>

                            {/* Replies */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold">Replies ({selectedTicket.replies?.length || 0})</h4>
                                <Button onClick={() => setIsReplyDialogOpen(true)} size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Add Reply
                                </Button>
                              </div>
                              <div className="space-y-4">
                                {selectedTicket.replies?.map((reply: TicketReply) => (
                                  <div key={reply.id} className="border rounded p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{reply.user?.full_name || 'Unknown'}</span>
                                        <span className="text-sm text-muted-foreground">
                                          {new Date(reply.created_at).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="whitespace-pre-wrap">{reply.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reply</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitReply} disabled={!newReply.trim()}>
                Submit Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Trophy, CheckCircle } from 'lucide-react';
import { Notice } from '@/types/notice';

const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  skb_id: z.string()
    .min(3, "SKB ID must be at least 3 characters")
    .max(20, "SKB ID must not exceed 20 characters")
    .regex(/^[A-Z0-9]+$/, "SKB ID can only contain uppercase letters and numbers")
});

interface TournamentRegistrationFormProps {
  tournament: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TournamentRegistrationForm({ 
  tournament, 
  isOpen, 
  onClose 
}: TournamentRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      skb_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!tournament) return;

    setIsSubmitting(true);
    
    // COMMENTED OUT - ORIGINAL BACKEND SUBMISSION
    // TODO: Uncomment when reconnecting to backend
    /*
    try {
      const response = await fetch('/api/tournaments/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          tournamentId: tournament.id
        })
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      setIsSuccess(true);
      toast.success("Registration successful!", {
        description: `You have been registered for ${tournament.title}`,
        duration: 5000,
      });
      
      form.reset();
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: "Please try again or contact support if the problem persists.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
    */
    
    // MOCK TOURNAMENT REGISTRATION - TEMPORARY REPLACEMENT
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success("Registration successful!", {
        description: `You have been registered for ${tournament.title}`,
        duration: 5000,
      });
      
      // Reset form after successful submission
      form.reset();
      
      // Close modal after showing success state briefly
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: "Please try again or contact support if the problem persists.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setIsSuccess(false);
      onClose();
    }
  };

  if (!tournament) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-purple-600" />
            Tournament Registration
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Register for: <span className="font-medium">{tournament.title}</span>
          </p>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Registration Successful!
            </h3>
            <p className="text-gray-600">
              You will receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name"
                        {...field}
                        disabled={isSubmitting}
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skb_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKB ID *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your SKB ID (e.g., SKB123)"
                        {...field}
                        disabled={isSubmitting}
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Your Shotokan Karate Bangladesh member ID
                    </p>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
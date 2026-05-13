'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  jobTitle: z.string().min(2),
  baseSalary: z.number().min(0),
  hireDate: z.string(),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'intern', 'remote']),
  phoneNumber: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  employee?: any;
}

export function EmployeeModal({ onClose, onSuccess, employee }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: employee || { employmentType: 'full_time' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (employee) {
        await api.put(`/employees/${employee.id}`, data);
        toast.success('Employee updated');
      } else {
        await api.post('/employees', data);
        toast.success('Employee created');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save employee');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-xl transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name *</label>
                <input {...register('firstName')} className="input-field" placeholder="John" />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name *</label>
                <input {...register('lastName')} className="input-field" placeholder="Doe" />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email *</label>
              <input {...register('email')} type="email" className="input-field" placeholder="john@company.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Job Title *</label>
                <input {...register('jobTitle')} className="input-field" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Employment Type *</label>
                <select {...register('employmentType')} className="input-field">
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Base Salary *</label>
                <input {...register('baseSalary', { valueAsNumber: true })} type="number" className="input-field" placeholder="5000" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hire Date *</label>
                <input {...register('hireDate')} type="date" className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone</label>
                <input {...register('phoneNumber')} className="input-field" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
                <input {...register('city')} className="input-field" placeholder="New York" />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all">
              Cancel
            </button>
            <button
              type="submit"
              form="employee-form"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white text-sm font-medium rounded-xl
                         hover:from-nexus-600 hover:to-nexus-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {employee ? 'Update' : 'Create'} Employee
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// src/hooks/useStudents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  sendResetLink,
  bulkImportStudents,
  bulkExportStudents,
} from '../api/student'; // Ensure this path is correct

const STUDENT_QUERY_KEY = 'adminStudents'; // Consistent query key

// Hook for admins/teachers to get all students
export const useAdminStudents = () => {
  return useQuery({
    queryKey: [STUDENT_QUERY_KEY],
    queryFn: getStudents,
    // The select function transforms the data, making the component cleaner
    select: (data) => data?.data?.data || [],
  });
};

// Hook to create a new student
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      // When a mutation is successful, invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [STUDENT_QUERY_KEY] });
    },
  });
};

// Hook to update a student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENT_QUERY_KEY] });
    },
  });
};

// Hook to delete a student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENT_QUERY_KEY] });
    },
  });
};

// Hooks for your feature-rich management tool
export const useSendResetLink = () => {
    return useMutation({ mutationFn: (userId) => sendResetLink(userId) });
};

export const useBulkImportStudents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file) => bulkImportStudents(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STUDENT_QUERY_KEY] });
        }
    });
};

export const useBulkExportStudents = () => {
    return useMutation({ mutationFn: () => bulkExportStudents() });
};
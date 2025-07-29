import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Wrapper component that conditionally renders children based on user permissions
 */
const PermissionGate = ({ 
  permission, 
  project = null, 
  members = [], 
  task = null, 
  note = null,
  fallback = null,
  children 
}) => {
  const { canPerformAction } = usePermissions();

  const additionalChecks = {};
  if (task) additionalChecks.task = task;
  if (note) additionalChecks.note = note;

  const hasPermission = canPerformAction(permission, project, members, additionalChecks);

  if (!hasPermission) {
    return fallback;
  }

  return children;
};

export default PermissionGate;

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Higher-order component for permission-based rendering
 */
export const withPermission = (WrappedComponent, permission, options = {}) => {
  return React.forwardRef((props, ref) => {
    const { canPerformAction } = usePermissions();
    const { project, members = [], task, note, fallback = null } = options;

    const additionalChecks = {};
    if (task) additionalChecks.task = task;
    if (note) additionalChecks.note = note;

    const hasPermission = canPerformAction(
      permission, 
      project || props.project, 
      members || props.members || [], 
      additionalChecks
    );

    if (!hasPermission) {
      return fallback;
    }

    return <WrappedComponent {...props} ref={ref} />;
  });
};

/**
 * Hook for conditional rendering based on permissions
 */
export const useConditionalRender = (permission, project, members = [], additionalChecks = {}) => {
  const { canPerformAction } = usePermissions();

  return canPerformAction(permission, project, members, additionalChecks);
};

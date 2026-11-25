import React from 'react';
import { Link } from '@inertiajs/react';

interface ProfileLinkProps {
  username?: string | null;
  userId?: number;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Wraps content in a link to /users/{username} when a username exists.
 * Falls back to a plain span when no username is available.
 * Stops event propagation so parent post-card click handlers are not triggered.
 */
export const ProfileLink: React.FC<ProfileLinkProps> = ({
  username,
  children,
  className = '',
  onClick,
}) => {
  if (!username) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link
      href={`/users/${username}`}
      className={`no-underline ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};

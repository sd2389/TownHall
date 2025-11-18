"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

interface PageTitleProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

interface PageDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface PageActionsProps {
  children: ReactNode;
  className?: string;
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer Component
 * Tier 1: Presentation Layer - Main container for all pages
 * Single Responsibility: Provides consistent page layout structure
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {children}
      </div>
    </div>
  );
}

/**
 * PageHeader Component
 * Tier 1: Presentation Layer - Header section for page content
 * Single Responsibility: Contains title, description, and actions
 */
export function PageHeader({ children, className = "" }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * PageTitle Component
 * Tier 1: Presentation Layer - Page title with optional icon
 * Single Responsibility: Displays page title
 */
export function PageTitle({ children, icon, className = "" }: PageTitleProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && (
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          {icon}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
        {children}
      </h1>
    </div>
  );
}

/**
 * PageDescription Component
 * Tier 1: Presentation Layer - Page description text
 * Single Responsibility: Displays page description
 */
export function PageDescription({ children, className = "" }: PageDescriptionProps) {
  return (
    <p className={`text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 ${className}`}>
      {children}
    </p>
  );
}

/**
 * PageActions Component
 * Tier 1: Presentation Layer - Action buttons container
 * Single Responsibility: Contains action buttons for the page
 */
export function PageActions({ children, className = "" }: PageActionsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

/**
 * PageContent Component
 * Tier 1: Presentation Layer - Main content area
 * Single Responsibility: Contains the main page content
 */
export function PageContent({ children, className = "" }: PageContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}





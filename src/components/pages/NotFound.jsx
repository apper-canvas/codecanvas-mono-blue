import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="text-center p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
          <ApperIcon name="FileX" className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            Go Home
          </Link>
          <Link 
            to="/editor" 
            className="inline-flex items-center gap-2 bg-surface border border-slate-600 text-slate-200 px-6 py-3 rounded-lg font-medium hover:border-primary-500 hover:text-primary-400 transition-colors"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Create Pen
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
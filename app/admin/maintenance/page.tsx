'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/hooks/useProperties';
import {
  findOrphanedImages,
  cleanupOrphanedImages,
  getStorageStats,
  deletePropertyImages
} from '@/lib/imageCleanup';

export default function MaintenancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { properties, loading: propertiesLoading } = useProperties(true);

  const [storageStats, setStorageStats] = useState<any>(null);
  const [orphanedImages, setOrphanedImages] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Load storage stats on mount
  useEffect(() => {
    if (user) {
      loadStorageStats();
    }
  }, [user]);

  const loadStorageStats = async () => {
    try {
      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Error loading storage stats:', error);
    }
  };

  const scanForOrphanedImages = async () => {
    setScanning(true);
    setCleanupResult(null);
    try {
      const orphaned = await findOrphanedImages(properties);
      setOrphanedImages(orphaned);
    } catch (error) {
      console.error('Error scanning for orphaned images:', error);
      alert('Failed to scan for orphaned images');
    } finally {
      setScanning(false);
    }
  };

  const performCleanup = async () => {
    if (!confirm(`Are you sure you want to delete ${orphanedImages.length} orphaned images? This cannot be undone.`)) {
      return;
    }

    setCleaning(true);
    try {
      const result = await cleanupOrphanedImages(orphanedImages);
      setCleanupResult(result);
      setOrphanedImages([]);
      await loadStorageStats();
    } catch (error) {
      console.error('Error cleaning up images:', error);
      alert('Failed to clean up orphaned images');
    } finally {
      setCleaning(false);
    }
  };

  if (authLoading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Maintenance</h1>
              <p className="text-gray-600 mt-2">Manage storage and clean up unused resources</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Storage Statistics</h2>
            <button
              onClick={loadStorageStats}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
            >
              🔄 Refresh
            </button>
          </div>

          {storageStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600">{storageStats.totalFiles}</div>
                <div className="text-sm text-gray-600 mt-1">Total Files</div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">{properties.length}</div>
                <div className="text-sm text-gray-600 mt-1">Active Properties</div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.keys(storageStats.folders).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Storage Folders</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Loading statistics...</div>
          )}

          {storageStats && Object.keys(storageStats.folders).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Files by Folder</h3>
              <div className="space-y-2">
                {Object.entries(storageStats.folders).map(([folder, count]) => (
                  <div key={folder} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">📁 {folder}</span>
                    <span className="font-semibold text-gray-900">{count as number} files</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Orphaned Images Scanner */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Orphaned Images Cleanup</h2>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ What are orphaned images?</strong><br />
              Images that exist in storage but are not referenced by any property in the database.
              These can accumulate when properties are deleted or images are replaced.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={scanForOrphanedImages}
              disabled={scanning || propertiesLoading}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scanning...
                </span>
              ) : (
                '🔍 Scan for Orphaned Images'
              )}
            </button>

            {orphanedImages.length > 0 && (
              <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-orange-900">
                      Found {orphanedImages.length} Orphaned Images
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      These images are not referenced by any property and can be safely deleted.
                    </p>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto mb-4 bg-white rounded-lg p-3">
                  {orphanedImages.slice(0, 20).map((file, index) => (
                    <div key={index} className="text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0">
                      {file}
                    </div>
                  ))}
                  {orphanedImages.length > 20 && (
                    <div className="text-xs text-gray-500 py-1 italic">
                      ... and {orphanedImages.length - 20} more
                    </div>
                  )}
                </div>

                <button
                  onClick={performCleanup}
                  disabled={cleaning}
                  className="w-full px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cleaning ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Cleaning up...
                    </span>
                  ) : (
                    `🗑️ Delete ${orphanedImages.length} Orphaned Images`
                  )}
                </button>
              </div>
            )}

            {orphanedImages.length === 0 && !scanning && cleanupResult === null && (
              <div className="text-center py-8 text-gray-500">
                Click "Scan" to check for orphaned images
              </div>
            )}

            {cleanupResult && (
              <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-2">✅ Cleanup Complete</h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p>• Successfully deleted: {cleanupResult.success} images</p>
                  {cleanupResult.failed > 0 && (
                    <p>• Failed to delete: {cleanupResult.failed} images</p>
                  )}
                  <p>• Total processed: {cleanupResult.total} images</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Maintenance Best Practices</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Run orphaned image scan weekly to keep storage clean</li>
            <li>• Images are automatically deleted when properties are removed</li>
            <li>• Monitor cloud storage usage regularly</li>
            <li>• Large images are automatically optimized during upload</li>
            <li>• Consider upgrading storage plan if limits are exceeded</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

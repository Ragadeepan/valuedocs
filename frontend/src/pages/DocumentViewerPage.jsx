import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Download, Trash2, Share2, Edit2, ZoomIn, ZoomOut,
  Maximize, RotateCw, Lock, Unlock, FileText, Calendar, Tag, Info,
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDocument, useDeleteDocument } from '../hooks/useDocuments';
import ShareModal from '../components/documents/ShareModal';
import RenameModal from '../components/documents/RenameModal';
import { CategoryBadge, ExpiryBadge } from '../components/ui/Badge';
import { formatDate, formatDateTime, formatFileSize, getDaysUntilExpiry, isImageFile, isPDFFile } from '../utils/formatters';
import { downloadFile } from '../utils/helpers';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DocumentViewerPage() {
  const { id, memberId } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showRename, setShowRename] = useState(false);

  const { data: doc, isLoading } = useDocument(id);
  const { mutateAsync: deleteDoc } = useDeleteDocument();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${doc?.name}"?`)) return;
    await deleteDoc(id);
    navigate(memberId ? `/family/${memberId}` : '/documents');
  };

  const handleDownload = () => {
    if (doc) downloadFile(doc.fileUrl, doc.name);
  };

  const backPath = memberId ? `/family/${memberId}` : '/documents';

  const isImage = doc && isImageFile(doc.mimeType);
  const isPDF = doc && isPDFFile(doc.mimeType);
  const daysLeft = getDaysUntilExpiry(doc?.expiryDate);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-dark-500 hover:text-dark-800 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowShare(true)} className="btn-secondary text-sm py-2 px-3">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button onClick={handleDownload} className="btn-secondary text-sm py-2 px-3">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button onClick={() => setShowRename(true)} className="btn-secondary text-sm py-2 px-3">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="btn-danger text-sm py-2 px-3">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Viewer */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4">
            {/* Viewer controls */}
            {(isImage || isPDF) && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-dark-100 dark:border-dark-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 transition-all"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-dark-600 dark:text-dark-400 w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 transition-all"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="px-2 py-1 rounded-lg text-xs text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 transition-all"
                  >
                    Reset
                  </button>
                </div>

                {isPDF && numPages && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-dark-600 dark:text-dark-400">
                      {currentPage} / {numPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                      className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700 disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex items-center justify-center min-h-[400px] overflow-auto">
              {isLoading ? (
                <Skeleton className="w-full h-96" />
              ) : isImage ? (
                <motion.img
                  src={doc.fileUrl}
                  alt={doc.name}
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
                  className="max-w-full rounded-xl shadow-lg transition-transform duration-200"
                />
              ) : isPDF ? (
                <Document
                  file={doc.fileUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={<Skeleton className="w-full h-96" />}
                >
                  <Page
                    pageNumber={currentPage}
                    scale={zoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-xl rounded-xl overflow-hidden"
                  />
                </Document>
              ) : (
                <div className="flex flex-col items-center gap-4 py-12">
                  <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary-600" />
                  </div>
                  <p className="text-dark-600 dark:text-dark-400">Preview not available for this file type</p>
                  <button onClick={handleDownload} className="btn-primary text-sm">
                    <Download className="w-4 h-4" />
                    Download to view
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : doc ? (
            <>
              <div className="glass-card p-5 space-y-4">
                <h2 className="font-bold text-lg text-dark-900 dark:text-white break-words">{doc.name}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-dark-400 flex-shrink-0" />
                    <CategoryBadge category={doc.category} />
                    {daysLeft !== null && daysLeft <= 30 && <ExpiryBadge daysLeft={daysLeft} />}
                  </div>

                  {doc.expiryDate && (
                    <div className="flex items-center gap-3 text-dark-600 dark:text-dark-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Expires: {formatDate(doc.expiryDate)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-dark-600 dark:text-dark-400">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{doc.size ? formatFileSize(doc.size) : 'Unknown size'}</span>
                  </div>

                  <div className="pt-3 border-t border-dark-100 dark:border-dark-700 text-xs text-dark-400 space-y-1.5">
                    <p>Uploaded {formatDateTime(doc.createdAt)}</p>
                    {doc.updatedAt !== doc.createdAt && <p>Updated {formatDateTime(doc.updatedAt)}</p>}
                  </div>
                </div>

                {doc.notes && (
                  <div className="pt-3 border-t border-dark-100 dark:border-dark-700">
                    <p className="text-xs font-medium text-dark-500 mb-1">Notes</p>
                    <p className="text-sm text-dark-700 dark:text-dark-300">{doc.notes}</p>
                  </div>
                )}

                {doc.extractedText && (
                  <div className="pt-3 border-t border-dark-100 dark:border-dark-700">
                    <p className="text-xs font-medium text-dark-500 mb-2">Extracted Text (OCR)</p>
                    <div className="bg-dark-50 dark:bg-dark-800 rounded-xl p-3 text-xs text-dark-600 dark:text-dark-400 max-h-40 overflow-y-auto font-mono">
                      {doc.extractedText}
                    </div>
                  </div>
                )}

                {doc.tags?.length > 0 && (
                  <div className="pt-3 border-t border-dark-100 dark:border-dark-700">
                    <p className="text-xs font-medium text-dark-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="glass-card p-4 space-y-2">
                <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">Actions</p>
                {[
                  { icon: Share2, label: 'Share Document', action: () => setShowShare(true) },
                  { icon: Download, label: 'Download', action: handleDownload },
                  { icon: Edit2, label: 'Rename', action: () => setShowRename(true) },
                  { icon: Trash2, label: 'Delete Document', action: handleDelete, danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button
                    key={label}
                    onClick={action}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      danger
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {showShare && doc && <ShareModal document={doc} onClose={() => setShowShare(false)} />}
      {showRename && doc && <RenameModal document={doc} onClose={() => setShowRename(false)} />}
    </div>
  );
}

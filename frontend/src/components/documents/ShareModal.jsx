import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, MessageCircle, Link2, CheckCircle, Loader, Download } from 'lucide-react';
import Modal from '../ui/Modal';
import { getShareLink } from '../../services/documentService';
import { copyToClipboard, downloadFile } from '../../utils/helpers';
import { generateWhatsAppLink } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ShareModal({ document, onClose }) {
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const data = await getShareLink(document._id);
      setShareLink(data.shareUrl);
    } catch {
      toast.error('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(shareLink || document.fileUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = shareLink || document.fileUrl;
    window.open(generateWhatsAppLink(url, document.name), '_blank');
  };

  const handleDownload = () => {
    downloadFile(document.fileUrl, document.name);
  };

  return (
    <Modal isOpen title="Share Document" onClose={onClose} size="sm">
      <div className="p-6 space-y-5">
        <div className="glass rounded-xl p-4 flex items-center gap-3 border border-dark-100 dark:border-dark-700">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📄</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-dark-900 dark:text-white truncate">{document?.name}</p>
            <p className="text-xs text-dark-400">Ready to share</p>
          </div>
        </div>

        {/* Share link */}
        <div>
          <p className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Share Link</p>
          {!shareLink ? (
            <button
              onClick={generateLink}
              disabled={loading}
              className="btn-secondary w-full"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              Generate Share Link
            </button>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-sm text-dark-600 dark:text-dark-400 truncate">
                {shareLink}
              </div>
              <button onClick={handleCopy} className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors">
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={handleWhatsApp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white bg-[#25D366] hover:bg-[#1db954] transition-colors shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </motion.button>

          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

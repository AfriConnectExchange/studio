"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Share2, Trash2, Loader2, FileIcon, AlertCircle, CheckCircle, Copy } from 'lucide-react';
// Firebase Storage integration would be more involved.
// For now, we'll use placeholder data and functions to fix the build.

// Mock FileObject type
type FileObject = {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
};


export default function FileManagementPage() {
    const { user } = useFirebase();
    const [files, setFiles] = useState<FileObject[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            loadFiles();
        }
    }, [user]);

    const loadFiles = async () => {
        setLoading(true);
        setError('');
        // Placeholder logic
        setTimeout(() => {
            setFiles([
                { name: 'example-file-1.pdf', id: '1', updated_at: new Date().toISOString(), created_at: new Date().toISOString(), last_accessed_at: new Date().toISOString(), metadata: { size: 12345 } },
                { name: 'image-of-a-cat.png', id: '2', updated_at: new Date().toISOString(), created_at: new Date().toISOString(), last_accessed_at: new Date().toISOString(), metadata: { size: 54321 } },
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        setError('');
        // Placeholder logic
        setTimeout(() => {
            const newFile: FileObject = {
                name: file.name,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                last_accessed_at: new Date().toISOString(),
                metadata: { size: file.size }
            };
            setFiles(prev => [...prev, newFile]);
            setSuccess('File uploaded successfully (simulation)');
            setUploading(false);
        }, 1500);
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        handleFileUpload(fileList[0]);
        event.target.value = '';
    };


    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);


    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);


    const handleDownload = async (filename: string) => {
        setError('Download functionality is not yet implemented.');
    };

    const handleShare = async (filename: string) => {
        setShareUrl('https://example.com/shared-file-link-simulation');
        setSelectedFile(filename);
    };

    const handleDelete = async () => {
        if (!fileToDelete) return;
        setFiles(prev => prev.filter(f => f.name !== fileToDelete));
        setSuccess('File deleted successfully (simulation)');
        setShowDeleteDialog(false);
        setFileToDelete(null);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setError('Failed to copy to clipboard');
        }
    };


    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>File Management</CardTitle>
                    <CardDescription>Upload, download, and share your files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-4">
                            <CheckCircle className="h-4 w-4"/>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center justify-center w-full">
                        <label
                            className={`w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border-2 cursor-pointer transition-colors ${
                                isDragging
                                    ? 'border-primary-500 border-dashed bg-primary-50'
                                    : 'border-primary-600 hover:bg-primary-50'
                            }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="w-8 h-8"/>
                            <span className="mt-2 text-base">
                                {uploading
                                    ? 'Uploading...'
                                    : isDragging
                                        ? 'Drop your file here'
                                        : 'Drag and drop or click to select a file (max 50mb)'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleInputChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div className="space-y-4">
                        {loading && (
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin"/>
                            </div>
                        )}
                        {files.length === 0 ? (
                            <p className="text-center text-gray-500">No files uploaded yet</p>
                        ) : (
                            files.map((file) => (
                                <div
                                    key={file.name}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FileIcon className="h-6 w-6 text-gray-400"/>
                                        <span className="font-medium">{file.name.split('/').pop()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDownload(file.name)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Download"
                                        >
                                            <Download className="h-5 w-5"/>
                                        </button>
                                        <button
                                            onClick={() => handleShare(file.name)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                            title="Share"
                                        >
                                            <Share2 className="h-5 w-5"/>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFileToDelete(file.name);
                                                setShowDeleteDialog(true);
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Share Dialog */}
                    <Dialog open={Boolean(shareUrl)} onOpenChange={() => {
                        setShareUrl('');
                        setSelectedFile(null);
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share {selectedFile?.split('/').pop()}</DialogTitle>
                                <DialogDescription>
                                    Copy the link below to share your file. This link will expire in 24 hours.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 p-2 border rounded bg-gray-50"
                                />
                                <button
                                    onClick={() => copyToClipboard(shareUrl)}
                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative"
                                >
                                    <Copy className="h-5 w-5"/>
                                    {showCopiedMessage && (
                                        <span
                                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                                            Copied!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete File</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this file? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}

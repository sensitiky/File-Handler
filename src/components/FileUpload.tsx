"use client";
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import usePersistedState from "@/hooks/usePersistedState";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`;

const UploadButton = styled(motion.button)`
  background: #007aff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background 0.3s;
  &:disabled {
    background: #d1d1d6;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #005bb5;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  width: 100%;
`;

const FileItem = styled(motion.li)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const FileLink = styled.a`
  color: #007aff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
`;

const RenameDialog = styled(DialogContent)`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DeleteDialog = styled(DialogContent)`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #007aff;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s;
  &:hover {
    background: #f0f8ff;
  }
`;

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [renameUrl, setRenameUrl] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [name, setName] = usePersistedState<string>("name", "John Doe");

  useEffect(() => {
    setLoadingFiles(true);
    setTimeout(() => {
      setLoadingFiles(false);
    }, 5000);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadedFiles((prev) => [...prev, data.url]);
    } catch (error) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async () => {
    if (!renameUrl || !newName) return;

    try {
      const response = await fetch("/api/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: renameUrl, newName }),
      });

      if (!response.ok) {
        throw new Error("Rename failed");
      }

      const data = await response.json();
      setUploadedFiles((prev) =>
        prev.map((url) => (url === renameUrl ? data.url : url))
      );
      setRenameUrl(null);
      setNewName("");
    } catch (error) {
      setError("Rename failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteUrl) return;

    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: deleteUrl }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setUploadedFiles((prev) =>
        prev.filter((fileUrl) => fileUrl !== deleteUrl)
      );
      setDeleteUrl(null);
    } catch (error) {
      setError("Delete failed. Please try again.");
    }
  };

  return (
    <PageContainer>
      <Container>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <DropzoneContainer>
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : file ? (
              <p>Selected file: {file.name}</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </DropzoneContainer>
        </div>
        <UploadButton
          onClick={handleUpload}
          disabled={!file || uploading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </UploadButton>
        {error && <ErrorMessage>Error: {error}</ErrorMessage>}
        {loadingFiles ? (
          <div></div>
        ) : (
          <FileList>
            {uploadedFiles.map((url) => (
              <FileItem
                key={url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FileLink href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </FileLink>
                <div>
                  <IconButton onClick={() => setRenameUrl(url)}>
                    <Pencil1Icon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteUrl(url)}>
                    <TrashIcon />
                  </IconButton>
                </div>
              </FileItem>
            ))}
          </FileList>
        )}
        {renameUrl && (
          <Dialog open={!!renameUrl} onOpenChange={() => setRenameUrl(null)}>
            <DialogOverlay />
            <RenameDialog>
              <DialogTitle>Rename File</DialogTitle>
              <DialogDescription>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new file name"
                />
                <button className="m-6" onClick={handleRename}>
                  Save
                </button>
                <DialogClose asChild>
                  <button>Cancel</button>
                </DialogClose>
              </DialogDescription>
            </RenameDialog>
          </Dialog>
        )}
        {deleteUrl && (
          <Dialog open={!!deleteUrl} onOpenChange={() => setDeleteUrl(null)}>
            <DialogOverlay />
            <DeleteDialog>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this file?
                <div>
                  <button className="m-6" onClick={handleDelete}>
                    Yes
                  </button>
                  <DialogClose asChild>
                    <button>No</button>
                  </DialogClose>
                </div>
              </DialogDescription>
            </DeleteDialog>
          </Dialog>
        )}
      </Container>
    </PageContainer>
  );
};

export default FileUpload;

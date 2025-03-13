
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ProjectDocument } from '@/components/projects/useProjects';

interface ProjectDocumentsProps {
  projectId: string;
  documents: ProjectDocument[];
}

const ProjectDocuments = ({ projectId, documents }: ProjectDocumentsProps) => {
  const navigate = useNavigate();

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Files attached to this project</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {documents.map((doc, index) => (
            <li key={index}>
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate">{doc.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/project/${projectId}/documents`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Manage Documents
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectDocuments;

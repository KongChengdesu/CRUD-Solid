interface FolderContent {
  name: string;
  url: string;
  items: Array<{
    name: string;
    url: string;
    isFolder: boolean;
  }>;
}

interface FileViewerProps {
  file: {
    name: string;
    url: string;
  };
  onClose: () => void;
  content: string;
}

interface CreateItemForm {
  name: string;
  type: "folder" | "file";
  content?: string;
}

interface TurtleData {
  type?: string;
  properties: {
    [key: string]: string | string[];
  };
}

interface PodInfo {
  baseUrl: string;
  provider: string;
  username: string;
}

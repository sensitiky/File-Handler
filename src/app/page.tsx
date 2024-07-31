import ErrorBoundary from '@/components/ErrorBoundary';
import FileUpload from '@/components/FileUpload';

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <FileUpload />
    </ErrorBoundary>
  );
};

export default Home;
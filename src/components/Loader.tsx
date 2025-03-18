import { LoaderWrapper, LoaderSpinner } from '../styles/Loader.styles';

interface LoaderProps {
  isVisible: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <LoaderWrapper>
      <LoaderSpinner />
    </LoaderWrapper>
  );
};

export default Loader; 
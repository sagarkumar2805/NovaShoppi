import Spinner from 'react-bootstrap/Spinner';

// Component to display a loading spinner
export default function LoadingBox() {
  return (
    // Use the Spinner component from react-bootstrap
    <Spinner animation="border" role="status">
      {/* Visually hidden text to provide context for screen readers */}
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

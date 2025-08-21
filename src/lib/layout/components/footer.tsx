export const Footer = () => {
  return (
    <footer className="wrapper">
      <div className="flex">
        <p className="text-xs">
          {new Date().getFullYear()} - Made with ❤️ by{' '}
          <a
            href="https://github.com/highintoxic"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium"
          >
            highintoxic
          </a>
        </p>
      </div>
    </footer>
  );
};

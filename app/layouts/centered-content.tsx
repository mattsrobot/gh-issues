import "./styles.centered-content.css";

type CenteredContentProps = {
    className?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
};

function CenteredContent({ children, className }: CenteredContentProps) {
    return (
        <div className={`rw-centered-content ${className}`}>
            {children}
        </div>
    );
}

CenteredContent.displayName = 'CenteredContent';
CenteredContent.defaultProps = defaultProps;

export default CenteredContent;

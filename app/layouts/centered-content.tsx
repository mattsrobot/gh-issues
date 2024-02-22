import "./styles.centered-content.css";

type CenteredContentProps = {
    className?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
};

function CenteredContent(props: CenteredContentProps) {
    const { children, className } = props;
    return (
        <div className={`rw-centered-content ${className}`}>
            {children}
        </div>
    );
}

CenteredContent.displayName = 'CenteredContent';
CenteredContent.defaultProps = defaultProps;

export default CenteredContent;

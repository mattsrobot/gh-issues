import "./styles.list-header.css";

type ListHeaderProps = {
    className?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
};

function ListHeader(props: ListHeaderProps) {
    const { children, className } = props;
    return (
        <div className={`rw-list-header ${className}`}>
            {children}
        </div>
    );
}

ListHeader.displayName = 'ListHeader';
ListHeader.defaultProps = defaultProps;

export default ListHeader;

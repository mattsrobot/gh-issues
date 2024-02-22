import "./styles.list.css";

type ListProps = {
    className?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
};

function List(props: ListProps) {
    const { children, className } = props;
    return (
        <section className={`rw-list ${className}`}>
            {children}
        </section>
    );
}

List.displayName = 'List';
List.defaultProps = defaultProps;

export default List;

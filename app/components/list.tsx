import "./styles.list.css";

type ListProps = {
    className?: string
    blur?: boolean;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    blur: false
};

function List(props: ListProps) {
    const { children, className, blur } = props;
    let styles = "rw-list";

    if (blur) {
        styles = `${styles} rw-list-blur`;
    }

    styles = `${styles} ${className}`;

    return (
        <section className={styles}>
            {children}
        </section>
    );
}

List.displayName = 'List';
List.defaultProps = defaultProps;

export default List;

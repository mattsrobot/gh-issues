import "./styles.list.css";

import Card from "./card";

type ListProps = {
    className?: string;
    size: "1" | "2" | "3";
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
};

function List(props: ListProps) {
    const { children, size, className } = props;
    return (
        <Card className={`rw-list ${className}`} size={size}>
            {children}
        </Card>
    );
}

List.displayName = 'List';
List.defaultProps = defaultProps;

export default List;

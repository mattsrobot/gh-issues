import "./styles.label.css";

type LabelProps = {
    className?: string;
    size: "1" | "2" | "3";
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
};

function Label(props: LabelProps) {
    const { children, size, className } = props;
    const styles = `rw-label rw-size-${size} ${className}`;
    return (
        <span className={styles}>
            {children}
        </span>
    );
}

Label.displayName = 'Label';
Label.defaultProps = defaultProps;

export default Label;

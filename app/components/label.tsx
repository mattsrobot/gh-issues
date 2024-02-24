import "./styles.label.css";

type LabelProps = {
    className?: string;
    size: "1" | "2" | "3"
    style?: React.CSSProperties
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
};

function Label({ children, size, style, className }: LabelProps) {
    const styles = `rw-label rw-size-${size} ${className}`;
    return (
        <span style={style} className={styles}>
            {children}
        </span>
    );
}

Label.displayName = 'Label';
Label.defaultProps = defaultProps;

export default Label;

import "./styles.text.css";

type TextProps = {
    className?: string;
    weight: "light" | "regular" | "medium" | "semi-bold" | "bold" | "extra-bold";
    color: "text" | "muted" | "on-emphasis" | "disabled" | "link" | "success" | "attention" | "severe" | "danger" | "open" | "closed" | "done";
    size: "1" | "2" | "3" | "4";
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    weight: "regular",
    size: "2",
    color: "text",
    className: "",
};

function Text(props: TextProps) {
    const { className, children, weight, size, color } = props;
    const styles = `rw-text rw-text-weight-${weight} rw-text-color-${color} rw-size-${size} ${className}`;
    return (
        <span className={styles}>
            {children}
        </span>
    );
}

Text.displayName = 'Text';
Text.defaultProps = defaultProps;

export default Text;

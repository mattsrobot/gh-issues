import "./styles.button.css";

type ButtonProps = {
    className?: string;
    size: "1" | "2" | "3";
    variant: "default" | "outlined" | "ghost";
    muted?: boolean;
    onClick?: () => void;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
    variant: "default",
    muted: false,
};

function Button(props: ButtonProps) {
    const { onClick, children, size, variant, muted, className } = props;
    let styles = `rw-reset rw-button rw-size-${size} rw-button-${variant} ${className}`;
    if (muted) {
        styles = `${styles} rw-button-muted`;
    }
    return (
        <button className={styles} onClick={onClick}>
            {children}
        </button>
    );
}

Button.displayName = 'Button';
Button.defaultProps = defaultProps;

export default Button;

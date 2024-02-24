import "./styles.button.css";

type ButtonProps = {
    className?: string;
    size: "1" | "2" | "3";
    variant: "default" | "outlined" | "ghost";
    disabled?: boolean;
    muted?: boolean;
    onClick?: () => void;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
    variant: "default",
    muted: false,
    disabled: false,
};

function Button({ onClick, children, size, variant, muted, disabled, className }: ButtonProps) {
    let styles = `rw-reset rw-button rw-size-${size} rw-button-${variant}`;

    if (muted) {
        styles = `${styles} rw-button-muted`;
    }

    if (disabled) {
        styles = `${styles} rw-button-disabled`;
    }

    styles = `${styles} ${className}`;

    return (
        <button className={styles} onClick={onClick}>
            {children}
        </button>
    );
}

Button.displayName = 'Button';
Button.defaultProps = defaultProps;

export default Button;

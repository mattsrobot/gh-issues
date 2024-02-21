import "./styles.button.css";

type ButtonProps = {
    className?: string;
    size: "1" | "2" | "3";
    variant: "default" | "outlined";
    onClick?: () => void;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
    variant: "default",
};

function Button(props: ButtonProps) {
    const { onClick, children, size, variant, className } = props;
    const styles = `rw-reset rw-button rw-size-${size} rw-button-${variant} ${className}`;
    return (
        <button className={styles} onClick={onClick}>
            {children}
        </button>
    );
}


Button.displayName = 'Button';
Button.defaultProps = defaultProps;

export default Button;

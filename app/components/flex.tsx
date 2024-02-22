import "./styles.flex.css";

type FlexProps = {
    className?: string;
    direction: "row" | "column";
    gap: "0" | "1" | "2" | "3" | "4" | "5"
    align: "center" | "start" | "end" | "baseline" | "stretch"
    padding: "0" | "1" | "2" | "3" | "4" | "5"
    auto?: boolean;
    shrink?: boolean;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    direction: "row",
    gap: "0",
    align: "start",
    padding: "0",
    auto: false,
    shrink: false,
};

function Flex(props: FlexProps) {
    const { direction, className, gap, align, padding, auto, shrink, children } = props;
    let styles = `rw-flex rw-flex-${direction} rw-flex-gap-${gap} rw-flex-align-${align} rw-flex-padding-${padding} ${className}`;

    if (auto) {
        styles = `${styles} rw-flex-auto`;
    }

    if (shrink) {
        styles = `${styles} rw-flex-shrink`;
    }

    styles = `${styles} ${className}`;

    return (
        <div className={styles}>
            {children}
        </div>
    );
}

Flex.displayName = 'Flex';
Flex.defaultProps = defaultProps;

export default Flex;

import "./styles.search-textfield.css";

import { SearchIcon } from '@primer/octicons-react';

type SearchTextFieldProps = {
    className?: string
    onChange?: (value: string) => void
    placeholder?: string
    defaultValue?: string
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    placeholder: "",
    defaultValue: "",
    className: "",
    onChange: (_: string) => { },
};

function SearchTextField({ className, placeholder, onChange, defaultValue }: SearchTextFieldProps) {
    const styles = `rw-reset rw-search-textfield`;
    return (
        <div className={`rw-search-textfield-container ${className}`}>
            <input className={styles} placeholder={placeholder} defaultValue={defaultValue} onChange={(e) => onChange(e.currentTarget.value)} />
            <SearchIcon size={16} className="rw-search-icon" />
        </div>

    );
}

SearchTextField.displayName = 'SearchTextField';
SearchTextField.defaultProps = defaultProps;

export default SearchTextField;

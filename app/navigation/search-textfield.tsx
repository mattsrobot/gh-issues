import "./styles.search-textfield.css";

import { SearchIcon } from '@primer/octicons-react';

type SearchTextFieldProps = {
    className?: string;
    placeholder?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    placeholder: "",
    className: "",
};

function SearchTextField(props: SearchTextFieldProps) {
    const { className, placeholder } = props;
    const styles = `rw-reset rw-search-textfield`;
    return (
        <div className={`rw-search-textfield-container ${className}`}>
            <input className={styles} placeholder={placeholder} />
            <SearchIcon size={16} className="rw-search-icon" />
        </div>

    );
}

SearchTextField.displayName = 'SearchTextField';
SearchTextField.defaultProps = defaultProps;

export default SearchTextField;

import { useContext, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { GraphContext } from "../../contexts/GraphContext";
import { ALGORITHMS } from "../../constants";

const SearchBar = ()=> {

    const {setAlgorithm} = useContext(GraphContext);
    return (
        <>
        <Typeahead
  onChange={([selected]) => {
    setAlgorithm(selected);
    }}
    options={Object.values(ALGORITHMS)}
/>
 </>
    )

}

export default SearchBar;
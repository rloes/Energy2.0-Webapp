import { useEffect, useState } from 'react';
/**
 * Function checks whether propNames of two objects are equal
 * @param subject
 * @param target
 * @param propNames
 */
const isPropValuesEqual = (subject, target, propNames) => (propNames.every(propName => subject[propName] === target[propName]));
/**
 * returns Array of Objects without duplicates
 * @param items - items that should be made distinct
 * @param propNames - objects are considered equal if values of all propNames are equal
 *
 */
const getUniqueItemsByProperties = (items, propNames) => {
    return items.filter((item, index, array) => (
        //only true if object is the first in the array with given properties
        index === array.findIndex(foundItem => isPropValuesEqual(foundItem, item, propNames))));
};
/**
 * returns Array of objects that include only object which are in each array in itemsArray.
 * @param itemArray
 * @param property - objects are considered equal if theire values of property are eaual
 *
 * time complexity:
 */
const getIntersectionByProperty = (itemArray, property) => {
    let result = itemArray[0];
    for (let i = 1; i < itemArray.length; i++) {
        result = result.filter(n => itemArray[i].findIndex(n2 => n[property] === n2[property]) > -1);
    }
    return result;
};
function useFilter({params, data, mutator}) {
    const [value, setValue] = useState([]);
    // parameter that should be used in apply
    const [filterParams, setFilterParams] = useState(params);
    const [query, setQuery] = useState("")
    const handleFilterParamChange = (e) => {
        const { name, checked } = e.target;
        setFilterParams(Object.assign(Object.assign({}, filterParams), { [name]: checked }));
    };
    const [selectedFilterParams, setSelectedFilterParam] = useState(() => Object.keys(filterParams).filter(key => filterParams[key] === true));
    useEffect(() => {
        setSelectedFilterParam(Object.keys(filterParams).filter(key => filterParams[key] === true));
    }, [filterParams]);
    /**
     * Function filters data by checking which data-object exist where all words in query match at least one
     * given props.parameter (match means at least substring)
     *
     */
    const applyFilter = () => {
        const queryArray = query.split(' '); //Array of words in query
        let queryResults = [];
        queryArray.forEach((query) => {
            let queryResult = [];
            selectedFilterParams.forEach((param) => {
                const res = data?.filter((object) => {
                    if (object[param] !== undefined) {
                        let queryValue = query.toLowerCase();
                        let dataValue = String(object[param]).toLowerCase();
                        if (mutator) {
                            queryValue = mutator(param, queryValue, dataValue)[0];
                            dataValue = mutator(param, queryValue, dataValue)[1];
                        }
                        return dataValue.includes(queryValue);
                    }
                });
                if (res) {
                    queryResult = [...queryResult, ...res];
                }
            });
            //push results of current query word without duplicates
            queryResults.push(getUniqueItemsByProperties(queryResult, ['id']));
        });
        //set all results to value that are included in results of every query word
        setValue(getIntersectionByProperty(queryResults, 'id'));
    };
    useEffect(() => {
        if (query !== "") {
            applyFilter();
        }
    }, [query, data, selectedFilterParams]);
    return { value, filterParams, handleFilterParamChange, setQuery, query};
}
export default useFilter;
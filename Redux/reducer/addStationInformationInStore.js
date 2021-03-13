import { ADD_STATION_INFORMARTIONS, ADD_STATION_STATUS, ADD_SEARCHED_DATA } from '../constants';

const initialState = {
    stationsInformation: [],
    stationsStatus: [],
    searchedData: []
};

export const stationsReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_STATION_INFORMARTIONS:
            return {
                ...state, 
                stationsInformation: action.payload
            }
        case ADD_STATION_STATUS:
            return {
                ...state, 
                stationsStatus: action.payload
            }
        case ADD_SEARCHED_DATA: 
            return {
                ...state, 
                searchedData: action.payload
            }
        default:
            return state
    };
};

import { ADD_STATION_INFORMARTIONS, ADD_STATION_STATUS, ADD_SEARCHED_DATA} from '../constants';

export const setStationInformations = (data) => {
    return async dispatch => {
        dispatch({
            type: ADD_STATION_INFORMARTIONS,
            payload: data
        })
    };
};
export const setStationStatus = (data) => {
    return async dispatch => {
        dispatch({
            type: ADD_STATION_STATUS,
            payload: data
        })
    }
};
export const setSearchedData = (data) => {
    return async dispatch => {
        dispatch({
            type: ADD_SEARCHED_DATA,
            payload: data
        })
    }

}

